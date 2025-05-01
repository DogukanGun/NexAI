import { Controller, DefaultValuePipe, Get, Param, Query } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller({ path: "/users" })
@ApiTags('users')
export class UserController {

  constructor(private userService: UserService) { }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiQuery({ name: 'withFiles', type: Boolean, required: false, description: 'Include files in the response' })
  getUser(
    @Param('id') id: string,
    @Query('withFiles', new DefaultValuePipe(false)) withFiles?: boolean
  ): Observable<User> {
    return this.userService.findById(id, withFiles);
  }
}
