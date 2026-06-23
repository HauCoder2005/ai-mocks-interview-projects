import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from 'minio'
import { MinioConfig } from "src/config/env.interface";
@Injectable()
export class MinioService {
    private readonly logger = new Logger(MinioService.name);
    private readonly client: Client;
    /*
        - tại sao bucket name lại sử dụng và khai báo bên ngoài class ?
        -> vì nó sẽ được sử dụng và tái sử dụng nhiều lần ở các phương thức bên trong 
        cũng giống như bên ttl của redis chúng ta sẽ có lúc phải custom lại nó cho nên việc 
        khai báo bên ngoài như vậy để tạo tái sử dụng bên class
    */
    private readonly bucketName: string;
    constructor(private readonly configService: ConfigService) {
        const minioConfig = this.configService.getOrThrow<MinioConfig>('config.minio');
        
        // kiểm tra xem có nạp env vào thành công chưa
        if(!minioConfig) this.logger.log('Failed to load Minio configuration from environment variables.')
        const minioUrl = new URL(minioConfig.endpoint);
        this.bucketName = minioConfig.bucketName;
        this.client = new Client({
        endPoint: minioUrl.hostname,
        port: Number(minioUrl.port || 9000),
        useSSL: minioUrl.protocol === 'https:',
        accessKey: minioConfig.accessKey,
        secretKey: minioConfig.secretKey,
        region: minioConfig.region,
    });
    }

    async onModuleInit(): Promise<void> {
        const bucketExists = await this.client.bucketExists(this.bucketName)
        if (!bucketExists) {
            await this.client.makeBucket(this.bucketName);

            this.logger.log(`MinIO bucket created: ${this.bucketName}`);
        }
        this.logger.log(`MinIO connected successfully: ${this.bucketName}`);
    }
}