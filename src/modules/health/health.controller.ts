import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../core/infra/prisma/prisma.service';
import { Public } from '../auth/infra/http/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Verificação geral de saúde da API',
    description: 'Retorna o status de saúde da aplicação, incluindo memória e banco de dados',
  })
  @ApiResponse({
    status: 200,
    description: 'API está funcionando corretamente',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        info: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            memory_heap: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
            memory_rss: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'up' },
              },
            },
          },
        },
        error: {
          type: 'object',
        },
        details: {
          type: 'object',
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Um ou mais serviços estão indisponíveis',
  })
  @HealthCheck()
  check() {
    return this.health.check([
      // Verifica conexão com o banco de dados
      () => this.prisma.pingCheck('database', this.prismaService),
      // Verifica uso de memória heap (máximo 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Verifica uso de memória RSS (máximo 300MB)
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Verificação de prontidão da API',
    description: 'Verifica se a API está pronta para receber requisições (readiness probe)',
  })
  @ApiResponse({
    status: 200,
    description: 'API está pronta',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.prismaService),
    ]);
  }

  @Get('live')
  @ApiOperation({
    summary: 'Verificação de vitalidade da API',
    description: 'Verifica se a API está viva e respondendo (liveness probe)',
  })
  @ApiResponse({
    status: 200,
    description: 'API está viva',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
      },
    },
  })
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
