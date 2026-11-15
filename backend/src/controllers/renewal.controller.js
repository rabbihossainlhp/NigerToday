
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {renewalService} = require("../services");




const createRenewal = catchAsync(async (req, res) => {
  const { periodStart, durationMonths } = req.body;

  if (!periodStart) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "periodStartttt is required",
    });
  }

  const months = Number(durationMonths);


  const startDate = new Date(periodStart);
  if (isNaN(startDate.getTime())) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "Invalid periodStart date format",
    });
  }

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months);


  req.body.periodEnd = endDate;
  

  const renewal = await renewalService.createRenewal(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Customer renewed successfully",
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
  const renewals = await renewalService.getRenewalsByCustomerId(
    req.params.customerId
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Customer renewal history retrieved successfully",
    data: renewals,
  });
});

module.exports = {
  createRenewal,
  getAllRenewals,
  getRenewalsByCustomer,
};