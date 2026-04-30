import jwt from "jsonwebtoken"
import { User } from "../Models/User.js"
export const Authmiddleware = async(req,res,next)=>
{
   try{
     const token = req.headers.authorization?.split(" ")[1]
    if(!token)
    {
        return res.status(401).json({message:"Unauthorized Acess",Success:false})
    }
    const check = jwt.verify(token,process.env.SECRETKEY)
    if(!check)
    {
        return res.status(401).json({message:"Invalid Token",success:false})
    }
    const user = await User.findById(check.id)

    if(!user)
    {
        return res.status(401).json({message:"Unauthorized Token",success:false})
    }
    req.id=user._id
    next()
   }
   catch(error)
   {
    return res.status(500).json({message:"Internal Server Error",success:false})
   }
    

}