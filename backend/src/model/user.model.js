import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: {type : String},
    isAdmin : {
      type: Boolean,
      default : false
    },
    permanentAddress: String,
    temporaryAddress: String,
    phoneNumber: String,
    profilePicture: String,
    tags: [String],
  },
  { timestamps: true }
);


// This allows you to call user.populate('orders') 
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user'
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
