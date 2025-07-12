import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IJwtPayload } from "src/interfaces/jwt.payload.interface";
import { User } from "src/schemas/user.schema";
import { CvScore } from "src/schemas/cv-score.schema";
import { JobDescription } from "src/schemas/job-description";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(CvScore.name) private readonly CvScoreModel: Model<CvScore>,
    @InjectModel(JobDescription.name) private readonly JobDescriptionModel: Model<JobDescription>
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

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
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

    // Remove role from updateUserDto to prevent users from changing their own role
    const { role, ...updateData } = updateUserDto;

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    return updatedUser;
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

    // حذف جميع CV scores المرتبطة بالمستخدم
    await this.CvScoreModel.deleteMany({ userId: userId });
    console.log(`Deleted CV scores for user: ${userId}`);

    // حذف المستخدم من قائمة المرشحين في جميع الوظائف
    await this.JobDescriptionModel.updateMany(
      { 'candidates.userId': userId },
      { $pull: { candidates: { userId: userId } } }
    );
    console.log(`Removed user from job candidates: ${userId}`);

    // حذف المستخدم نفسه
    await this.UserModel.findByIdAndDelete(userId);
    console.log(`Deleted user: ${userId}`);

    return { 
      message: 'User and all associated data deleted successfully',
      deletedData: {
        user: true,
        cvScores: true,
        jobCandidates: true
      }
    };
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
