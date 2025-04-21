let express=require('express')
let router= express.Router()
let {auth,restrictTo}=require('../Middleware/auth')
let {createOrder,getUserOrders,getOrderById,updateOrderStatus,getAllOrders}=require('../controller/orderController')

//Protect
router.use(auth);

//EndPoints
router.post('/', auth, createOrder); 
router.get('/', auth, getUserOrders); 
router.get('/:orderId', auth, getOrderById); 
router.patch('/:orderId', auth, restrictTo('super_admin','admin'), updateOrderStatus); 
router.get('/all', auth, restrictTo('super_admin','admin'), getAllOrders); 

module.exports= router