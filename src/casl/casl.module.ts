import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from 'src/common/factories/casl-ability.factory';

@Global()
@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
