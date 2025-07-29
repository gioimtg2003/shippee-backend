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

  /**
   * Asynchronously retrieves a captcha code from the Vietinbank service.
   *
   * This method generates a new captcha ID, creates the necessary headers,
   * logs the captcha ID, and then makes an HTTP GET request to retrieve the captcha.
   * The captcha code is then processed and returned.
   *
   * @returns {Promise<string>} A promise that resolves to the captcha code as a string.
   *
   * @throws {Error} If the HTTP request fails or the captcha code cannot be processed.
   */
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

  /**
   * Creates and returns a headers object for HTTP requests.
   * If the user is logged in and a session exists, the 'sessionId' header is also included.
   *
   * @returns {Promise<Record<string, string>>} A promise that resolves to an object containing the headers.
   */
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

  /**
   * Generates a unique request ID.
   *
   * The request ID is a 12-character string composed of uppercase letters and digits,
   * followed by a pipe character (`|`) and the current timestamp in milliseconds.
   *
   * @returns {string} The generated request ID.
   */
  private generateRequestId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let requestId = '';

    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      requestId += characters[randomIndex];
    }

    return `${requestId}|${Date.now()}`;
  }

  /**
   * Generates a random captcha ID consisting of 9 alphanumeric characters.
   *
   * @returns {string} A randomly generated captcha ID.
   */
  private generateCaptchaId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const captchaId = Array.from({ length: 9 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('');
    return captchaId;
  }

  /**
   * Handles the body request by adding a session ID if the user is logged in,
   * and then encrypts the data.
   *
   * @param param - An object containing key-value pairs where the values can be strings, numbers, or null.
   * @returns A promise that resolves to the encrypted data.
   *
   * @throws Will throw an error if the encryption process fails.
   */
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

  /**
   * Encrypts the given data using RSA encryption and adds a signature.
   *
   * @param data - An object containing key-value pairs to be encrypted. The values can be strings, numbers, or null.
   * @returns An object containing the encrypted data.
   *
   * @remarks
   * The function first generates a signature for the data using the MD5 hash algorithm.
   * It then converts the data to a JSON string and encrypts it using RSA encryption with the public key specified in the environment variable `VIETINBANK_PUBLIC_KEY`.
   *
   * @example
   * ```typescript
   * const data = { amount: 1000, currency: 'USD', transactionId: '12345' };
   * const result = await encryptData(data);
   * console.log(result.encrypted); // Encrypted data
   * ```
   */
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

// @Injectable()
// export class VietinbankService {
//   private readonly logger = new Logger(VietinbankService.name);
//   private readonly BROWSER_INFO = 'Chrome-98.04758102';
//   private readonly LANG = 'vi';
//   private readonly CLIENT_INFO = '127.0.0.1;MacOSProMax';
//   private captcha_id: string | null = null;
//   private captcha_code: string | null = null;
//   private sessionId: string | null = null;
//   private isLoggedIn: boolean = false;

//   private readonly CACHE_KEY = {
//     LOGIN: 'vtb_login',
//     SESSION: 'vtb_session',
//   };

//   private readonly url = {
//     captcha: 'https://api-ipay.vietinbank.vn/api/get-captcha/',
//     login: 'https://api-ipay.vietinbank.vn/ipay/wa/signIn',
//     getCustomerDetails:
//       'https://api-ipay.vietinbank.vn/ipay/wa/getCustomerDetails',
//     getEntitiesAndAccounts:
//       'https://api-ipay.vietinbank.vn/ipay/wa/getEntitiesAndAccounts',
//     getCmsData: 'https://api-ipay.vietinbank.vn/ipay/wa/getCmsData',
//     getBillPayees: 'https://api-ipay.vietinbank.vn/ipay/wa/getBillPayees',
//     creditAccountList:
//       'https://api-ipay.vietinbank.vn/ipay/wa/creditAccountList',
//     getAvgAccountBal: 'https://api-ipay.vietinbank.vn/ipay/wa/getAvgAccountBal',
//     getHistTransactions:
//       'https://api-ipay.vietinbank.vn/ipay/wa/getHistTransactions',
//     getAccountDetails:
//       'https://api-ipay.vietinbank.vn/ipay/wa/getAccountDetails',
//     getCodeMapping: 'https://api-ipay.vietinbank.vn/ipay/wa/getCodeMapping',
//     napasTransfer: 'https://api-ipay.vietinbank.vn/ipay/wa/napasTransfer',
//     makeInternalTransfer:
//       'https://api-ipay.vietinbank.vn/ipay/wa/makeInternalTransfer',
//     getPayees: 'https://api-ipay.vietinbank.vn/ipay/wa/getPayees',
//     authenSoftOtp: 'https://api-ipay.vietinbank.vn/ipay/wa/authenSoftOtp',
//   };

//   constructor(
//     private readonly httpService: HttpService,
//     private readonly cacheService: RedisCacheService,
//     private readonly cryptoService: CryptoService,
//     private readonly icbService: ICBService,
//   ) {}

//   async getTransactions({
//     search,
//     endDate,
//     limit,
//     startDate,
//     initHeader,
//     initPayload,
//   }: {
//     search?: string;
//     startDate?: string;
//     endDate?: string;
//     limit?: number;
//     initHeader?: any;
//     initPayload?: any;
//   }) {
//     let isLogin = this.isLoggedIn;

//     if (this.cacheService) {
//       isLogin = (await this.cacheService.get(this.CACHE_KEY.LOGIN)) === 'true';
//       this.sessionId = await this.cacheService.get(this.CACHE_KEY.SESSION);
//     }

//     if (!isLogin) {
//       await this.login('0367093723', 'Gioimtg3723@!');
//       this.sessionId = !this.cacheService
//         ? this.sessionId
//         : await this.cacheService.get(this.CACHE_KEY.SESSION);
//     }
//     const requestId = this.generateRequestId();
//     const dateNow = dayjs().format('YYYY-MM-DD');
//     const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

//     const params = {
//       accountNumber: `0367093723`,
//       endDate: endDate || dateNow,
//       startDate: startDate || yesterday,
//       maxResult: String(limit || 10),
//       pageNumber: 0,
//       requestId: requestId,
//       tranType: '',
//       lang: 'vi',
//       searchFromAmt: '',
//       searchKey: search || '',
//       searchToAmt: '',
//     };

//     const headers = initHeader ?? (await this.createHeaderNull());
//     const body = initPayload ?? (await this.handleBodyRequest(params));

//     const response = await firstValueFrom(
//       this.httpService
//         .post(
//           this.url.getHistTransactions,
//           { ...body },
//           { headers, timeout: 10000 },
//         )
//         .pipe(
//           catchError((error: any) => {
//             throw error;
//           }),
//         ),
//     );
//     return response.data;
//   }

//   async login(username: string, password: string) {
//     const requestId = this.generateRequestId();
//     const captcha_code = await this.getCaptcha();

//     const params = {
//       accessCode: password,
//       browserInfo: this.BROWSER_INFO,
//       captchaCode: captcha_code,
//       captchaId: this.captcha_id,
//       clientInfo: this.CLIENT_INFO,
//       lang: 'vi',
//       requestId: requestId,
//       userName: username,
//       screenResolution: '1201x344',
//     };

//     const headers = await this.createHeaderNull();
//     const body = await this.handleBodyRequest(params);

//     const { data } = await firstValueFrom(
//       this.httpService
//         .post(`${this.url.login}`, { ...body }, { headers, timeout: 10000 })
//         .pipe(
//           catchError(async (error: any) => {
//             if (this.cacheService) {
//               await this.cacheService.del(this.CACHE_KEY.LOGIN);
//             } else {
//               this.isLoggedIn = false;
//               this.sessionId = null;
//             }
//             throw error;
//           }),
//         ),
//     );
//     console.log('data', data);
//     this.sessionId = data.sessionId;
//     this.isLoggedIn = true;

//     return data;
//   }

//   private async handleBodyRequest(param: {
//     [key: string]: string | number | null;
//   }) {
//     let session: string | null = null;
//     if (this.cacheService) {
//       const isLogin = await this.cacheService.get(this.CACHE_KEY.LOGIN);
//       if (isLogin === 'true') {
//         session = await this.cacheService.get(this.CACHE_KEY.SESSION);
//       }
//     } else if (this.isLoggedIn) {
//       session = this.sessionId;
//     }

//     if (session) {
//       param['sessionId'] = session;
//     }
//     return this.encryptData(param);
//   }

//   private encryptData(data: { [key: string]: string | number | null }) {
//     data['signature'] = this.cryptoService
//       .md5(
//         qs.stringify(data, {
//           arrayFormat: 'repeat',
//           sort: (a, b) => a.localeCompare(b),
//         }),
//       )
//       .toString();

//     const payload = JSON.stringify(data);
//     const encrypt = this.cryptoService.encryptRsa(
//       payload,
//       process.env.VIETINBANK_PUBLIC_KEY,
//     );

//     return {
//       encrypted: encrypt,
//     };
//   }
//   async getCaptcha() {
//     this.captcha_id = this.generateCaptchaId();
//     const headers = await this.createHeaderNull();

//     const { data } = await firstValueFrom(
//       this.httpService.get(`${this.url.captcha}${this.captcha_id}`, {
//         headers,
//         timeout: 10000,
//       }),
//     );
//     this.captcha_code = String(bypassCaptcha(data));
//     return this.captcha_code;
//   }

//   private generateRequestId(): string {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let requestId = '';

//     for (let i = 0; i < 12; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       requestId += characters[randomIndex];
//     }

//     return `${requestId}|${Date.now()}`;
//   }

//   private generateCaptchaId(): string {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     const captchaId = Array.from({ length: 9 }, () =>
//       characters.charAt(Math.floor(Math.random() * characters.length)),
//     ).join('');
//     return captchaId;
//   }

//   private async createHeaderNull() {
//     const headers = {
//       'Accept-Encoding': 'gzip',
//       'Accept-Language': 'vi-VN',
//       Accept: 'application/json',
//       'Cache-Control': 'no-store, no-cache',
//       'User-Agent': 'okhttp/3.11.0',
//     };

//     let session: string | null = null;
//     if (this.cacheService) {
//       const isLogin = await this.cacheService.get(this.CACHE_KEY.LOGIN);
//       if (isLogin === 'true') {
//         session = await this.cacheService.get(this.CACHE_KEY.SESSION);
//       }
//     } else if (this.isLoggedIn) {
//       session = this.sessionId;
//     }

//     if (session) {
//       headers['sessionId'] = session;
//     }
//     return headers;
//   }
// }
