import { registerAs } from '@nestjs/config';
import { Params } from 'pino-nestjs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import pino from 'pino';

export default registerAs('pinoLogger', () => ({
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
      },
    },
    stream: pino.destination({
      dest: process.env.LOGS_FILE_NAME || './logs/app.log',
      sync: false,
    }),
    genReqId: (req) => req.headers['x-correlation-id'] || uuidv4(),
    serializers: {
      req: (req: Request) => {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
          userAgent: req.headers['user-agent'],
          language: req.headers['accept-language'],
          ip: req.ip,
        };
      },
      res: (res) => {
        return {
          statusCode: res.statusCode,
        };
      },
    },
    customProps(req: Request) {
      const user = req.user as User;
      return {
        user: user
          ? {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role ? user.role.name : 'unknown',
            }
          : {},
      };
    },
    quietReqLogger: true,
  },
}));
