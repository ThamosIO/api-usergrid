import mongoose, { Schema } from 'mongoose';
import logger from 'winston';

const CellSchema = new mongoose.Schema({
  lastOwner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  x: Number,
  y: Number,
  char: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  discoveredDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: Date,
});

const Cell = mongoose.model('Cell', CellSchema);

CellSchema.virtual('isLocked').get(() => this.owner !== null);

CellSchema.statics.lockAndUpdate = async ({ _id, char }) => {
  const { err, cell } = await Cell.findById(_id);

  if (err) {
    logger.error(err);
  }

  if (cell.isLocked || err) {
    return { status: 403, message: 'Cell is already claimed.' };
  }

  cell.owner = this.user._id;
  cell.char = char;

  const { saveErr, newCell } = await cell.save();

  if (saveErr) { return { status: 403, message: 'An error occurred while saving the cell.' }; }

  return {
    status: 200,
    cell: newCell,
  };
};

export default Cell;
