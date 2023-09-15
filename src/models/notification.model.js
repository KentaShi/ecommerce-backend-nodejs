"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Notification"
const COLLECTION_NAME = "Notifications"

const notificationSchema = new Schema(
    {},
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, notificationSchema)
