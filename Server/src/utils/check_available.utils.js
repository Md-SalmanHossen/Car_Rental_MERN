import Booking from "../models/Booking.model.js";

//function to check availability of car for a given date
const checkAvailability=async(car,pickup_date,return_date)=>{
   try {
      const bookings=await Booking.find({
         car,
         pickup_date:{$lte:return_date},
         return_date:{$lte:pickup_date},
      })
   return bookings.length===0;
   } catch (error) {
      console.log(error.message);
   }
}
export default checkAvailability;
