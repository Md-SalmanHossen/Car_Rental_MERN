const routeHandler=async(req ,res ,next)=>{
   try {
      res.status(404).json({
         status:'fail',
         message:"Route not found",
      })
   } catch (error) {
      res.status(500).json({
         message:'Server internal error',
         error:error.message
      })
   }
}

export default routeHandler;