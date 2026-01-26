const { env } = process;
let envFile = '.env';
if (env.NODE_ENV) {
  switch (env.NODE_ENV.toString().trim()) {
    case 'development':
      envFile = '.env';
      break;
    case 'test':
      envFile = '.test.env';
      break;
    case 'prod':
      envFile = '.env';
      break;
    default:
      envFile = '.dev.env';
      break;
  }
} else {
  env.NODE_ENV = 'development';
  envFile = '.env';
}
// Load env variables from file based on NODE_ENV
require('dotenv').config({ path: `./${envFile}`, silent: true });