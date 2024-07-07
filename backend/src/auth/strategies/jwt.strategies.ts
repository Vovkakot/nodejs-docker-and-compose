import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { ServerException } from '../../exceptions/server.exception';
import { ErrorCode } from '../../exceptions/error-codes';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'jwt-secret',
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findUserById(jwtPayload.sub);

    if (!user) {
      throw new ServerException(ErrorCode.IncorrectData);
    }

    return user;
  }
}
