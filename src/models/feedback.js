import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema(
  {
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      min: 1,
      max: 5,
      default: 5,
      index: true,
    },

    description: {
      type: String,
      maxLength: 500,
      trim: true,
      default: '',
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tool: {
      type: Schema.Types.ObjectId,
      ref: 'Tool',
      required: true,
      index: true,
    },

    toolOwner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

feedbackSchema.index({ owner: 1, tool: 1 }, { unique: true });

export const Feedback = model('Feedback', feedbackSchema);
