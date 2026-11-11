const httpStatus = require("http-status");
const { Customer ,Renewal} = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");





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






const getDashboardStats = async () => {
   const now = new Date();
   const sevenDaysLater = new Date();
   sevenDaysLater.setDate(now.getDate() + 7);

   const [total, expiringSoon, expired] = await Promise.all([
      Customer.countDocuments({}),
      Customer.countDocuments({ expiresAt: { $gte: now, $lte: sevenDaysLater } }),
      Customer.countDocuments({ expiresAt: { $lt: now } })
   ])


   const active = total - expired;


   return {
      total,
      active,
      expiringSoon,
      expired
   }
}


module.exports = {
   createCustomer,
   getCustomerList,
   findCustomer,
   updateCustomer,
   deleteCustomer,
   getDashboardStats,
};