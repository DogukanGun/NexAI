import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator,
        private readonly disk: DiskHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Check the API documentation health' })
    @ApiResponse({ status: 200, description: 'Health check passed' })
    @ApiResponse({ status: 503, description: 'Health check failed' })
    check() {
        return this.health.check([
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
        ]);
    }

    @Get('db')
    @HealthCheck()
    @ApiOperation({ summary: 'Check the database health' })
    @ApiResponse({ status: 200, description: 'Database health check passed' })
    @ApiResponse({ status: 503, description: 'Database health check failed' })
    dbCheck() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }

    @Get('disk')
    @HealthCheck()
    @ApiOperation({ summary: 'Check the disk storage health' })
    @ApiResponse({ status: 200, description: 'Disk health check passed' })
    @ApiResponse({ status: 503, description: 'Disk health check failed' })
    diskCheck() {
        return this.health.check([
            () => this.disk.checkStorage('storage', { path: '/', threshold: 250 * 1024 * 1024 * 1024, })
        ]);
    }
}
