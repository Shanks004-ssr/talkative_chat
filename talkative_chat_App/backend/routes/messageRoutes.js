const express=require('express')
const { protect } = require('../middleware/authMiddleware')
const {allMessages,sendMessage}=require('../controller/messageControllers')
const upload = require('../config/multerConfig')
const router=express.Router()
router.route('/').post(protect, upload.single('file'), sendMessage)
router.route('/:chatId').get(protect,allMessages)
module.exports=router