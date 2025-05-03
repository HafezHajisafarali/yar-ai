import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '🧠',
    },
  },
  { timestamps: true }
);

const Tool = mongoose.model('Tool', toolSchema);
export default Tool;