import {Router} from "express"
import {config as loadEnvironmentVariables} from "dotenv"
import superagent from "superagent"

import {requireAuth} from "../../users/routes/auth.router"

loadEnvironmentVariables()

const router = Router()

router.get("/filter", requireAuth, (req, res) => {
  const {image_url:imageUrl} = req.query
  if (!imageUrl) {
    return res
      .status(400)
      .json({
        error: "Image URL not supplied.",
      })
  }
  if (typeof imageUrl !== "string") {
    return res
      .status(422)
      .json({
        error: "Image URL must be a string.",
      })
  }

  const imageFilterEndpoint = `${process.env.IMG_FILTER_SERVICE_URL}/filteredimage`
  superagent
    .get(imageFilterEndpoint)
    .query({
      image_url: imageUrl,
      api_key: process.env.IMG_FILTER_SERVICE_API_KEY,
    })
    .pipe(res)
})

export const ImageRouter: Router = router
