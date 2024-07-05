import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  login(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return null;
        }
        delete user.password;
        return user;
      });
    }
    return null;
  }
}
