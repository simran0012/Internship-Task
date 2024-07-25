import express from "express"
import UserController from "../controllers/userController.js"
import checkuserAuth from "../middlewares/auth_middlewares.js"
import validator from "../middlewares/validator.js"

const router = express.Router()

router.use('/changepassword', checkuserAuth)
router.use('/login',validator)
router.use('/logged',checkuserAuth)

// //publicroutes
router.post('/registration',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/reset-pass-email',UserController.sendUserPasswordEmail)
router.post('/reset-pass/:id/:token',UserController.userPasswordReset)
router.post('/profile')

// //privateroutes
router.post('/changepassword',UserController.changeUserPassword)
router.get('/logged',UserController.loggedUser)

export default router