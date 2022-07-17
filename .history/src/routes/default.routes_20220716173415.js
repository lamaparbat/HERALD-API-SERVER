const router = require("express").Router();
const DEFAULT_ROUTES = require("../controllers/default.controller");


//default routing
router.get('/', DEFAULT_ROUTES);
