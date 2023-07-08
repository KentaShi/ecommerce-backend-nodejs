"use strict"
const jwt = require("jsonwebtoken")
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2 days",
        })
        // refresh token
        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7 days",
        })

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error("error verifying::", err)
            } else {
                console.log("decode verified::", decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {}
}

module.exports = { createTokenPair }
