
const mongoose = require("mongoose");
const { Customer, Renewal } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");





const createRenewal = async (renewalData) => {
  if (!mongoose.Types.ObjectId.isValid(renewalData.customerId)) {
    throw new Error("Invalid customer ID");
  }

  const customer = await Customer.findById(renewalData.customerId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  const { periodStart, periodEnd, durationMonths, type } = renewalData;

  const renewal = await Renewal.create({ ...renewalData });

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








const updateRenewal = async (renewalId, periodEnd) => {
  if (!mongoose.Types.ObjectId.isValid(renewalId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid renewal ID");
  }

  if (!periodEnd || Number.isNaN(new Date(periodEnd).getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid period end date");
  }

  const renewal = await Renewal.findById(renewalId);
  if (!renewal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Renewal not found");
  }

  const customer = await Customer.findById(renewal.customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
  }

  const endDate = new Date(periodEnd);

  renewal.periodEnd = endDate;
  customer.expiresAt = endDate;

  await renewal.save();
  await customer.save();

  return renewal;
};






module.exports = {
  createRenewal,
  getAllRenewals,
  getRenewalsByCustomerId,
  updateRenewal
};