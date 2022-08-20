import * as winston from 'winston';

export const winstonConfig: winston.LoggerOptions = {
  // 콘솔로 출력
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        ...[
          // JSON으로 출력되도록 설정
          winston.format.json(),

          // 개발 환경에는 JSON에 줄바꿈으로 찍히게 prettyPrint 옵션 사용.
          ...(process.env.NODE_ENV === 'development'
            ? [
                winston.format.prettyPrint({
                  colorize: true,
                  depth: 3,
                }),
              ]
            : []),

          // Error를 출력할 때 stacktrace도 같이 출력하도록 설정
          winston.format.errors({
            stack: true,
          }),

          winston.format.timestamp(),
        ],
      ),
    }),
  ],
};
