const mongoose = require('mongoose');

const outpassSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return !this.fromDate || !value || new Date(value) >= new Date(this.fromDate);
        },
        message: 'To date must be on or after from date'
      }
    },
    days: {
      type: Number,
      required: true,
      min: [1, 'Days must be at least 1']
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    qrCode: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

outpassSchema.pre('validate', function syncOutpassDays(next) {
  if (this.fromDate && this.toDate) {
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    const diffInMs = to.setHours(0, 0, 0, 0) - from.setHours(0, 0, 0, 0);

    if (diffInMs < 0) {
      this.invalidate('toDate', 'To date must be on or after from date');
    }
  }

  next();
});

module.exports = mongoose.model('Outpass', outpassSchema);
