import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health-Check')
@Controller('health-check')
export class HealthCheckController {
  @ApiOperation({
    summary: 'health check',
  })
  @Get()
  healthCheck() {
    return 'OK';
  }
}
