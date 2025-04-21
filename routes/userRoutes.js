let express=require('express')
let router= express.Router()
let {auth,restrictTo,validateChangePasswordInput}=require('../Middleware/auth')
let {getAllUser,getUserById,deleteUserById,updateUserById,changePassword}=require('../controller/userController')

//Protect
router.use(auth);

//EndPoints
router.route('/').get(restrictTo('admin','super_admin'),getAllUser)
router.route('/:id')
.get(restrictTo('admin','super_admin'), getUserById)
.delete(restrictTo('admin','super_admin'),deleteUserById)
.patch(restrictTo('admin','super_admin'),updateUserById)
router.patch('/changePassword',auth,validateChangePasswordInput,changePassword)

module.exports= router