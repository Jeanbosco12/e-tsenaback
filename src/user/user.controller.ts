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
<<<<<<< HEAD
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * //@UseGuards(JwtAuthGuard)
 * Izay route ho sécuriser_na asiana anazy fotsiny ambony eo
 */

=======
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
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

<<<<<<< HEAD
  @Post() 
=======
  // 🔥 CREATE USER
  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiBody({ type: CreateUserDto })
  @Post()
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.create(createUserDto);
    const { password, ...result } = user;
    return result;
  }

<<<<<<< HEAD
  @UseGuards(JwtAuthGuard)
=======
  // 🔥 GET ALL USERS (ADMIN)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (Admin uniquement)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

<<<<<<< HEAD
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<User, 'password'>> {
=======
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

>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
    const user = await this.userService.findOne(id);
    const { password, ...result } = user;
    return result;
  }

<<<<<<< HEAD
   @Get("/email/:email")
  async findByEmail(
    @Param('email') email: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findByEmail(email);
    const { ...result } = user;
    return result;
  }

  //UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
=======
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

>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
    const user = await this.userService.update(id, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

<<<<<<< HEAD
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
=======
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
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  ): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
