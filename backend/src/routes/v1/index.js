const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const customerRoute = require("./customer.routes");
const renewalRoute = require("./renewal.routes")
const dashboardRoute = require("./dashboard.routes")
const settingsRoute = require("./settings.routes")



const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path:"/customer",
    route:customerRoute,
  },
  {
    path:"/renewals",
    route:renewalRoute
  },
    {
    path:"/dashboard",
    route:dashboardRoute
  },
  {
    path:"/settings",
    route:settingsRoute
  }
 
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
