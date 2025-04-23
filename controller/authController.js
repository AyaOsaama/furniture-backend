const userModel =require('../models/userModels')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { catchAsync } = require('../utils/catchAsync');
const sendVerificationEmail = require('../utils/mailer')
const crypto = require('crypto');


exports.register= catchAsync(async(req,res,next)=>{
    const { userName, email, password,role,phone,address } = req.body;
    const imageUrl = req.file ? req.file.path : 'https://img.freepik.com/premium-psd/user-icematte_161669-211.jpg?w=826';
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const existingUser = await userModel.findOne({email});
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  let newUser = await userModel.create({ userName, email, password, image: imageUrl, role, phone, address, verificationToken });
     await sendVerificationEmail(email, verificationToken);

  res.status(202).json({message:'Check your email to verify your account',users:newUser})
  console.log("Generated Token:", verificationToken);
  console.log("New User:", newUser);
})

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const user = await userModel.findOne({verificationToken: token});
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired verification token.' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: 'Email verified successfully!' });
});

exports.login= catchAsync(async(req,res,next)=>{
  
//  let{email,password}= req.body;
let email = req.body.email || req.body.Email;
let password = req.body.password || req.body.password;

 if(!email || !password){
  return res.status(400).json({message:"you must provide an email address and password"})
 }
 let user= await userModel.findOne({ email: email });
     if(!user){
      return res.status(404).json({message:'invalid email or password'})
     }
    let isValid =  await bcrypt.compare(password,user.password);
    if (!isValid){
      return res.status(404).json({message:'invalid email or password'})
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }
    //valid email and password
    // token  ==> jwt
   
    let token =jwt.sign({
      data:{id:user._id,
        email:user.email,role:user.role
      }
    },process.env.SECRET, { expiresIn: '1d' })
    
    let refreshToken =jwt.sign({
      data:{id:user._id,
        email:user.email,role:user.role
      }
    },process.env.REFRESH_SECRET, { expiresIn: '15d' })
    res.status(200).json({token,refreshToken})
  await userModel.findOneAndUpdate({_id:user._id},{refreshToken:refreshToken})
})

exports.refreshToken= catchAsync(async(req,res,next)=>{
  let{refreshToken}=req.body;
if(! refreshToken){
 return res.status(403).json({message:'refresh token is required'})
}


 let decode=await promisify(jwt.verify)(refreshToken,process.env.REFRESH_SECRET)
 let user= userModel.findOne({_id:decode._id})
 if(!user ||user.refreshToken!=refreshToken){
   return res.status(403).json({ message: 'invalid token'});
 }
 else{
  let token =jwt.sign({
    data:{id:user._id,
      email:user.email,role:user.role
    }
  },process.env.SECRET, { expiresIn: '1d' })
  res.status(200).json({token,refreshToken})

 }
})

exports.logout = catchAsync(async (req, res, next) => {

  const user = await userModel.findById(req.id);
  if (!user) {
    return next(new ApiError(404,'User not found.'))
  }
  user.refreshToken = undefined;
  await user.save();
  res.status(200).json({ message:'Logged out successfully.' });
});
