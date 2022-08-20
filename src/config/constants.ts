export const LOGGER_FORMAT =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status ":referrer" ":user-agent" - :response-time ms';

export const optionalUserHeader = {
  name: 'x-auth-token',
  description: 'optional auth token',
  required: false,
};
