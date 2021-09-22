module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'userdb',
  password: process.env.DB_PASSWORD || 'userdb',
  database: process.env.DB_DATABASE || 'userdb',
  entities: [
    process.env.NODE_ENV === 'test'
      ? '**/*.entity.{ts,js}'
      : 'dist/**/*.entity{.ts,.js}',
  ],
  synchronize: true,
  seeds: ['src/seeds/**/*{.ts,.js}'],
  factories: ['src/factories/**/*{.ts,.js}'],
};
