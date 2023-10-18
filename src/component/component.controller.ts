import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AwsService } from 'src/aws.service';

@Controller('component')
export class ComponentController {
  constructor(private awsService: AwsService) {}

  @Get()
  async getComponent(@Res() res: Response) {
    const s3 = this.awsService.getS3Instance();
    const s3BucketName = 'headless-ui-poc';
    const s3ObjectKey = 'headless-ui5';

    try {
      const s3Object = await s3
        .getObject({ Bucket: s3BucketName, Key: s3ObjectKey })
        .promise();
      const componentBuffer = s3Object.Body as Buffer;

      console.log('got object from s3');

      res.send(componentBuffer);
    } catch (error) {
      const componentHtml = '<div>Hello, Headless UI Component!</div>';
      const componentBuffer = Buffer.from(componentHtml, 'utf-8');

      console.log('not found in s3');

      await s3
        .upload({
          Bucket: s3BucketName,
          Key: s3ObjectKey,
          Body: componentBuffer,
          ContentType: 'text/html',
        })
        .promise();

      res.send(componentHtml);
    }
  }
}
