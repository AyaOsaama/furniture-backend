let express=require('express')
let router= express.Router()
let {register,login,refreshToken,verifyEmail,logout}= require('../controller/authController')
let {auth}= require('../Middleware/auth')
// Multer to save Images
const upload = require('../utils/multer');

//EndPoints

router.route('/register').post(upload.single('image'), register)
router.post('/login',login)
router.post('/refreshToken',refreshToken)
router.get('/verify/:token', verifyEmail)
router.post('/logout', auth, logout);
module.exports= router