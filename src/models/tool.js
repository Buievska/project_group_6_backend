import { Schema, model } from 'mongoose';

const toolSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    pricePerDay: Number,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    images: [String],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const Tool = model('Tool', toolSchema);
