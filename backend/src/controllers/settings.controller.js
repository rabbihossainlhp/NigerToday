const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { settingsService } = require("../services");

const getSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.getSettingsByUserId(req.user.id);

  res.status(httpStatus.OK).json(
    response({
      message: "Settings fetched",
      statusCode: httpStatus.OK,
      data: settings,
    })
  );
});

const updateSettings = catchAsync(async (req, res) => {
  const updates = {};

  for (const [key, value] of Object.entries(req.body.reminders)) {
    updates[`reminders.${key}`] = value;
  }

  const settings = await settingsService.updateSettingsByUserId(
    req.user.id,
    updates
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Settings updated",
      statusCode: httpStatus.OK,
      data: settings,
    })
  );
});

module.exports = {
  getSettings,
  updateSettings,
};