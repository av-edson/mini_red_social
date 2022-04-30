require("dotenv").config();
module.exports = {
  port: process.env.SERVER_PORT,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  db_host: process.env.HOST,
  user_db: process.env.USER_DB,
  password_db: process.env.PASS,
  database: process.env.DATABASE,
  db_port: process.env.PORT,
  s3_endpoint: process.env.DO_SPACES_ENDPOINT,
  space_name: process.env.SPACES_NAME,
  region: process.env.REGION,
};
