import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const UserSchema = new Schema({
// Number is shorthand for {type: Number}
 name: String,
 subject: String,
 score: Number
});
const User = mongoose.model('User', UserSchema);
export default User;
