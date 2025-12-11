import { Schema } from 'mongoose';
import { model } from 'mongoose';

const bookingSchema = new Schema(
  {
    instrumentId: {
      type: Schema.Types.ObjectId,
      ref: 'Instrument',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    surname: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    departmentNumber: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({ instrumentId: 1, startTime: 1, endTime: 1 });

export const Booking = model("Booking", bookingSchema);
