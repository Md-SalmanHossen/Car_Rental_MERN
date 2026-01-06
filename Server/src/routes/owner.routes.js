import express from 'express';
import authMiddleware from './../middlewares/auth.middleware.js';
import *as owner from '../controllers/owner.controller.js';
import upload from '../middlewares/multer.middleware.js';



const router=express.Router();

router.post('/change-role',authMiddleware, owner.changeRoleToOwner);
router.post('/add-car', authMiddleware, upload.single("image"), owner.addCar);

router.get('/cars',authMiddleware, owner.getOwnerCars);
router.put('/toggle-car', authMiddleware , owner.toggleCarAvailability);
router.delete('/delete-car', authMiddleware , owner.deleteCar);
router.get('/dashboard', authMiddleware , owner.getDashboard);


export default router;