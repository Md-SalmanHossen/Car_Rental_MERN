import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
   car:{type:mongoose.Schema.Types.ObjectId,ref:'Car',required:true},
   user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
   owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
   pickup_date:{type:Date,required:true},
   return_date:{type:Date,required:true},
   status:{type:String,enum:['pending','confirmed','cancelled'],default:'pending'},
   price:{type:Number,required:true}
},{timestamps:true});

const Booking=mongoose.model('Booking',bookingSchema);
export default Booking;