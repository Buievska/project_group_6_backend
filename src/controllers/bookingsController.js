import { Booking } from '../models/booking.js';
import { Tool } from '../models/tool.js';

const calculateDays = (start, end) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    Math.abs((new Date(end) - new Date(start)) / oneDay),
  );
  return diffDays > 0 ? diffDays : 1;
};

export const bookingController = async (req, res) => {
  try {
    const { toolId, startDate, endDate } = req.body;
    const userId = req.user._id;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Інструмент не знайдено' });
    }

    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const overlappingBooking = await Booking.findOne({
      toolId,
      userId,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: 'Ви вже забронювали цей інструмент на обраний період',
      });
    }

    const days = calculateDays(startDate, endDate);
    const calculatedPrice = days * tool.pricePerDay;

    const booking = await Booking.create({
      ...req.body,
      userId,
      totalPrice: calculatedPrice,
    });

    return res.status(201).json({
      id: booking._id,
      toolId: booking.toolId,
      userId: booking.userId,
      totalPrice: booking.totalPrice,
      startDate: booking.startDate,
      endDate: booking.endDate,
      phone: booking.phone,
      deliveryCity: booking.deliveryCity,
      firstName: booking.firstName,
      lastName: booking.lastName,
      deliveryBranch: booking.deliveryBranch,
      createdAt: booking.createdAt,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res
      .status(500)
      .json({ message: 'Помилка при створенні бронювання' });
  }
};

export const getUserBookingsController = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('toolId')
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Помилка отримання списку' });
  }
};

export const deleteBookingController = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'У вас немає прав для видалення цього бронювання' });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Бронювання успішно скасовано' });
  } catch (error) {
    console.error('Delete booking error:', error);
    return res
      .status(500)
      .json({ message: 'Помилка при видаленні бронювання' });
  }
};
