const router = require("express").Router();
const DEFAULT_ROUTES = require("../controllers/default.controller");


//default routing
router.get('/', DEFAULT_ROUTES);

router.post('/mailStatus', (req, res) => {
 const data = req.body;
 console.log('check ', data)
 // const { state, bounce_description } = data[0]?.msg;
 // console.log('webhook triggered ', state, bounce_description);
 res.send({ message: 'Mandrill webhook endpoints ', data });
});


module.exports = router;