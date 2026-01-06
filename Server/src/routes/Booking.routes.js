import express from 'express';
import *as booking from '../controllers/booking.controller.js';
import authMiddleware from './../middlewares/auth.middleware.js';

const router=express.Router();

router.post('/check-availability', booking.checkAvailabilityOfCar);
router.post('/create', authMiddleware, booking.createBooking);

router.get('/user', authMiddleware, booking.getUserBooking)
router.get('/owner', authMiddleware, booking.getOwnerBooking);

router.put('/change-status',authMiddleware, booking.bookingStatus)


export default router;
