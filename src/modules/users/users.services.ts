import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJwtPayload } from 'src/interfaces/jwt.payload.interface';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}
  getAllUsers() {
    return this.UserModel.find({});
  }
  /*
  async addOneUser(dto: any) {
    const newUser = await this.UserModel.create(dto);
    return newUser;
  }
*/
  async getProfile(user: IJwtPayload) {
    return this.UserModel.findOne({ username: user.username });
  }
}
