import User from "../models/Users.model.js";


export const changeRoleToOwner=async(req ,res)=>{
   try {

      const {_id}=req.user;
      const user=await User.findById(_id);
      if(!user){
         return res.status(404).json({
            status:'fail',
            message:'User not found',
         })
      }

      if(user.role==='owner'){
         return res.status(400).json({
            status:'fail',
            message:'You are already an owner'
         });
      }

      user.role="owner";
      await user.save();

      res.status(200).json({
         status:'success',
         message:'Now you can list cars',
         user
      });
      
   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}
