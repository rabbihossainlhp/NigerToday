const { Customer } = require("../models");



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
    getDashboardStats
}