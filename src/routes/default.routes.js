const router = require("express").Router();
const DEFAULT_ROUTES = require("../controllers/default.controller");


//default routing
router.get('/', DEFAULT_ROUTES);

router.post('/mailStatus', (req, res) => {
 console.log('olaa ', req.body)
 const data = JSON.parse(req.body);
 const { state, bounce_description } = data[0]?.msg;
 console.log('webhook triggered ', state, bounce_description);
 res.send({ message: 'Mandrill webhook endpoints ', data });
});


module.exports = router;