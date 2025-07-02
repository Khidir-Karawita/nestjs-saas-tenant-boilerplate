import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import authConfig from 'src/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { ClsService } from 'nestjs-cls';
import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from '@mikro-orm/mariadb';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private config: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
    private readonly cls: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret!,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne({
      id: payload.sub,
      options: {
        populate: ['role', 'role.permissions', 'tenant'] as never,
        disableIdentityMap: true,
      },
    });
    if (user) this.cls.set('tenant', user.tenant);
    return user;
  }
}
