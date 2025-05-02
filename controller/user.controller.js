const userModel = require("../models/user.models.js");
const ApiError = require("../utils/ApiError.utils.js");
const catchAsync = require("../utils/catchAsync.utils");
const { encrypt, decrypt } = require("../utils/encryption.utils.js");
const bcrypt = require("bcryptjs");

exports.getAllUser = catchAsync(async (req, res, next) => {
  let users = await userModel.find();
  if (users.length === 0) {
    return res.status(404).json({ message: "users do Not Exist" });
  }
  let decryptedUsers = users.map((user) => {
    return {
      ...user.toObject(),
      phone: user.phone ? decrypt(user.phone) : null,
      address: {
        en: user.address?.en ? decrypt(user.address.en) : null,
        ar: user.address?.ar ? decrypt(user.address.ar) : null,
      },
    };
  });
  res.status(200).json({ message: "success", users: decryptedUsers });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let user = await userModel.findById(id);
  if (!user) {
    return next(new ApiError(404, "User does not found"));
  }
  const decryptedUser = {
    ...user.toObject(),
    phone: user.phone ? decrypt(user.phone) : null,
    address: {
      en: user.address?.en ? decrypt(user.address.en) : null,
      ar: user.address?.ar ? decrypt(user.address.ar) : null,
    },
  };

  res.status(200).json({ message: "success", user: decryptedUser });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  await userModel.findByIdAndDelete(id);
  res.status(204).json();
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let { phone, address, ...rest } = req.body;

  if (phone && !/^(011|010|012|015)[0-9]{8}$/.test(phone)) {
    return next(new ApiError(400, "Invalid phone number format"));
  }
  if (address?.en && address.en.length < 5) {
    return next(
      new ApiError(400, "Address (EN) must be at least 5 characters")
    );
  }
  if (address?.ar && address.ar.length < 5) {
    return next(
      new ApiError(400, "Address (AR) must be at least 5 characters")
    );
  }

  const updatedData = { ...rest };
  if (phone) updatedData.phone = encrypt(phone);
  if (address?.en) {
    updatedData["address.en"] = encrypt(address.en);
  }
  if (address?.ar) {
    updatedData["address.ar"] = encrypt(address.ar);
  }

  let updatedUser = await userModel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: false,
  });

  if (!updatedUser) {
    return next(new ApiError(404, "User not found"));
  }

  res
    .status(200)
    .json({ message: "User updated successfully", user: updatedUser });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const id = req.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await userModel.findById(id);
  if (!user) return next(new ApiError(404, "User not found"));

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return next(new ApiError(401, "Old password is incorrect"));

  if (newPassword !== confirmPassword) {
    return next(
      new ApiError(400, "New password and confirmation do not match")
    );
  }

  if (newPassword.length < 8) {
    return next(new ApiError(400, "Password must be at least 8 characters"));
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});
