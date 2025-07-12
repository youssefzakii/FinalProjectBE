import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Query, 
  Req, 
  HttpException, 
  HttpStatus,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.services";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { IJwtPayload } from "src/interfaces/jwt.payload.interface";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags('Users')
@ApiBearerAuth()
@Controller("/users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get("/")
  @ApiOperation({ summary: 'Get all users (public endpoint)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  getAllUsers() {
    return this.service.getAllUsers();
  }

  @Get("/profile")
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile data' })
  getProfile(@Req() req: Request) {
    const user: IJwtPayload = req["user"];
    return this.service.getProfile(user);
  }

  @Get("/search")
  @ApiOperation({ summary: 'Search users by field' })
  @ApiResponse({ status: 200, description: 'Users matching the search criteria' })
  search(@Query("field") field: string) {
    return this.service.findByField(field);
  }

  @Put("/profile")
  @ApiOperation({ summary: 'Update current user profile (user can only update their own profile)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  @ApiResponse({ status: 403, description: 'Access denied. Cannot update other user profile' })
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto, 
    @Req() req: Request
  ) {
    const user: IJwtPayload = req["user"];
    
    // User can only update their own profile
    return this.service.updateProfile(user.id, updateUserDto);
  }

  // Admin endpoints
  @Get("/admin/all")
  @ApiOperation({ summary: 'Get all users for admin (with admin role check)' })
  @ApiResponse({ status: 200, description: 'List of all users for admin' })
  @ApiResponse({ status: 403, description: 'Access denied. Admin role required' })
  async getAllUsersForAdmin(@Req() req: Request) {
    const user: IJwtPayload = req["user"];
    
    if (user.role !== "admin") {
      throw new HttpException('Access denied. Admin role required', HttpStatus.FORBIDDEN);
    }
    
    return this.service.getAllUsersForAdmin();
  }

  @Get("/admin/stats")
  @ApiOperation({ summary: 'Get user statistics for admin' })
  @ApiResponse({ status: 200, description: 'User statistics' })
  @ApiResponse({ status: 403, description: 'Access denied. Admin role required' })
  async getUserStats(@Req() req: Request) {
    const user: IJwtPayload = req["user"];
    
    if (user.role !== "admin") {
      throw new HttpException('Access denied. Admin role required', HttpStatus.FORBIDDEN);
    }
    
    return this.service.getUserStats();
  }

  @Get("/admin/:id")
  @ApiOperation({ summary: 'Get specific user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied. Admin role required' })
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    const user: IJwtPayload = req["user"];
    
    if (user.role !== "admin") {
      throw new HttpException('Access denied. Admin role required', HttpStatus.FORBIDDEN);
    }
    
    return this.service.getUserById(id);
  }

  @Put("/admin/:id")
  @ApiOperation({ summary: 'Update user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  @ApiResponse({ status: 403, description: 'Access denied. Admin role required' })
  async updateUser(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @Req() req: Request
  ) {
    const user: IJwtPayload = req["user"];
    
    if (user.role !== "admin") {
      throw new HttpException('Access denied. Admin role required', HttpStatus.FORBIDDEN);
    }
    
    return this.service.updateUser(id, updateUserDto);
  }

  @Delete("/admin/:id")
  @ApiOperation({ summary: 'Delete user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Access denied. Admin role required' })
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const user: IJwtPayload = req["user"];
    
    if (user.role !== "admin") {
      throw new HttpException('Access denied. Admin role required', HttpStatus.FORBIDDEN);
    }
    
    return this.service.deleteUser(id);
  }
}
