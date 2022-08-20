import { readFileSync } from 'fs';
import { join } from 'path';

import * as Sentry from '@sentry/node';
import { getConfig } from './config/config';

const { version } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8'),
);

export interface SentryMetadata {
  tags?: Record<string, string>;
  extras?: Record<string, any>;
}

export async function initSentry() {
  Sentry.init({
    dsn: getConfig().SENTRY_DSN,
    release: version,
    debug: false,
    sampleRate: 1,
    normalizeDepth: 10,
  });
}
