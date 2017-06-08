import mongoose from 'mongoose';

const CellSchema = new mongoose.Schema({
  userId: String,
  x: Number,
  y: Number,
  char: String,
});

const Cell = mongoose.model('Cell', CellSchema);
export default Cell;
