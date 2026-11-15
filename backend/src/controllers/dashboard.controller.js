const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");

const {dashboardService} = require("../services")


const getDashboardStats = catchAsync(async(req,res)=>{
  const stats = await dashboardService.getDashboardStats();

  res.status(httpStatus.OK).json(
    response({
      message: "Dashboard stats fetched successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: stats,
    })
  );
})



module.exports = {
    getDashboardStats
}

