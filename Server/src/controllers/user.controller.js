import User from "../models/Users.model";
import bcrypt,{genSalt} from 'bcryptjs';


export const register=async(req ,res)=>{
   try {
      const {name,email,password}=req.body;

      if(!name||!email || !password ||password.length<8){
         return res.status(400).json({
            status:'fail',
            message:'Fill  all the fields'
         })
      }

      const userExist=await User.findOne({email});
      if(userExist){
         return res.status(400).json({
            status:'fail',
            message:'Usr already exists',
         })
      }

      const salt=await bcrypt.genSalt(10);
      const hashedPass=await bcrypt.hash(password,salt);
      
      const user=await User.create({
         name,
         email,
         password:hashedPass
      });

      res.status(201).json({
         status:'success',
         message:'User register successfully',
         user
      });
      
   } catch (error) {
      res.status(500).json({
         status:'fail',
         message:'Server internal error',
         error:error.message
      })
   }
}