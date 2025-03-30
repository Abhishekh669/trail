import { Router } from "express";
import {body}  from "express-validator"
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controller/user.controller";
import { middlewareValidation } from "../middlewares/auth.middleware";


const router  = Router();

router.post('/register',[
    body('email').isEmail(),
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    loginUser
)

router.get('/profile',middlewareValidation,getUserProfile)
router.get('/logout', middlewareValidation,logoutUser)


export default router;