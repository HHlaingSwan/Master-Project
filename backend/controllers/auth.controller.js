import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET, CLIENT_URL } from "../config/env.js";
import jwt from "jsonwebtoken";
import { isAdmin } from "../middleware/auth.middleware.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../util/mailer.js";

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: true,
        message: "If an account exists with this email, a password reset link will be sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${CLIENT_URL}/reset-password/${resetToken}?email=${encodeURIComponent(email)}`;

    const emailResult = await sendPasswordResetEmail(email, resetLink);

    if (!emailResult.success) {
      console.error("Email send error:", emailResult.error);
      return res.status(500).send({
        message: "Error sending password reset email. Please try again.",
      });
    }

    res.status(200).send({
      success: true,
      message: "If an account exists with this email, a password reset link will be sent.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).send({ message: "Error processing forgot password request", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).send({ message: "Token, email, and new password are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.lastPasswordChange = new Date();
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).send({ message: "Error resetting password", error });
  }
};
