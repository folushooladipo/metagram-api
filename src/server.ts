import express, {json as parseJsonBody} from "express"
import cors from "cors"

import {IndexRouter} from "./controllers/v0/index.router"
import {V0MODELS} from "./controllers/v0/model.index"
import {sequelize} from "./sequelize"

const DEFAULT_PORT = 8080;

(async () => {
  sequelize.addModels(V0MODELS)
  await sequelize.sync()

  const app = express()
  const port = process.env.PORT || DEFAULT_PORT

  app.use(parseJsonBody())

  const knownOrigins = [
    "http://localhost:4200",
  ]
  if (process.env.ACTIVE_CLOUDFRONT_DISTRIBUTION) {
    knownOrigins.push(process.env.ACTIVE_CLOUDFRONT_DISTRIBUTION)
  }
  const corsOptions = {
    origin: (origin: string, callback: (err: Error, isKnownOrigin?: boolean) => void) => {
      if (knownOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    optionsSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  app.use(function(req, res, next) {
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
  })

  app.use("/api/v0/", IndexRouter)

  // Root URI call
  app.get("/", (req, res) => {
    res.send("/api/v0/")
  })

  // Start the Server
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running http://localhost:${port}.`)
    // eslint-disable-next-line no-console
    console.log(`Press CTRL+C to stop server.`)
  })
})()
