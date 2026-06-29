import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseUUIDPipe,
  UseGuards,
  Req,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserRole, UserStatus } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// 🔥 SWAGGER
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

type AuthRequest = Request & {
  user: {
    id: string;
    role: UserRole;
  };
};

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔥 CREATE USER
  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.create(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  // 🔥 GET ALL USERS (ADMIN)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (Admin uniquement)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  // 🔥 ADMIN UPDATE
  @ApiOperation({ summary: 'Modifier rôle ou statut (Admin uniquement)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID utilisateur' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: Object.values(UserRole) },
        status: { type: 'string', enum: Object.values(UserStatus) },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/admin')
  async adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { role?: UserRole; status?: UserStatus },
  ) {
    return this.userService.adminUpdate(id, data);
  }

  // 🔥 GET ONE USER
  @ApiOperation({ summary: 'Récupérer un utilisateur' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<Omit<User, 'password'>> {
    const currentUser = req.user;

    if (currentUser.id !== id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userService.findOne(id);
    const { password, ...result } = user;
    return result;
  }

  // 🔥 UPDATE OWN PROFILE
  @ApiOperation({ summary: 'Modifier son propre compte' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID utilisateur' })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthRequest,
  ): Promise<Omit<User, 'password'>> {
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your account');
    }

    const user = await this.userService.update(id, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

  // 🔥 DELETE USER (ADMIN)
  @ApiOperation({ summary: 'Supprimer un utilisateur (Admin uniquement)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
