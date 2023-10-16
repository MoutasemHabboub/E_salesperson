import {
  Controller,
  Post,
  Delete,
  Query,
  UseGuards,
  Logger,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Express } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { CurrentUser } from '@app/common';
import { ImageService } from '../services/image.service';
import { ROLE } from '../enum/role.enum';
@Controller({
  version: '1',
  path: 'images',
})
@ApiTags('Image')
@UseGuards(AuthGuard(['jwt']))
@ApiBearerAuth()
export class ImageController {
  private logger: Logger = new Logger('ImageController');
  constructor(private imageUploadService: ImageService) {}

  @Post()
  @UseGuards(AuthGuard(['jwt']))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'The image has been successfully uploaded.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAnImage(
    @CurrentUser() user,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file.mimetype.startsWith('image')) {
      throw new Error('File is not an image');
    }
    return this.imageUploadService.uploadImage(
      file.originalname,
      file.buffer,
      user.id,
      file.mimetype,
    );
  }
  @Get(':id')
  async getDatabaseFileById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response,
  ) {
    const file = await this.imageUploadService.getFileByUid(Number(id));
    response.set({
      'Content-Disposition': `inline; filename="${file.name}"`,
      'Content-Type': file.mimieType,
    });
    return new StreamableFile(file.stream);
  }

  @Delete()
  @UseGuards(RoleGuard([ROLE.ADMIN]))
  @ApiQuery({
    name: 'url',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The image has been successfully deleted.',
  })
  async deleteAnImage(@Query('url') url: string) {
    return this.imageUploadService.deleteImage(url);
  }
}
