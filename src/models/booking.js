import { Schema } from 'mongoose';
import { model } from 'mongoose';

const bookingSchema = new Schema(
  {
    toolId: {
      type: Schema.Types.ObjectId,
      ref: 'Tool',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    deliveryCity: {
      type: String,
      required: true,
      trim: true
    },
    deliveryBranch: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({ toolId: 1, startDate: 1, endDate: 1 });

export const Booking = model("Booking", bookingSchema);
