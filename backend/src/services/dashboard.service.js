const { Customer } = require("../models");



const getDashboardStats = async () => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   const tomorrow = new Date(today);
   tomorrow.setDate(tomorrow.getDate() + 1);
   const tenDaysLater = new Date(today);
   tenDaysLater.setDate(tenDaysLater.getDate() + 10);
   tenDaysLater.setHours(23, 59, 59, 999);

   const [total, expiringSoon, expired, active] = await Promise.all([
      Customer.countDocuments({}),
      Customer.countDocuments({ expiresAt: { $gte: tomorrow, $lte: tenDaysLater } }),
      Customer.countDocuments({ expiresAt: { $lt: tomorrow } }),
      Customer.countDocuments({ expiresAt: { $gt: tenDaysLater } }),
   ])

   return {
      total,
      active,
      expiringSoon,
      expired
   }
}


module.exports = {
    getDashboardStats
}