import 'dotenv/config';
export default () => ({
  database: {
    user: process.env.DATABASE_USER || '',
    port: process.env.DATABASE_PORT || '',
    password: process.env.DATABASE_PASSWORD || '',
    host: process.env.DATABASE_HOST || '',
    name: process.env.DATABASE_NAME || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    access: process.env.JWT_ACCESS || 0,
  },
  redis: {
    host: process.env.REDIS_HOST || '',
    port: process.env.REDIS_PORT || 0,
  },
  image: {
    url: process.env.IMAGEURL || '',
  },
});
