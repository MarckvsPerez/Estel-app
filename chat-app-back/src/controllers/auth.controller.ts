import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import { User } from "@/models/user.model";
import { createAccesToken } from "@/utils/jwt";
import { log } from "@/utils/logs";
import cloudinary from "@/lib/cloudinary";
import { AuthRequest } from "@/interfaces/express";

export const signup = async (req: Request, res: Response) => {
  const { email, fullName, password } = req.body;
  try {


    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ email, fullName, password: hashPassword });


    if (!newUser) {
      return res.status(400).json({ message: 'User not created' });
    }
    const token = createAccesToken({ _id: newUser._id.toString(), email: newUser.email, password: newUser.password }, res);
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully', _id: newUser._id, token });
  } catch (error) {
    log("❌ Error creating user", 'error', __dirname);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = createAccesToken({ _id: user._id.toString(), email: user.email, password: user.password }, res);
    return res.status(200).json({ message: 'User logged in successfully', _id: user._id, fullName: user.fullName, email: user.email, profilePicture: user.profilePicture, token });
  } catch (error) {
    log("❌ Error logging in user", 'error', __dirname);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {

  try {
    const { profilePicture } = req.body;
    const userId = req.user?._id;

    const result = await cloudinary.uploader.upload(profilePicture);
    const profilePictureUrl = result.secure_url;
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: profilePictureUrl }, { new: true });

    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    log("❌ Error updating profile", 'error', __dirname);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const checkAuth = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    return res.status(200).json({ message: 'User authenticated', user });
  } catch (error) {
    log("❌ Error checking auth", 'error', __dirname);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

