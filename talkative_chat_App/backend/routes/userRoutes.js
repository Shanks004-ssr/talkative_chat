const express=require('express')
const routes=express.Router()
const {registerUser,authUser,allUsers}=require('../controller/userControllers')
const {protect}=require('../middleware/authMiddleware');
routes.route("/").get(protect, allUsers);
routes.route('/').post(registerUser)
routes.post('/login',authUser)
module.exports=routes