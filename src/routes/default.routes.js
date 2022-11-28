const router = require("express").Router();
const DEFAULT_ROUTES = require("../controllers/default.controller");


//default routing
router.get('/', DEFAULT_ROUTES);

router.post('/mailStatus', (req, res) => {
 const data = req.body;
 console.log('webhook triggered ', data);
 res.json({ message: 'Mandrill webhook endpoints ', data });
});


module.exports = router;