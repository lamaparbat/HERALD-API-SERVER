const router = require("express").Router();
const DEFAULT_ROUTES = require("../controllers/default.controller");


//default routing
router.get('/', DEFAULT_ROUTES);

router.post('/mailStatus', (req, res) => {
 const logs = JSON.parse(req.body.mandrill_events)[0];

 if (!['delivered', 'hard_bounce', 'soft_bounce', 'reject'].includes(logs.event))
  res.status(200);

 const { state, bounce_description } = logs.msg;

 console.log('webhook triggered ', state, bounce_description);

 // db query


 res.send({ message: 'Mandrill webhook endpoints ', state });
});


module.exports = router;