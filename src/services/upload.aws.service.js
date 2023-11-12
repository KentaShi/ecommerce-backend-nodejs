"use strict"

const {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} = require("../configs/s3.config")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { randomIamgeName } = require("../utils")

const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const imageName = randomIamgeName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, //file.originalname || "unknown",
            Body: file.buffer,
            ContentType: "image/jpeg",
        })
        const result = await s3.send(command)
        console.log(result)
        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, //file.originalname || "unknown",
        })
        //url
        const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 })
        console.log(`url: ${url}`)
        return url
    } catch (error) {
        console.error("error uploading image use S3Client: " + error)
    }
}

module.exports = { uploadImageFromLocalS3 }
