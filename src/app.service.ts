import { Injectable } from '@nestjs/common';

/**
 * Main application service that provides core application functionality.
 * This service handles basic application operations and business logic.
 */
@Injectable()
export class AppService {
  /**
   * Returns a simple greeting message.
   * @returns {string} A "Hello World!" greeting message.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
