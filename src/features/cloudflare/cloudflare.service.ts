import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '@nestjs/common';
import {
  EXPIRE_GET_BUCKET,
  EXPIRE_SIGNED_URL,
} from 'src/constants/upload.constant';

export class CloudflareService {
  private readonly r2EndPoint = process.env.R2_ENDPOINT_URI;
  private readonly accessKey = process.env.R2_ACCESS_KEY_ID;
  private readonly secretKey = process.env.R2_SECRET_ACCESS_KEY;
  private readonly bucketName = process.env.R2_BUCKET_NAME;
  private readonly logger = new Logger(CloudflareService.name);

  constructor(private s3Client: S3Client) {
    this.logger.log('CloudflareService initialized');
    this.initS3Client();
  }

  private initS3Client() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.r2EndPoint,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  async getSignedUrl(key: string) {
    this.logger.log(`Getting signed url for key: ${key}`);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: 'image/png',
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: EXPIRE_SIGNED_URL,
      signableHeaders: new Set(['content-type']),
    });
  }

  async getBucket(key: string) {
    this.logger.log(`Getting bucket for key: ${key}`);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: EXPIRE_GET_BUCKET,
    });
  }
}
