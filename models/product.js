const mongoose = require('mongoose');

let ProductSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:3,
        maxlength:50
    },  
    price:{
        type:Number,
        required:true,
        min:0
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:10,
        maxlength:500
    },
    image:{
        type:String,
        required:true,
        trim:true
    },
images:[{ 
    type:String,
    trim:true}],
    categories: {main: {type:mongoose.SchemaTypes.ObjectId,ref:'Category' },
    sub:{type:mongoose.SchemaTypes.ObjectId,ref:'Subcategory'}
    } ,
    orderId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Order'},
    stock:{
        type:Number,
        required:true,
        min:0
    },
    discountPrice   :{
        type:Number,
        min:0
    },
    color:{
        type:String,

    },
    material:{
        type:String,
    },
    brand:{
        type:String,
    },
},{ timestamps: true })



const ProductModel = mongoose.model('products', ProductSchema);
module.exports = ProductModel;