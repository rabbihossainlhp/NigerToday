const httpStatus = require("http-status");
const { Customer,Renewal } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");





const createCustomer = async (customerBody) => {
   if (!customerBody.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Customer email is required")
   }
   return Customer.create({ ...customerBody });
};




const getCustomerList = async(filter,{skip,limit}) =>{
   const [result,totalResult] = await Promise.all([
      Customer.find(filter).skip(skip).limit(limit).sort({createdAt: -1}),
      Customer.countDocuments(filter)
   ])
  

   return {
      result,
      totalResult
   }

}

const findCustomer = async (filter) => {
   if (typeof filter === "string") {

      return await Customer.findOne({ email: filter })
   }

   if (filter._id) {
      if (!mongoose.Types.ObjectId.isValid(filter._id)) {
         throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID format!");
      }
   }

   return await Customer.findOne(filter)
}






const updateCustomer = async(customerId,customerBody)=>{

   if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID format!");
   }


   const updatedCustomer = await Customer.findByIdAndUpdate(customerId,customerBody,{
      new:true,
   });

   if(!updatedCustomer){
      throw new ApiError(httpStatus.BAD_REQUEST, "Customer update failed!!")
   }

   return updatedCustomer;
}





const deleteCustomer = async (customerId) => {
   if (!mongoose.Types.ObjectId.isValid(customerId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid customer ID format!");
   }

   await Customer.findByIdAndDelete(customerId);

   return null;
}






module.exports = {
   createCustomer,
   getCustomerList,
   findCustomer,
   updateCustomer,
   deleteCustomer,
};