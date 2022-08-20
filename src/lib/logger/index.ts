import winston from 'winston';
import { winstonConfig } from '~/config/winston.config';

export default winston.createLogger(winstonConfig);
