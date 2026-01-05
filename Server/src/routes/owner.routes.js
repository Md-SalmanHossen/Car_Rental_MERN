import express from 'express';
import authMiddleware from './../middlewares/auth.middleware.js';
import *as owner from '../controllers/owner.controller.js';
import upload from '../middlewares/multer.middleware.js';



const router=express.Router();

router.post('/change-role',authMiddleware, owner.changeRoleToOwner);
router.post('/add-car', authMiddleware, upload.single("image"), owner.addCar);

export default router;