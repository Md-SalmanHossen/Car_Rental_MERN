import express from 'express';
import authMiddleware from './../middlewares/auth.middleware.js';
import { changeRoleToOwner } from '../controllers/owner.controller.js';



const router=express.Router();

router.post('/change-role',authMiddleware,changeRoleToOwner);

export default router;