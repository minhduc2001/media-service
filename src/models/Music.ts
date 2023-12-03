import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Music = new Schema({
  musicId: { type: Number },
  url: { type: String },
  isUpdate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("music", Music);
