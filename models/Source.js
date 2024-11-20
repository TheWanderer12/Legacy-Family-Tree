import mongoose from "mongoose";

const SourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Array, required: true },
});

const Source = mongoose.model("Source", SourceSchema);

export default Source;
