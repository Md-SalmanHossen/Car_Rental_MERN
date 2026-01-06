
import Car from '../models/Car.model.js';
import Booking from './../models/Booking.model.js';
import checkAvailability from '../utils/check_available.utils.js'


//api to check availability of cars for the given date and location
export const checkAvailabilityOfCar=async(req ,res)=>{
   try {

      const {location,pickupDate,returnDate}=req.body;
      const cars=await Car.find({location,isAvailable:true});
      
      const availableCarsPromise=cars.map(async(car)=>{
         await checkAvailability(car._id,pickupDate,returnDate);
         return {
            ...car._doc,
            isAvailable:isAvailable
         }
      })

      let availableCars=await Promise.all(availableCarsPromise);
      availableCars=availableCars.filter(car=>car.isAvailable===true);

      res.status(200).json({
         status:'success',
         message:'Operate successfully',
         availableCars
      })
   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}

//api to create booking
export const createBooking=async(req ,res)=>{
   try {

      const {_id}=req.user;
      const {car,pickup_date,return_date}=req.body;
      const isAvailable=await checkAvailability(car,pickup_date,return_date)
      if(!isAvailable){
         return res.json({
            status:'fail',
            message:'Car is not available'
         })
      }

      const carData=await Car.findById(car);

      const picked=new Date(pickup_date);
      const returned=new Date(return_date);
      const nonOfDays=Math.ceil((returned -picked)/(1000*60*60*24));
      const price=carData.pricePerDay * nonOfDays;

      await Booking.create({car,owner:carData.owner,user:_id,pickup_date,return_date,price});

      res.status(200).json({
         status:'success',
         message:'Booking created'
      })

   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}

//api to list user bookings
export const getUserBooking=async(req ,res)=>{
   try {

      const {_id}=req.user;
      const booking=(await Booking.find({user:_id}).populate("car")).toSorted({createdAt:-1});

      res.status(200).json({
         status:'success',
         message:'Booking fetched successfully',
         booking
      })

   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}

//api to owner booking 
export const getOwnerBooking=async(req ,res)=>{
   try {

      if(req.user.role!=='owner'){
         return res.status(401).json({
            status:'fail',
            message:'Unauthorized'
         })
      }

      const bookings=await Booking.find({owner:req.user._id}).populate('car user').select('-user.password').sort({createdAt:-1})

      res.status(200).json({
         status:'success',
         message:'owner booking fetched successfully',
         bookings
      })

   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}

//api to change booking status
export const bookingStatus=async(req ,res)=>{
   try {

      const {_id}=req.user;
      const {bookingId,status}=req.body;

      const booking=await Booking.findById(bookingId);

      if(booking.owner.toString()!=_id.toString()){
         return res.status()
      }

      booking.status=status;
      await booking.save();

      
      res.status(200).json({
         status:'success',
         message:'Status updated successfully',
      })

   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}
