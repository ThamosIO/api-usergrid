import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  identity: String,
  redditId: String,
  token: String,
});
const User = mongoose.model('User', UserSchema);

UserSchema.statics.findOrCreate = function* (user) {
  const redditId = user.redditId;
  let created = false;
  let retrievedUser;

  if (!redditId) { return { err: 'User not found', user: null, created: false }; }

  const result = yield this.findOne({ redditId }).exec();

  if (!result) {
    retrievedUser = new User(user);
    yield user.save();
    created = true;
  }

  return { err: null, retrievedUser, created };
};

export default User;
