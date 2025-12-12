import { Booking } from "../models/booking.js";

export const bookingController = async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    userId: req.user._id,
  });
  return res.status(201).json({
    id: booking._id,
    toolId: booking.toolId,
    userId: booking.userId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    phone: booking.phone,
    deliveryCity: booking.deliveryCity,
    firstName: booking.firstName,
    lastName: booking.lastName,
    deliveryBranch: booking.deliveryBranch,
    createdAt: booking.createdAt
  });
};
