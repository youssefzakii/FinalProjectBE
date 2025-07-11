import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IJwtPayload } from "src/interfaces/jwt.payload.interface";
import { User } from "src/schemas/user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>
  ) {}

  getAllUsers() {
    return this.UserModel.find({}).select('-password');
  }

  async getProfile(user: IJwtPayload) {
    return this.UserModel.findOne({ username: user.username }).select('-password');
  }

  async findByField(field: string) {
    return this.UserModel.find({
      Fields: { $regex: field, $options: "i" },
    }).select('-password');
  }

  // Admin methods
  async getAllUsersForAdmin() {
    return this.UserModel.find({}).select('-password');
  }

  async getUserById(userId: string) {
    const user = await this.UserModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if username is being updated and if it's already taken
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.UserModel.findOne({ username: updateUserDto.username });
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.UserModel.findOne({ email: updateUserDto.email });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true }
    ).select('-password');

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.UserModel.findByIdAndDelete(userId);
    return { message: 'User deleted successfully' };
  }

  async getUserStats() {
    const totalUsers = await this.UserModel.countDocuments();
    const adminUsers = await this.UserModel.countDocuments({ role: 'admin' });
    const regularUsers = await this.UserModel.countDocuments({ role: 'user' });

    return {
      totalUsers,
      adminUsers,
      regularUsers,
      userPercentage: (regularUsers / totalUsers) * 100,
      adminPercentage: (adminUsers / totalUsers) * 100
    };
  }
}
