import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  Req,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { v4 as uuidv4 } from 'uuid';

// 🔥 SWAGGER
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MAX_FILE_SIZE = 2 * 1024 * 1024;

// 🔥 SECURE EXTENSION
function getExtensionFromMime(mimetype: string): string {
  switch (mimetype) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      throw new Error('Unsupported file type');
  }
}

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // 🔥 UPLOAD PHOTO (SWAGGER READY)
  @ApiOperation({ summary: 'Upload photo de profil' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichier image (jpg, png, webp)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploadée avec succès',
  })
  @UseGuards(JwtAuthGuard)
  @Post('profile-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (_, file, cb) => {
          try {
            const ext = getExtensionFromMime(file.mimetype);
            cb(null, `${uuidv4()}${ext}`);
          } catch (err) {
            //cb(err, "null");
          }
        },
      }),
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
      fileFilter: (_, file, cb) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Format image non autorisé (jpg, png, webp uniquement)',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { id: string } },
  ) {
    if (!file) {
      throw new BadRequestException('Une image est requise');
    }

    return this.mediaService.saveProfilePhoto(file, req.user.id);
  }

  // 🔥 DELETE
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un fichier' })
  @ApiResponse({ status: 204, description: 'Fichier supprimé' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    await this.mediaService.deleteFile(id, req.user.id);
  }
}