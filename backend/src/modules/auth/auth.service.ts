import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtPayload } from './types/jwt-payload';
import { BootstrapAdminDto } from './dto/bootstrap-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  login(user: UserDocument) {
    const userId = user._id.toString();
    const payload: JwtPayload = {
      sub: userId,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async bootstrapAdmin(bootstrapAdminDto: BootstrapAdminDto = {}) {
    const hasAdmin = await this.usersService.hasAnyAdmin();
    if (hasAdmin) {
      throw new ConflictException('Admin user already exists');
    }

    const configuredEmail = this.configService.get<string>('adminEmail');
    const configuredPassword = this.configService.get<string>('adminPassword');

    const email = (bootstrapAdminDto.email ?? configuredEmail)
      ?.trim()
      .toLowerCase();
    const password = bootstrapAdminDto.password ?? configuredPassword;
    const name = bootstrapAdminDto.name?.trim() || 'Administrator';

    if (!email || !password) {
      throw new InternalServerErrorException(
        'Admin bootstrap credentials are not configured',
      );
    }

    await this.usersService.create({
      name,
      email,
      password,
      role: 'admin',
      active: true,
      phone: bootstrapAdminDto.phone,
    });

    const createdAdmin = await this.usersService.findByEmail(email);
    if (!createdAdmin) {
      throw new InternalServerErrorException('Admin user could not be created');
    }

    return this.login(createdAdmin);
  }
}
