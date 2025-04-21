let express=require('express')
let router= express.Router()
let {auth}=require('../Middleware/auth')
let {addToCart,getCartByUser,updateCartProduct,deleteCartProduct,clearCart}=require('../controller/cartController')

//Protect
router.use(auth);

//EndPoints
router.post('/', addToCart); 
router.get('/', getCartByUser); 
router.patch('/:cartProductId', updateCartProduct); 
router.delete('/:cartProductId', deleteCartProduct); 
router.delete('/clear',clearCart); 


module.exports= router