import imageKit from "../configs/imagekit.config.js";
import User from "../models/Users.model.js";
import fs from "fs";
import upload from "./../middlewares/multer.middleware.js";
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
    const { _id } = req.user;

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Car image is required",
      });
    }

    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // read image
    const fileBuffer = fs.readFileSync(imageFile.path);

    // ✅ store upload response
    const response = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // delete local file
    fs.unlinkSync(imageFile.path);

    // ✅ correct key: transformation
    const optimizedImageUrl = imageKit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl,
    });

    res.status(200).json({
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
    const { _id } = req.user;

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Car image is required",
      });
    }

    const cars = await Car.find({owner:_id});

    re.status(200).json({
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


