"use strict"

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // check email exists
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: "xxxx",
                    message: "Shop already exists",
                }
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
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 4096,
                        publicKeyEncoding: {
                            type: "pkcs1",
                            format: "pem",
                        },
                        privateKeyEncoding: {
                            type: "pkcs1",
                            format: "pem",
                        },
                    }
                )
                console.log({ privateKey, publicKey })

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                })

                if (!publicKeyString) {
                    return {
                        code: "xxxx",
                        message: "publicKeyString error",
                    }
                }
                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                console.log("publicKeyObject::", publicKeyObject)
                // create token pair
                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKeyString,
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
        } catch (error) {
            return {
                code: "20001",
                message: error.message,
                status: "error",
            }
        }
    }
}

module.exports = AccessService
