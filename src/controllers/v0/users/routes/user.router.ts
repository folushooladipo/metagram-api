import {Router} from "express"

import {AuthRouter} from "./auth.router"
import {User} from "../models/User"

const router: Router = Router()

router.use("/auth", AuthRouter)

router.get("/:id", async (req, res) => {
  const {id} = req.params
  const item = await User.findByPk(id)
  // @TODO: handle when id is not defined and when item === null.
  res.send(item)
})

router.get("/", (req, res) => {
  res.json({message: "Not implemented."})
})

export const UserRouter: Router = router
