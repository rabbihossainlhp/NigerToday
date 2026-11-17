const mongoose = require("mongoose");

const reminderPreferencesSchema = new mongoose.Schema(
  {
    remind7Days: { type: Boolean, default: true },
    remind3Days: { type: Boolean, default: true },
    remind1Day: { type: Boolean, default: true },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    reminders: {
      type: reminderPreferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);