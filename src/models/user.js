import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    // Публічна інформація
    name: { type: String, trim: true },
    avatarUrl: {
      type: String,
      required: false,
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },

    // Дані для авторизації
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, minlength: 8, maxlength: 128 },
    refreshToken: {
      type: String,
      default: null,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    feedbackCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
