import jwt from 'jsonwebtoken'
export const generate =(user,secret,expiresIn)=>{
    return jwt.sign(user,secret,{ expiresIn })
}