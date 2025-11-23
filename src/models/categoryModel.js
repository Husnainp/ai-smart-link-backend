import { mongoose } from '../db/index.js';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
