import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('customer')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
