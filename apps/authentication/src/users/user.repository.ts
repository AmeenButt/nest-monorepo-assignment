import { RegisterUserDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(data: RegisterUserDto): Promise<User> {
    const created = new this.userModel({
      ...data,
      isActive: data.isActive ?? true,
    });

    return created.save();
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
    this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({createdAt: -1})
      .exec(),
    this.userModel.countDocuments().exec(),
  ]);
    return {items, total}
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
