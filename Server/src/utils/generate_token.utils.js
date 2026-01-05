import  jwt  from 'jsonwebtoken';

const generateToken=(userId)=>{
   try {

      const token=jwt.sign(
         {id:userId},
         process.env.JWT_SECRET,
         {expiresIn:'1d'}
      )
      return token;
      
   } catch (error) {
      res.status(500).json({
         status:'fail',
         error:error.message
      })
   }
}
export default generateToken;