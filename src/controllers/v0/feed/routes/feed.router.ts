import {Router} from "express"

import {FeedItem} from "../models/FeedItem"
import {getPutSignedUrl} from "../../../../aws"
import {requireAuth} from "../../users/routes/auth.router"

const router: Router = Router()

router.get("/", async (req, res) => {
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

router.patch("/:id", requireAuth, async (req, res) => {
  const {caption, fileName} = req.body
  if (!caption && !fileName) {
    return res.status(400)
      .json({
        error: "File name or caption must be specified.",
      })
  }

  const {id} = req.params
  const [numberOfUpdatedRecords, updatedRecords] = await FeedItem.update(
    {
      caption,
      url: fileName,
    },
    {
      where: {id},
      returning: true,
    }
  )

  if (numberOfUpdatedRecords === 0) {
    return res.status(404)
      .json({
        error: `No record found with ID #${id}.`,
      })
  }

  res.status(200)
    .json(updatedRecords[0])
})

// Get a signed url to put a new item in the bucket
router.get("/signed-url/:fileName",
  requireAuth,
  async (req, res) => {
    const {fileName} = req.params
    const url = getPutSignedUrl(fileName)
    res.status(201).send({url: url})
  })

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post("/",
  requireAuth,
  async (req, res) => {
    const caption = req.body.caption
    const fileName = req.body.url

    // check Caption is valid
    if (!caption) {
      return res.status(400).json({message: "Caption is required or malformed"})
    }

    // check Filename is valid
    if (!fileName) {
      return res.status(400).json({message: "File url is required"})
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
