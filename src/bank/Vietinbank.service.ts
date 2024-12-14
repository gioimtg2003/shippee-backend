import { CryptoService } from '@features/crypto';
import { RedisCacheService } from '@features/redis';
import { IVietinbankResponse } from '@interfaces';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { bypassCaptcha } from '@utils';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import qs from 'qs';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class VietinbankService {
  private readonly logger = new Logger(VietinbankService.name);
  private readonly BROWSER_INFO = 'Chrome-98.04758102';
  private readonly LANG = 'vi';
  private readonly CLIENT_INFO = '127.0.0.1;MacOSProMax';
  private captcha_id: string | null = null;
  private captcha_code: string | null = null;

  private readonly CACHE_KEY = {
    LOGIN: 'vtb_login',
    SESSION: 'vtb_session',
  };

  private readonly url = {
    captcha: 'https://api-ipay.vietinbank.vn/api/get-captcha/',
    login: 'https://api-ipay.vietinbank.vn/ipay/wa/signIn',
    getCustomerDetails:
      'https://api-ipay.vietinbank.vn/ipay/wa/getCustomerDetails',
    getEntitiesAndAccounts:
      'https://api-ipay.vietinbank.vn/ipay/wa/getEntitiesAndAccounts',
    getCmsData: 'https://api-ipay.vietinbank.vn/ipay/wa/getCmsData',
    getBillPayees: 'https://api-ipay.vietinbank.vn/ipay/wa/getBillPayees',
    creditAccountList:
      'https://api-ipay.vietinbank.vn/ipay/wa/creditAccountList',
    getAvgAccountBal: 'https://api-ipay.vietinbank.vn/ipay/wa/getAvgAccountBal',
    getHistTransactions:
      'https://api-ipay.vietinbank.vn/ipay/wa/getHistTransactions',
    getAccountDetails:
      'https://api-ipay.vietinbank.vn/ipay/wa/getAccountDetails',
    getCodeMapping: 'https://api-ipay.vietinbank.vn/ipay/wa/getCodeMapping',
    napasTransfer: 'https://api-ipay.vietinbank.vn/ipay/wa/napasTransfer',
    makeInternalTransfer:
      'https://api-ipay.vietinbank.vn/ipay/wa/makeInternalTransfer',
    getPayees: 'https://api-ipay.vietinbank.vn/ipay/wa/getPayees',
    authenSoftOtp: 'https://api-ipay.vietinbank.vn/ipay/wa/authenSoftOtp',
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: RedisCacheService,
    private readonly cryptoService: CryptoService,
  ) {}

  async login(username: string, password: string) {
    const requestId = this.generateRequestId();
    const captcha_code = await this.getCaptcha();

    const params = {
      accessCode: password,
      browserInfo: this.BROWSER_INFO,
      captchaCode: captcha_code,
      captchaId: this.captcha_id,
      clientInfo: this.CLIENT_INFO,
      lang: this.LANG,
      requestId: requestId,
      userName: username,
      screenResolution: '1201x344',
    };

    const headers = await this.createHeaderNull();
    const body = await this.handleBodyRequest(params);
    const { data } = await firstValueFrom(
      this.httpService
        .post<IVietinbankResponse>(
          `${this.url.login}`,
          {
            ...body,
          },
          {
            headers,
            timeout: 10000,
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            this.cacheService.del(this.CACHE_KEY.LOGIN);
            throw error;
          }),
        ),
    );
    await this.cacheService.set({
      record: { key: this.CACHE_KEY.SESSION, value: data.sessionId },
      expires: 60 * 5,
    });

    await this.cacheService.set({
      record: { key: this.CACHE_KEY.LOGIN, value: 'true' },
      expires: 60 * 5,
    });

    return data;
  }

  async getTransaction(
    search: string = '',
    startDate?: string,
    endDate?: string,
    limit?: number,
  ) {
    const isLogin = await this.cacheService.get(this.CACHE_KEY.LOGIN);
    if (isLogin !== 'true') {
      const username = this.cryptoService.decrypt(
        process.env.USERNAME__B_,
        process.env.ENCRYPTION_KEY_ACCOUNT,
      );
      const access = this.cryptoService.decrypt(
        process.env.ACCESS_CODE__B_,
        process.env.ENCRYPTION_KEY_ACCOUNT,
      );
      await this.login(username, access);
    }

    const requestId = this.generateRequestId();
    const dateNow = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    const accountNumber = this.cryptoService.decrypt(
      process.env.CUSTOMER_NUMBER__B_,
      process.env.ENCRYPTION_KEY_ACCOUNT,
    );
    const params = {
      accountNumber,
      endDate: endDate || dateNow,
      startDate: startDate || yesterday,
      maxResult: String(limit || 10),
      pageNumber: 0,
      requestId: requestId,
      tranType: '',
      lang: this.LANG,
      searchFromAmt: '',
      searchKey: search,
      searchToAmt: '',
    };

    const headers = await this.createHeaderNull();
    const body = await this.handleBodyRequest(params);

    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.url.getHistTransactions}`,
          {
            ...body,
          },
          {
            headers,
            timeout: 10000,
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async getCaptcha() {
    this.captcha_id = this.generateCaptchaId();
    const headers = await this.createHeaderNull();

    this.logger.log(`Get captcha with captcha id: ${this.captcha_id}`);
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.url.captcha}${this.captcha_id}`, {
        headers,
        timeout: 10000,
      }),
    );
    this.captcha_code = String(bypassCaptcha(data));
    return this.captcha_code;
  }

  private async createHeaderNull() {
    const headers = {
      'Accept-Encoding': 'gzip',
      'Accept-Language': 'vi-VN',
      Accept: 'application/json',
      'Cache-Control': 'no-store, no-cache',
      'User-Agent': 'okhttp/3.11.0',
    };

    const isLogin = await this.cacheService.get(this.CACHE_KEY.LOGIN);
    const session = await this.cacheService.get(this.CACHE_KEY.SESSION);

    if (isLogin === 'true' && session) {
      headers['sessionId'] = session;
    }
    return headers;
  }

  private generateRequestId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let requestId = '';

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      requestId += characters[randomIndex];
    }

    return `${requestId}|${Date.now()}`;
  }

  private generateCaptchaId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const captchaId = Array.from({ length: 9 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('');
    return captchaId;
  }

  private async handleBodyRequest(param: {
    [key: string]: string | number | null;
  }) {
    const isLogin = await this.cacheService.get(this.CACHE_KEY.LOGIN);
    const session = await this.cacheService.get(this.CACHE_KEY.SESSION);

    if (isLogin === 'true' && session) {
      param['sessionId'] = session;
    }

    return await this.encryptData(param);
  }

  private async encryptData(data: { [key: string]: string | number | null }) {
    data['signature'] = this.cryptoService
      .md5(
        qs.stringify(data, {
          arrayFormat: 'repeat',
          sort: (a, b) => a.localeCompare(b),
        }),
      )
      .toString();

    const payload = JSON.stringify(data);

    const encrypt = this.cryptoService.encryptRsa(
      payload,
      process.env.VIETINBANK_PUBLIC_KEY,
    );
    return {
      encrypted: encrypt,
    };
  }

  enc() {
    const username = this.cryptoService.encrypt(
      'congggioi.pro',
      process.env.ENCRYPTION_KEY_ACCOUNT,
    );
    const paw = this.cryptoService.encrypt(
      'mypassabcxyz',
      process.env.ENCRYPTION_KEY_ACCOUNT,
    );
    const number = this.cryptoService.encrypt(
      '2930293920',
      process.env.ENCRYPTION_KEY_ACCOUNT,
    );

    return { username, paw, number };
  }
}
