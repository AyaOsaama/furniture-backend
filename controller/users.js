const userModel =require('../models/user')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { catchAsync } = require('../utils/catchAsync');

exports.getAllUser=catchAsync(async(req,res,next)=>{
 
  let users= await userModel.find()
  if(users.length===0){
   return res.status(402).json({message:'users do Not Exist'})
  }
  res.status(202).json({message:'success',users:users})  
})
exports.saveUser= catchAsync(async(req,res,next)=>{
    const { userName, email, password,role,phone,address } = req.body;
  const imageUrl = req.file ? req.file.path : null;
   let newUser = await userModel.create({ userName, email, password, image: imageUrl,role,phone,address });
  res.status(202).json({message:'success',users:newUser})
  
})
exports.deleteUserById = catchAsync(async (req,res,next)=>{
 
})
exports.updateUserById = catchAsync( async (req,res,next)=>{

})
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