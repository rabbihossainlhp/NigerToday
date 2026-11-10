const httpStatus = require("http-status");
const { Customer } = require("../models");
const ApiError = require("../utils/ApiError");




const createCustomer = async (customerBody) => {
   if (!customerBody.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Customer email is required")
   }
   return Customer.create({ ...customerBody });
};




const getCustomerList = async(query) =>{
   const page = Number(query.page) || 1;
   const limit = Number(query.limit) || 20;
   const skip = (page - 1) * limit;


   //filter_object 
   const filter = {};

   if(query.search){
      filter.email = query.search 
   }
   if(query.status){
      filter.status = query.status 
   }

   const customers = await Customer.find(filter)
                     .skip(skip)
                     .limit(limit)
                     .sort({createdAt: -1})

   
   const totalResult = await Customer.countDocuments(filter);

   return{
      results: customers,
      page,
      limit,
      totalPages:Math.ceil(totalResult/limit),
      totalResult
   }
}



const findCustomer = async(filter) =>{
   if(typeof filter === "string"){
      return await Customer.find({email:filter})
   }
   return await Customer.find(filter)
}







module.exports = {
   createCustomer,
   getCustomerList,
   findCustomer,
   
};