"use strict"

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
}

class AccessService {
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }
    /*
        1- Check email in database
        2- match password
        3- create AT and RT and save
        4- generate tokens
        5- get data return login
    */

    static login = async ({ email, password, refreshToken = null }) => {
        // 1-
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError("Couldn't find this shop")
        }
        //2-
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError("Authentication Error")
        }

        //3-
        const privateKey = crypto.randomBytes(64).toString("hex")
        const publicKey = crypto.randomBytes(64).toString("hex")
        //4-
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        )
        //5-
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })
        return {
            shop: getInfoData({
                fields: ["_id", "email", "name"],
                object: foundShop,
            }),
            tokens,
        }
    }

    static signUp = async ({ name, email, password }) => {
        // check email exists
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError(`This shop already register`)
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        })

        if (newShop) {
            // create privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //     "rsa",
            //     {
            //         modulusLength: 4096,
            //         publicKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem",
            //         },
            //         privateKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem",
            //         },
            //     }
            // )
            const privateKey = crypto.randomBytes(64).toString("hex")
            const publicKey = crypto.randomBytes(64).toString("hex")

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
            })

            if (!keyStore) {
                return {
                    code: "xxxx",
                    message: "keyStore error",
                }
            }

            // create token pair
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            )
            console.log("Created token pair::", tokens)

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ["_id", "email", "name"],
                        object: newShop,
                    }),
                    tokens,
                },
            }
        }
        return {
            code: 200,
            metadata: null,
        }
    }
}

module.exports = AccessService
