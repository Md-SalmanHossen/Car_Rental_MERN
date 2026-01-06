import imageKit from "../configs/imagekit.config.js";
import User from "../models/Users.model.js";
import fs from "fs";
import Car from "../models/Car.model.js";

//api to change roll
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (user.role === "owner") {
      return res.status(400).json({
        status: "fail",
        message: "You are already an owner",
      });
    }

    user.role = "owner";
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Now you can list cars",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
  }
};

//api to list cars
export const addCar = async (req, res) => {
  try {
    
    if (req.user.role !== "owner") {
      return res.status(403).json({
        status: "fail", 
        message: "Only owners can add cars" 
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Car image is required",
      });
    }

    const car = JSON.parse(req.body.carData);
    const imageFile=req.file;
    const buffer = fs.readFileSync(imageFile.path);

    const uploadRes = await imageKit.upload({
      file: buffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageKit.url({
      path: uploadRes.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({
      ...car,
      owner: req.user._id,
      image: imageUrl,
    });

    res.status(201).json({
      status: "success",
      message: "Car added",
    });

  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
  }
};

//api to list owner cars
export const getOwnerCars = async (req, res) => {
  try {

    const cars = await Car.find({owner:req.user._id});

    res.status(200).json({
      status:'success',
      message:'Fetched car successfully',
      cars
    })

  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
  }
};

//api to toggle car availability
export const toggleCarAvailability=async(req ,res)=>{
   try {

      const {carId}=req.body;
      const car=await Car.findById(carId);

      if (!car) {
        return res.status(404).json({ 
          status: "fail", 
          message: "Car not found" 
        });
      }

      if(!car.owner||car.owner.toString()!==req.user._id.toString()){
        return res.status(403).json({
          status:'fail',
          message:'Unauthorized'
        })
      }

      car.isAvailable=!car.isAvailable;
      await car.save();

      res.status(200).json({
        status:'success',
        message:'Availability updated'
      });

   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}

//api to delete a car
export const deleteCar=async(req ,res)=>{
   try {
      const {carId}=req.body;
      const car=await Car.findById(carId);

      if(!car){
        return res.status(404).json({ 
          status: "fail", 
          message: "Car not found" 
        });
      }

      if(car.owner.toString()!==req.user._id.toString()){
        return res.status(403).json({
          status:'fail',
          message:'Unauthorized'
        })
      }

      await car.deleteOne();

      res.status(200).json({
        status:'success',
        message:'Car deleted'
      });

   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}

//api to to get dashboard data
export const getDashboard=async(req ,res)=>{
   try {

      if(req.user.role!=='owner'){
        return res.status(403).json({
          status:'fail',
          message:'Unauthorized'
        })
      }

      const totalCars=await Car.countDocuments({owner:req.user._id});
      const availableCars=await Car.countDocuments({owner:req.user._id,isAvailable:true});

      res.status(200).json({
        status:'success',
        data:{
          totalCars,availableCars
        }
      });

   } catch (error) {
      res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
   }
}




