import { dotenvLoader, TypedConfigModule } from 'nest-typed-config';

export const useConfigs = <T extends (new () => any)[]>(
  configClasses: T,
  envFilePaths: string[],
) =>
  configClasses.map((configClass) => {
    return TypedConfigModule.forRoot({
      isGlobal: true,
      schema: configClass,
      load: [
        dotenvLoader({
          envFilePath: envFilePaths,
        }),
      ],
      normalize: (env) => {
        // 'true' >> true, '123' >> 123, 'null' >> null etc.
        for (const key in env) {
          if (env[key] === 'undefined') {
            env[key] = undefined;
          } else if (env[key] === 'null') {
            env[key] = null;
          } else if (
            !Number.isNaN(parseFloat(env[key])) &&
            parseFloat(env[key]).toString() === env[key]
          ) {
            env[key] = parseFloat(env[key]);
          } else if (env[key] === 'true') {
            env[key] = true;
          } else if (env[key] === 'false') {
            env[key] = false;
          }
        }
        return env;
      },
    });
  });

export const checkNodeEnv = (): {
  isProduction: boolean;
  isTesting: boolean;
  isDev: boolean;
} => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTesting = !isProduction && process.env.NODE_ENV === 'test';
  const isDev = !isProduction && !isTesting;

  return { isProduction, isTesting, isDev };
};
