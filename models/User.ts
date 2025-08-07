import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// This line checks if a User model already exists in the models object
// If it exists, use that instance (models?.User)
// If it doesn't exist, create a new model (model<IUser>("User", userSchema))
// This prevents model recompilation errors when using Hot Reload in development
const User = models?.User || model<IUser>("User", userSchema);

// Now we can export the User model
export default User;
