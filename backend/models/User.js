import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRE } from '../config/config.js';

const { genSalt, hash, compare } = bcrypt;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'department'],
      default: 'student',
    },
    departmentName: {
      type: String,
      trim: true,
      // Removed required, will be auto-populated
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// 🔹 Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

// ✅ Ensure `departmentName` is set before saving
UserSchema.pre('validate', function (next) {
  if (this.role === 'department' && !this.departmentName) {
    this.departmentName = this.name.toLowerCase();
  }
  next();
});


// 🔹 Generate JWT Token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// 🔹 Match user entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default model('User', UserSchema);