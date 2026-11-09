const httpStatus = require("http-status");
const { Customer } = require("../models");
const ApiError = require("../utils/ApiError");


const createCustomer = async (customerBody) => {
   if (!customerBody.email) {
      throw new ApiError(httpStatus.NOT_FOUND, "Customer email is required")
   }
   return Customer.create({ ...customerBody });
};


module.exports = {
   createCustomer
};