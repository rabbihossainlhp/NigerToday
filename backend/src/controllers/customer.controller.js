const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { customerService } = require("../services");
const { Customer } = require("../models");

const createCustomer = catchAsync(async (req, res) => {
  const getCustomer = await customerService.findCustomer(req.body.email);

  if (getCustomer.length > 0) {
    return res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "Customer email already exists",
        status: "OK",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }


  const customer = await customerService.createCustomer(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Customer Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: customer,
    })
  );
});






const getCustomerList = catchAsync(async (req, res) => {
  const customers = await customerService.getCustomerList(req.query);

  if (!customers) {
    res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "No customers found yet",
        status: "OK",
        statusCode: httpStatus.NOT_FOUND,
      })
    )
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Customers data fetched",
      status: "OK",
      statusCode: httpStatus.OK,
      data: customers
    })
  )
})






const getSingleCustomer = catchAsync(async(req,res)=>{
  const {id} = req.params;
  const customer = await customerService.findCustomer({_id:id});

  console.log(customer)
  if(!customer){
    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Customer not found",
        status: "OK",
        statusCode: httpStatus.NOT_FOUND,
      })
    );
  }


  res.status(httpStatus.OK).json(
      response({
        message: "Customer data found",
        status: "OK",
        statusCode: httpStatus.OK,
        data:customer
      })
    );

})






module.exports = {
  createCustomer,
  getCustomerList,
  getSingleCustomer,
};
