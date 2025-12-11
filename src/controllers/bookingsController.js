import { Booking } from "../models/booking.js";

export const bookingController = async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    userId: req.user._id,
  });
  return res.status(201).json({
    id: booking._id,
    instrumentId: booking.instrumentId,
    userId: booking.userId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    phone: booking.phone,
    city: booking.city,
    firstName: booking.firstName,
    lastName: booking.lastName,
    departmentNumber: booking.departmentNumber,
    createdAt: booking.createdAt
  });
};
