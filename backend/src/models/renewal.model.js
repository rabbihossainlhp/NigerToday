const mongoose = require("mongoose");

const renewalSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customers",
            required: true,
            index: true,
        },
        periodStart: {
            type: Date,
            required: true,
        },
        periodEnd: {
            type: Date,
            required: true,
        },
        durationMonths: {
            type: Number,
            required: true,
            min: 1,
        },
        type: {
            type: String,
            enum: ["initial", "renewal"],
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
    }
);

renewalSchema.index({ customerId: 1, periodStart: -1 });

module.exports = mongoose.model("Renewal", renewalSchema);