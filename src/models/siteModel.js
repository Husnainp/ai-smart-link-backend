import { mongoose } from '../db/index.js';

const { Schema } = mongoose;

const siteSchema = new Schema(
  {
    site_url: { type: String, required: true },
    title: { type: String, required: true },
    cover_image: { type: String },
    description: { type: String },
    category: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Site =  mongoose.model('Site', siteSchema);

export default Site;
