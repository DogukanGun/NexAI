
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';

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
    check() {
        return this.health.check([
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
        ]);
    }

    @Get('db')
    @HealthCheck()
    dbCheck() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }

    @Get('disk')
    @HealthCheck()
    diskCheck() {
        return this.health.check([
            () => this.disk.checkStorage('storage', { path: '/', threshold: 250 * 1024 * 1024 * 1024, })
        ]);
    }
}
