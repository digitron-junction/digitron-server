import { Global, Module } from '@nestjs/common';
import { VisionAiService } from './vision-ai.service';

@Global()
@Module({
  providers: [VisionAiService],
  exports: [VisionAiService],
})
export class VisionAiModule {}
