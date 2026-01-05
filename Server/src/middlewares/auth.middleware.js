import jwt from 'jsonwebtoken';

const authMiddleware=async(req ,res ,next)=>{
   try {
      const token=req.headers.authorization?.split(' ')[1];
      if(!token){
         return res.status(401).json({
            message:'Token missing'
         })
      }

      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      req.userId=decoded.id;
      req.userRole=decoded.role;

      next();

   } catch (error) {
      res.status(500).json({
         status:'fail',
         message:'Invalid token',
         error:error.message
      });
   }
}

export default authMiddleware;