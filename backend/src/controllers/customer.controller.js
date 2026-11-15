const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { customerService } = require("../services");


const EXPIRING_WITHIN_DAYS = 10;
const ALLOWED_DURATIONS = [3,6,12];




const createCustomer = catchAsync(async (req, res) => {
  const getCustomer = await customerService.findCustomer(req.body.email);

  if (getCustomer) {
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
  const requestedPage = Number(req.query.page) || 1;
  const requestedLimit = Number(req.query.limit) || 20;
  const skip = (requestedPage - 1) * requestedLimit;

  const filter = {};
  // const search = typeof req.query.search === 'string'? req.query.search.trim() : "";

  // if(search){
  //   filter.$or = [
  //     {fullName:search},
  //     {email:search},
  //     {phone:search}
  //   ]
  // }


  const customers = await customerService.getCustomerList(
    filter,
    {skip,limit:requestedLimit}
  );

  if (!customers || customers.result.length === 0) {
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
      data: customers.result
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




const updateCustomer = catchAsync(async(req,res)=>{
  const {id} = req.params;
  const customer = await customerService.findCustomer({_id:id});

  if(!customer){
    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Customer not found",
        status: "OK",
        statusCode: httpStatus.NOT_FOUND,
      })
    );
  }


  const updatedCustomer = await customerService.updateCustomer(id,req.body);

  res.status(httpStatus.OK).json(
      response({
        message: "Customer updated!!!!!",
        status: "OK",
        statusCode: httpStatus.OK,
        data:updatedCustomer
      })
    );

})




const deleteCustomer = catchAsync(async(req,res)=>{
  const {id} = req.params;
  const customer = await customerService.findCustomer({_id:id});
  if(!customer){
    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Customer not found",
        status: "OK",
        statusCode: httpStatus.NOT_FOUND,
      })
    );
  }


  await customerService.deleteCustomer(id);

  res.status(httpStatus.OK).json(
      response({
        message: "Customer deleted!!!!!",
        status: "OK",
        statusCode: httpStatus.OK,
      })
    );

})






module.exports = {
  createCustomer,
  getCustomerList,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
