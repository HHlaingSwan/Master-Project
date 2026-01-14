import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import { isAdmin } from "../middleware/auth.middleware.js";

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

    const { password: pwd, ...userWithoutPassword } = newUser.toObject();

    const token = jwt.sign(
      { userId: newUser._id, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

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

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
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

export const updateNameAndEmail = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;
    console.log("userId", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.lastProfileUpdate = new Date();
    await user.save();

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: {
        user: {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          lastProfileUpdate: user.lastProfileUpdate,
          lastPasswordChange: user.lastPasswordChange,
        },
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error in updating user", error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.lastPasswordChange = new Date();
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
      data: {
        user: {
          name: user.name,
          email: user.email,
          lastProfileUpdate: user.lastProfileUpdate,
          lastPasswordChange: user.lastPasswordChange,
        },
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error in changing password", error });
  }
};
