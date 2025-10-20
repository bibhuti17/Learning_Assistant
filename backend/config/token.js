import jwt from 'jsonwebtoken'

const genToken = async (userID) => {
    try {
        const token = await jwt.sign({ id: userID }, process.env.JWT_SECRET, {expiresIn: "30d"})
        return token 
    } catch (error) {
        console.log(error)  
    }
}

export default genToken 