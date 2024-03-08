import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import saveToken from "../utils/saveToken.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{
        expiresIn: '30d'
    });

    saveToken(res, token);

    res.status(201).json({
        status: true,
        content: {
          data: {
              id: user._id,
              name: user.name,
              email: user.email,
              created_at: user.createdAt,
          },
          meta: {
            access_token: token,
          },
        },
      });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already registered with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{
        expiresIn: '30d'
    });

    saveToken(res, token);

    res.status(201).json({
      status: true,
      content: {
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged Out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(201).json({
        status: true,
        content: {
          data: {
              id: user._id,
              name: user.name,
              email: user.email,
              created_at: user.createdAt,
          },
        },
      });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
