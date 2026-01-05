import User from "../models/Users.model.js";
import bcrypt,{genSalt} from 'bcryptjs';
import { jwt } from 'jsonwebtoken';


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

export const login=async(req ,res)=>{
   try {

       const {email,password}=req.body;
       if(!email || !password){
         return res.status(400).json({
            status:'fail',
            message:'All fields are require',
         })
      };

       const user =await User.findOne({email});
       if(!user){
         return res.status(400).json({
            status:'fail',
            message:'User not found',
         })
       }

       const matchedPass=await bcrypt.compare(password,user.password);
       if(!matchedPass){
         return res.status(400).json({
            status:'fail',
            message:'Wrong email or password'
         })
       } 

       const token=jwt.sign(
         {id:user._id},
         process.env.JWT_SECRET,
         {expiresIn:'1d'}
      )

       res.status(200).json({
         status:'success',
         message:'Login successfully',
         token
       });

   } catch (error) {
      res.status(500).json({
         status:'fail',
         message:'Server internal error',
         error:error.message
      });
   }
}

