import {Sequelize} from "sequelize-typescript"
import {readFileSync} from "fs"

import {config} from "./config/config"

const devConfig = config.dev

export const sequelize = new Sequelize({
  username: devConfig.username,
  password: devConfig.password,
  database: devConfig.database,
  host: devConfig.host,
  dialect: "postgres",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      ca: readFileSync(`${__dirname}/us-east-1-bundle.pem`),
    },
  },
  logging: false,
})
