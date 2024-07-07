export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
  jwt: {
    secret: 'asdadsasdadsad',
    ttl: process.env.JWT_TTL,
  },
});
