const httpStatus = require("http-status");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { renewalService } = require("../services");

const ALLOWED_DURATIONS = [3, 6, 12];

const createRenewal = catchAsync(async (req, res) => {
  const { customerId, periodStart, durationMonths, type = "renewal" } = req.body;
  const months = Number(durationMonths);
  const startDate = new Date(periodStart);

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID");
  }
  if (!periodStart || Number.isNaN(startDate.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid period start date");
  }
  if (!ALLOWED_DURATIONS.includes(months)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Duration must be 3, 6, or 12 months");
  }
  if (!["initial", "renewal"].includes(type)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid renewal type");
  }

  const periodEnd = new Date(startDate);
  periodEnd.setMonth(periodEnd.getMonth() + months);

  const renewal = await renewalService.createRenewal({
    customerId,
    periodStart: startDate,
    periodEnd,
    durationMonths: months,
    type,
  });

  if (!renewal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
  }

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Renewal created successfully",
    data: renewal,
  });
});

const getAllRenewals = catchAsync(async (req, res) => {
  const renewals = await renewalService.getAllRenewals();

  res.status(httpStatus.OK).send({
    success: true,
    message: "Renewals retrieved successfully",
    data: renewals,
  });
});

const getRenewalsByCustomer = catchAsync(async (req, res) => {
  const { customerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID");
  }

  const renewals = await renewalService.getRenewalsByCustomerId(customerId);
  res.status(httpStatus.OK).send({
    success: true,
    message: "Customer renewal history retrieved successfully",
    data: renewals,
  });
});

const getRenewalById = catchAsync(async (req, res) => {
  const { renewalId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(renewalId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid renewal ID");
  }

  const renewal = await renewalService.getRenewalById(renewalId);
  if (!renewal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Renewal not found");
  }

  res.status(httpStatus.OK).send({
    success: true,
    message: "Renewal retrieved successfully",
    data: renewal,
  });
});

const updateRenewal = catchAsync(async (req, res) => {
  const { renewalId } = req.params;
  const { periodEnd } = req.body;
  if (!mongoose.Types.ObjectId.isValid(renewalId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid renewal ID");
  }
  if (!periodEnd || Number.isNaN(new Date(periodEnd).getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid period end date");
  }

  const existingRenewal = await renewalService.getRenewalById(renewalId);
  if (!existingRenewal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Renewal not found");
  }
  const endDate = new Date(periodEnd);
  if (endDate <= existingRenewal.periodStart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Period end must be after period start");
  }

  const renewal = await renewalService.updateRenewal(renewalId, endDate);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Renewal updated successfully",
    data: renewal,
  });
});

const deleteRenewal = catchAsync(async (req, res) => {
  const { renewalId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(renewalId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid renewal ID");
  }

  const renewal = await renewalService.deleteRenewal(renewalId);
  if (!renewal) {
    throw new ApiError(httpStatus.NOT_FOUND, "Renewal not found");
  }

  res.status(httpStatus.OK).send({
    success: true,
    message: "Renewal deleted successfully",
    data: renewal,
  });
});

module.exports = {
  createRenewal,
  getAllRenewals,
  getRenewalsByCustomer,
  getRenewalById,
  updateRenewal,
  deleteRenewal,
};
