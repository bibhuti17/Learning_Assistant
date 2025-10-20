import jwt from "jsonwebtoken"
// import User from "../models/user.model.js"

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || null
        if (!token) {
            return res.status(400).json({ message: "Unauthorized: No token provided" })
        }

        // verify token
        const verifyToken= await jwt.verify(token, process.env.JWT_SECRET)

        req.userId = verifyToken.id

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error isAuth()" })
    }
}

export default isAuth