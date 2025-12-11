import { Schema, model } from 'mongoose';

const toolSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    pricePerDay: {
      type: Number,
      required: true
    },

    images: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    specifications: {
      type: Object,
      default: {}
    },

    rentalTerms: {
      type: String
    },

    bookedDates: {
      type: [String], // масив дат
      default: []
    },

    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'feedbacks'
      }
    ]
  },

  {
    timestamps: true
  }
);

export const Tool = model('Tool', toolSchema);
