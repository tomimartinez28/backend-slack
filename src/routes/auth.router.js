import express from 'express'
import { registerController, verifyEmailController, loginController, resetPasswordController, rewritePasswordController} from '../controllers/auth.controller.js'


const auth_router = express.Router()


auth_router.post('/register', registerController)
auth_router.get('/verify-email', verifyEmailController) 
auth_router.post('/login', loginController) 
auth_router.post('/reset-password', resetPasswordController)
auth_router.post('/rewrite-password', rewritePasswordController) 




export default auth_router

