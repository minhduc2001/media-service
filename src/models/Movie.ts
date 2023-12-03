import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Movie = new Schema({
  movieId: { type: Number },
  url: { type: String },
  isUpdate: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("movie", Movie);
