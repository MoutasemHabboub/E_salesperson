import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Hashids from 'hashids';
import { PrismaService } from '../../database';

@Injectable()
export class ImageService {
  public adapter = require('fs-extra');
  /**
   * Name of the driver
   */
  public name = 'local' as const;
  private prefix;
  private baseUrl;
  /**
   * Path prefixer used for prefixing paths with disk root
   */
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.prefix = configService.get('ROOT_PATH');
    this.baseUrl = configService.get('BASE_URL');
  }

  public async uploadImage(
    name: string,
    contents: Buffer | string,
    uploaderId: number,
    mimieType: string,
  ): Promise<string> {
    const hashids = new Hashids(
      name.split('.')[0],
      5,
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    );
    // write file to disk
    // get current date string
    const date = new Date().toISOString().slice(0, 10);
    // construct url
    // check if directory exists
    await this.adapter.ensureDirSync(this.prefix + '/' + date + '/');
    //random number
    const intName = faker.number.int({ min: 1, max: 9999999999999 });
    // generate a url safe name, composed of a new set of url safe characters instead of the original name
    // get the last element of the name.split('.') array
    const extension = name.split('.').slice(-1);
    const urlSafeName =
      hashids.encode(intName) + '_' + Date.now() + '.' + extension;
    // create file
    await this.adapter.writeFile(
      this.prefix + '/' + date + '/' + urlSafeName,
      contents,
    );

    //give the uploaded file permission code of 400
    await this.adapter.chmod(this.prefix + '/' + date + '/' + urlSafeName, 400);

    const url = this.baseUrl + '/' + date + '/' + urlSafeName;

    await this.prisma.image.create({
      data: {
        url: url,
        mimieType,
        Uploader: {
          connect: {
            id: uploaderId,
          },
        },
      },
    });

    return url;
  }

  // delete image

  public async deleteImage(url: string): Promise<any> {
    // check if file exists
    // if not throw not found error
    const fileExists = await this.adapter.pathExists(url);

    if (!fileExists) {
      throw new NotFoundException();
    }

    // delete file from disk
    await this.adapter.remove(url);

    // delete image from database
    return await this.prisma.image.delete({
      where: {
        url: url,
      },
    });
  }
}
