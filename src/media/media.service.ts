import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import { Media, MediaType } from './media.entity';
import { MediaResponseDto, UploadMediaDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly repo: Repository<Media>,
  ) {}

  // 🔥 SAVE GENERIC FILE
  async saveFile(
    file: Express.Multer.File,
    userId: string,
    dto?: UploadMediaDto,
  ): Promise<MediaResponseDto> {
    try {
      const normalizedPath = this.normalizePath(file.path);

      const media = this.repo.create({
        filename: file.filename,
        mimetype: file.mimetype,
        path: normalizedPath,
        ownerId: userId,
        description: dto?.description?.trim() || null,
        type: dto?.type ?? this.detectType(file.mimetype),
      });

      const saved = await this.repo.save(media);
      return this.toResponse(saved);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save file');
    }
  }

  // 🔥 PROFILE PHOTO (spécialisé)
  async saveProfilePhoto(
    file: Express.Multer.File,
    userId: string,
  ): Promise<MediaResponseDto> {
    try {
      const normalizedPath = this.normalizePath(file.path);

      const media = this.repo.create({
        filename: file.filename,
        mimetype: file.mimetype,
        path: normalizedPath,
        ownerId: userId,
        description: 'profile-photo',
        type: MediaType.IMAGE,
      });

      const saved = await this.repo.save(media);
      return this.toResponse(saved);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save profile photo');
    }
  }

  // 🔍 GET FILE
  async getFile(id: string): Promise<Media> {
    const file = await this.repo.findOneBy({ id });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  // 🔐 GET OWNED FILE
  async getOwnedFile(id: string, userId: string): Promise<Media> {
    const file = await this.repo.findOneBy({ id, ownerId: userId });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  // 🗑 DELETE FILE
  async deleteFile(id: string, userId?: string): Promise<void> {
    const file = userId
      ? await this.getOwnedFile(id, userId)
      : await this.getFile(id);

    try {
      await fs.unlink(file.path);
    } catch {
      // fichier déjà supprimé ou inaccessible → on ignore
    }

    await this.repo.remove(file);
  }

  // 🔗 RESPONSE FORMAT
  private toResponse(media: Media): MediaResponseDto {
    return {
      id: media.id,
      type: media.type,
      url: this.buildFileUrl(media.path),
      created_at: media.createdAt,
    };
  }

  // 🌐 BUILD URL (IMPORTANT)
  private buildFileUrl(path: string): string {
    return `/${path}`; // ex: /uploads/profiles/uuid.jpg
  }

  // 🧼 NORMALIZE PATH
  private normalizePath(path: string): string {
    return path.replace(/\\/g, '/').replace(/^\.?\//, '');
  }

  // 🧠 DETECT TYPE
  private detectType(mimetype: string): MediaType {
    if (mimetype.startsWith('image/')) return MediaType.IMAGE;
    if (mimetype.startsWith('video/')) return MediaType.VIDEO;
    return MediaType.DOCUMENT;
  }
}