const userModel =require('../models/userModels')
const ApiError = require('../utils/ApiError');
const { catchAsync } = require('../utils/catchAsync');
const {encrypt,decrypt}= require('../utils/encryption')
const bcrypt= require('bcryptjs')


exports.getAllUser=catchAsync(async(req,res,next)=>{
 
  let users= await userModel.find()
  if(users.length===0){
   return res.status(402).json({message:'users do Not Exist'})
  }
  let decryptedUsers = users.map(user => {
    return {
      ...user.toObject(),
      phone: user.phone ? decrypt(user.phone) : null,
      address: user.address ? decrypt(user.address) : null
    }
  });
  res.status(200).json({message:'success',users:decryptedUsers});
})
exports.getUserById=catchAsync(async (req,res,next)=>{
  const { id } = req.params;
  let user=await userModel.findById(id);
 if(!user){
  return next(new ApiError(404,'user does not found'))
  
}  const decryptedUser = {
  ...user.toObject(),
  phone: user.phone ? decrypt(user.phone) : null,
  address: user.address ? decrypt(user.address) : null
};

res.status(200).json({ message: 'success', user: decryptedUser });res.status(200).json({message:"success",user})
})
exports.deleteUserById = catchAsync(async (req,res,next)=>{
  let {id}= req.params;
  await userModel.findByIdAndDelete(id)
  res.status(204).json()
})
exports.updateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateUser = req.body;

  if (updateUser.phone) updateUser.phone = encrypt(updateUser.phone);
  if (updateUser.address) updateUser.address = encrypt(updateUser.address);

  let updatedUser = await userModel.findByIdAndUpdate(id, updateUser, { new: true });

  if (!updatedUser) {
    return next(new ApiError(404, 'User not found'));
  }

  res.status(200).json({ message: 'User updated successfully', user: updatedUser });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const id = req.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  
  const user = await userModel.findById(id);
  if (!user) return next(new ApiError(404, 'User not found'));

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return next(new ApiError(401, 'Old password is incorrect'));

  if (newPassword !== confirmPassword) {
    return next(new ApiError(400, 'New password and confirmation do not match'));
  }

  if (newPassword.length < 8) {
    return next(new ApiError(400, 'Password must be at least 8 characters'));
  }

  const salt=await bcrypt.genSalt(10);
  user.password =await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});