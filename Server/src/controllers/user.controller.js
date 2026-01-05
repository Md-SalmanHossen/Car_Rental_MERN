import User from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generate_token.utils.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 8 characters",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        status: "fail",
        message: "User already exists",
      });
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });

    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const matchedPass = await bcrypt.compare(password, user.password);
    if (!matchedPass) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server internal error",
      error: error.message,
    });
  }
};
