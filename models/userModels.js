const mongoose = require('mongoose')
const bcrypt= require('bcryptjs')
const { encrypt } = require('../utils/encryption');


let userSchema=mongoose.Schema({
    userName:{
  type:String,
  unique:true,
  required:true,
  minlength:3,
  maxlength:10
    },
    email:{
  type:String,
  required:true,
  unique:true,
  validate:{
    validator:function (v) {
        return/^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/.test(v)
    },
    message:props =>`${props.value} is not a valid Email`
  
  },
  trim:true,
  lowercase: true

    },
    password:{
      type:String,
      required:true,
      minlength:6,
      trim:true,    
    },
    image:{
      type:String,
    },
    role:{
      type:String,
      enum: ['super_admin', 'admin', 'user'],
      default:'user'
    },
    refreshToken:{
    type:String
    },
    phone:{
      type:String,
      validate:{
        validator:function (v) {
            return/^(011|010|012|015)[0-9]{8}$/.test(v)
        },
        message:props =>`${props.value} is not a valid phone number`
      
      },
      trim:true,
    },
    address:{
      type:String,
      trim:true,
    },
    wishlist: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'products'
    }],    
    ispurchased:[{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'Product'
    }],
    isVerified: { 
      type: Boolean,
       default: false},
    verificationToken: String,
}, { timestamps: true })

userSchema.pre('save',async function(next){   

  const salt=await bcrypt.genSalt(10);
  let hashedPassword =await bcrypt.hash(this.password,salt);
  this.password = hashedPassword;

  if (this.phone) {
    this.phone = encrypt(this.phone);
  }
  if (this.address) {
    this.address = encrypt(this.address);
  }
 

  next();

})

const userModel = mongoose.model('User', userSchema);
module.exports=userModel