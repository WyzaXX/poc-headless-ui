import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AwsService } from 'src/aws.service';
import { helloWorld } from './hello-world';

@Controller('component')
export class ComponentController {
  constructor(private awsService: AwsService) {}
  s3 = this.awsService.getS3Instance();

  @Get()
  async getComponent(@Res() res: Response) {
    const s3ObjectKey = 'headless-ui';

    await this.getOtSetComponentToS3(helloWorld(), this.s3, s3ObjectKey, res);
  }

  private async getOtSetComponentToS3(
    component,
    s3,
    s3ObjectKey: string,
    res: Response<any, Record<string, any>>,
  ) {
    try {
      const componentBuffer = await this.getComponentFromS3(s3, s3ObjectKey);

      console.log('got object from s3');

      res.send(componentBuffer);
    } catch (error) {
      const componentHtml = component;
      const componentBuffer = Buffer.from(componentHtml, 'utf-8');

      console.log('not found in s3');

      await this.storeComponentToS3(s3, s3ObjectKey, componentBuffer);

      res.send(componentHtml);
    }
  }

  private async storeComponentToS3(
    s3,
    s3ObjectKey: string,
    componentBuffer: Buffer,
  ) {
    await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3ObjectKey,
        Body: componentBuffer,
        ContentType: 'text/html',
      })
      .promise();
  }

  private async getComponentFromS3(s3, s3ObjectKey: string) {
    const s3Object = await s3
      .getObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: s3ObjectKey })
      .promise();
    const componentBuffer = s3Object.Body as Buffer;
    return componentBuffer;
  }
}
