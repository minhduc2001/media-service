import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Token = new Schema({
  userId: { type: Number },
  accessToken: { type: String },
});

export default mongoose.model("token", Token);
