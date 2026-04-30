const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    department: {
      type: String,
      default: ''
    },
    course: {
      type: String,
      default: ''
    },
    registerNo: {
      type: String,
      default: ''
    },
    blockNo: {
      type: String,
      default: ''
    },
    roomNo: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    mobile: {
      type: String,
      default: '',
      validate: {
        validator(value) {
          return value === '' || /^[0-9]{10}$/.test(value);
        },
        message: 'Mobile number must be exactly 10 digits'
      }
    },
    parentMobile: {
      type: String,
      default: '',
      validate: {
        validator(value) {
          return value === '' || /^[0-9]{10}$/.test(value);
        },
        message: 'Parent mobile number must be exactly 10 digits'
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
