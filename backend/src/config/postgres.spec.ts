import { ConfigModule, ConfigType } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import postgresConfig from './postgres.config';

describe('postgresConfig', () => {
  let config: ConfigType<typeof postgresConfig>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(postgresConfig)],
    }).compile();

    config = module.get<ConfigType<typeof postgresConfig>>(postgresConfig.KEY);
  });

  it('should be defined', () => {
    expect(postgresConfig).toBeDefined();
  });

  it('should contains uri key', async () => {
    expect(config.uri).toBe('postgres://postgres:postgres@localhost:5432/postgres');
  });
});