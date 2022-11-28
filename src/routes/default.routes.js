const router = require("express").Router();
const DEFAULT_ROUTES = require("../controllers/default.controller");


//default routing
router.get('/', DEFAULT_ROUTES);

router.post('/mailStatus', (req, res) => {
 const { state, bounce_description } = JSON.parse(req.body.mandrill_events)[0]?.msg;
 console.log('webhook triggered ', state, bounce_description);
 res.send({ message: 'Mandrill webhook endpoints ', state });
});


module.exports = router;