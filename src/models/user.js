// models/user.js
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

    // ✅ НОВІ ПОЛЯ для рейтингу
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
  },
);

// Метод toJSON, щоб видаляти пароль із об'єкта користувача перед відправкою у відповідь
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
