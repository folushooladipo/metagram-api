import {Request, Response, Router} from "express"

import {FeedItem} from "../models/FeedItem"
import {getPutSignedUrl} from "../../../../aws"
import {requireAuth} from "../../users/routes/auth.router"

const router: Router = Router()

router.get("/", async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({order: [["id", "DESC"]]})
  res.send(items)
})

router.get("/:id", async (req, res) => {
  const {id} = req.params
  if (!id) {
    return res.status(404).json({
      error: "Please specify the ID of the feed item that you want to get.",
    })
  }

  const item = await FeedItem.findByPk(id)
  if (!item) {
    return res.status(400)
      .json({error: "Feed item not found."})
  }

  res.json(item)
})

// update a specific resource
router.patch("/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    //@TODO try it yourself
    res.send(500).send("not implemented")
  })

// Get a signed url to put a new item in the bucket
router.get("/signed-url/:fileName",
  requireAuth,
  async (req: Request, res: Response) => {
    const {fileName} = req.params
    const url = getPutSignedUrl(fileName)
    res.status(201).send({url: url})
  })

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post("/",
  requireAuth,
  async (req: Request, res: Response) => {
    const caption = req.body.caption
    const fileName = req.body.url

    // check Caption is valid
    if (!caption) {
      return res.status(400).send({message: "Caption is required or malformed"})
    }

    // check Filename is valid
    if (!fileName) {
      return res.status(400).send({message: "File url is required"})
    }

    // @todo
    // const item = await new FeedItem({
    //   caption: caption,
    //   url: fileName,
    // })

    // const saved_item = await item.save()

    // saved_item.url = getGetSignedUrl(saved_item.url)
    // res.status(201).send(saved_item)
  })

export const FeedRouter: Router = router
