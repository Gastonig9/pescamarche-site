import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationsService } from '../notifications/notifications.service';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async hasAnyAdmin(): Promise<boolean> {
    const count = await this.userModel.countDocuments({ role: 'admin' }).exec();
    return count > 0;
  }

  async create(createUserDto: CreateUserDto, actorId?: string): Promise<User> {
    const existing = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    const { password: _password, ...rest } = createUserDto;
    const user = await this.userModel.create({ ...rest, passwordHash });
    this.notificationsService
      .create({
        type: 'usuario_creado',
        title: 'Nuevo usuario creado',
        body: `${createUserDto.name} (${createUserDto.email}) fue agregado con rol ${createUserDto.role ?? 'customer'}.`,
        link: '/usuarios',
        actorId, // the admin who created won't see this notification
      })
      .catch(() => void 0);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
