
const mongoose = require("mongoose");

const renewalSchema = mongoose.Schema(
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
            enum: [3, 6, 12],
        },

        type: {
            type: String,
            enum: ["initial", "renewal"],
            required: true,
            default: "renewal",
        },
    },
    {
        timestamps: true,
    }
);

const Renewal = mongoose.model("Renewal", renewalSchema);

module.exports = Renewal;
