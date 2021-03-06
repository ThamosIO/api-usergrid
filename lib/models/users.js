import mongoose, { Schema } from 'mongoose';

const UserSchema = new mongoose.Schema({
  identity: String,
  redditId: String,
  token: String,
  usedCells: {
    type: Number,
    default: 0,
    max: 10,
  },
  ownedCells: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Cell' }],
    validate: [arr => arr.length <= 10, '{PATH} exceeds 10 in size'],
  },
});

UserSchema.statics.findOrCreate = async function (userData) {
  const User = mongoose.model('User');
  let user = userData;
  const redditId = user.redditId;
  let created = false;

  if (!redditId) { return { err: 'User not found', user: null, created: false }; }

  const result = await this.findOne({ redditId }).exec();

  if (!result) {
    user = new User(user);

    await user.save();
    created = true;
  }

  return { err: null, user, created };
};

const User = mongoose.model('User', UserSchema);

export default User;
