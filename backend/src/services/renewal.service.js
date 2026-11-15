
const mongoose = require("mongoose");
const {Customer,Renewal} = require("../models");





const createRenewal = async (renewalData) => {
  if (!mongoose.Types.ObjectId.isValid(renewalData.customerId)) {
    throw new Error("Invalid customer ID");
  }

  const customer = await Customer.findById(renewalData.customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  const { periodStart, periodEnd, durationMonths, type } = renewalData;

  const renewal = await Renewal.create({...renewalData});

  customer.startDate = periodStart;
  customer.durationMonths = durationMonths;
  customer.expiresAt = periodEnd;

  await customer.save();

  return renewal;
};



const getAllRenewals = async () => {
  return Renewal.find()
    .populate("customerId", "fullName email phone")
    .sort({ createdAt: -1 });
};




const getRenewalsByCustomerId = async (customerId) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Invalid customer ID");
  }

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return Renewal.find({ customerId })
    .sort({ createdAt: -1 });
};

module.exports = {
  createRenewal,
  getAllRenewals,
  getRenewalsByCustomerId,
};