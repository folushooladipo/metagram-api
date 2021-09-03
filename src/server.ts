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
  const corsOptions = {
    origin: "http://diyjqs4wvctfa.cloudfront.net",
    optionsSuccessStatus: 200,
  }
  app.use(cors(corsOptions))

  // CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
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
