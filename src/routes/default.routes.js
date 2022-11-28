const router = require("express").Router();
const DEFAULT_ROUTES = require("../controllers/default.controller");


//default routing
router.get('/', DEFAULT_ROUTES);

router.post('/mailStatus', (req, res) => {
 console.log(req.body)
 if (!req.body.length)
  return res.status(200);

 console.log(req.body?.mandrill_events)
 if (!req.body?.mandrill_events)
  return res.status(200);

 const logs = JSON.parse(req.body.mandrill_events)[0];
 console.log(req.body.mandrill_events, logs)
 // return res.status(200);
 console.log(logs?.event)

 const { state, bounce_description } = logs.msg;
 console.log('webhook triggered ', state, bounce_description);

 // db query


 res.send({ message: 'Mandrill webhook endpoints ', state });
});


module.exports = router;