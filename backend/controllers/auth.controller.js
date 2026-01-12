import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if user exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { password: pwd, ...userWithoutPassword } = newUser.toObject();

    res.status(201).send({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Error in register", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Exclude password from response
    const { password: pwd, ...userWithoutPassword } = user.toObject();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error in Login", error });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Error in Logout", error });
  }
};
