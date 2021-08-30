import AWS = require("aws-sdk")

import {config} from "./config/config"

const appConfig = config.dev

if (appConfig.awsProfile !== "DEPLOYED") {
  // When deployed to AWS, this configuration will be done automatically by AWS.
  const credentials = new AWS.SharedIniFileCredentials({profile: appConfig.awsProfile})
  AWS.config.credentials = credentials
}

export const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: appConfig.awsRegion,
  params: {Bucket: appConfig.awsMediaBucket},
})

/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl(key: string): string{

  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl("getObject", {
    Bucket: appConfig.awsMediaBucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  })

  return url
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5

  const url = s3.getSignedUrl("putObject", {
    Bucket: appConfig.awsMediaBucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  })

  return url
}
