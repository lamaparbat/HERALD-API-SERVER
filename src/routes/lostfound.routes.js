const router = require('express').Router();
const {
 GetLostFoundData,
 ReportLostFoundData,
 UpdateLostData } = require('../controllers/LostFound/index.controller');

const auth = (req, res, next) => {
 req.headers.scope = "teacher";
 next();
}

router.get('/lf/losts',auth, GetLostFoundData);
router.post('/lf/report', ReportLostFoundData);
router.put('/lf/update', UpdateLostData);

module.exports = router;