
const { Customer, Renewal } = require("../models");

const createRenewal = async (renewalData) => {
  const customer = await Customer.findById(renewalData.customerId);
  if (!customer) {
    return null;
  }

  const renewal = await Renewal.create(renewalData);

  customer.startDate = renewal.periodStart;
  customer.durationMonths = renewal.durationMonths;
  customer.expiresAt = renewal.periodEnd;
  await customer.save();

  return renewal;
};

const getAllRenewals = async () => {
  return Renewal.find()
    .populate("customerId", "fullName email phone")
    .sort({ createdAt: -1 });
};

const getRenewalsByCustomerId = async (customerId) => {
  return Renewal.find({ customerId })
    .sort({ createdAt: -1 });
};

const getRenewalById = async (renewalId) => {
  return Renewal.findById(renewalId).populate("customerId", "fullName email phone");
};

const updateRenewal = async (renewalId, periodEnd) => {
  const renewal = await Renewal.findByIdAndUpdate(
    renewalId,
    { $set: { periodEnd } },
    { new: true, runValidators: true },
  );
  if (!renewal) return null;

  const latestRenewal = await Renewal.findOne({ customerId: renewal.customerId })
    .sort({ createdAt: -1 });
  if (latestRenewal) {
    await Customer.findByIdAndUpdate(renewal.customerId, {
      $set: {
        startDate: latestRenewal.periodStart,
        durationMonths: latestRenewal.durationMonths,
        expiresAt: latestRenewal.periodEnd,
      },
    });
  }

  return renewal;
};

const deleteRenewal = async (renewalId) => {
  const renewal = await Renewal.findByIdAndDelete(renewalId);
  if (!renewal) return null;

  const latestRenewal = await Renewal.findOne({ customerId: renewal.customerId })
    .sort({ createdAt: -1 });
  if (latestRenewal) {
    await Customer.findByIdAndUpdate(renewal.customerId, {
      $set: {
        startDate: latestRenewal.periodStart,
        durationMonths: latestRenewal.durationMonths,
        expiresAt: latestRenewal.periodEnd,
      },
    });
  } else {
    await Customer.findByIdAndUpdate(renewal.customerId, {
      $set: { startDate: null, durationMonths: null, expiresAt: null },
    });
  }

  return renewal;
};

module.exports = {
  createRenewal,
  getAllRenewals,
  getRenewalsByCustomerId,
  getRenewalById,
  updateRenewal,
  deleteRenewal,
};