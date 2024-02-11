import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import * as dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import { exec } from 'node:child_process';
import * as util from 'node:util';
import { Client } from 'pg';

dotenv.config({ path: '.env.test' });

const execSync = util.promisify(exec);

export default class PrismaTestEnvironment extends NodeEnvironment {
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    const dbUser = process.env.DATABASE_USER;
    const dbPass = process.env.DATABASE_PASS;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    const dbName = process.env.DATABASE_NAME;
    const dbSchm = process.env.DATABASE_SCHM;

    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchm}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync('pnpm exec migrate deploy');
    return await super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });
    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS test CASCADE`);

    await client.end();
  }
}
