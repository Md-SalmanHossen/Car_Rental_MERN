import express from 'express';
import *as user from './../controllers/user.controller.js';
import protect from '../middlewares/auth.middleware.js'


const router=express.Router();


router.post('/register',user.register);
router.post('/login',user.login);
router.get('/me', protect, user.getUser);



export default router;