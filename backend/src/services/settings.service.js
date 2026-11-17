const { Settings } = require("../models");

const getSettingsByUserId = async (userId) =>{
  return await Settings.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  )
};



const updateSettingsByUserId = async (userId, updates) => {
  return await Settings.findOneAndUpdate(
    { userId },
    {
      $set: updates,
      $setOnInsert: { userId },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  )
};

module.exports = {
  getSettingsByUserId,
  updateSettingsByUserId,
};