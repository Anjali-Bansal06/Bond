import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, default: 'global', index: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);