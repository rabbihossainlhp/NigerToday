const httpStatus = require("http-status");
const { Customer } = require("../models");
const ApiError = require("../utils/ApiError");


const createCustomer = async (customerBody) => {
   if (!customerBody.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Customer email is required")
   }
   return Customer.create({ ...customerBody });
};


module.exports = {
   createCustomer
};