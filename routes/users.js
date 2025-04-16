let express=require('express')
let router= express.Router()
let {getAllUser,saveUser,deleteUserById,updateUserById,login,refreshToken}=require('../controller/users')
// Multer to save Images
const upload = require('../utils/multer');

//EndPoints
// router.get('/',getAllUser)
// router.post('/',saveUser)
router.route('/').get(getAllUser).post(upload.single('image'), saveUser)
router.route('/:id').delete(deleteUserById).patch(updateUserById)
router.post('/login',login)
router.post('/refreshToken',refreshToken)
module.exports= router