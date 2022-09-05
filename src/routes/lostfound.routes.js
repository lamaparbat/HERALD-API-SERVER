const router = require('express').Router();
const {
 GetLostFoundData,
 ReportLostFoundData,
 UpdateLostData } = require('../controllers/LostFound/index.controller');
const auth = require('../middlewares/auth');

router.get('/lf/losts', auth.VerifyJWT(["admin", "student", "teacher"]), GetLostFoundData);
router.post('/lf/report', auth.VerifyJWT(["admin", "student", "teacher"]), ReportLostFoundData);
router.put('/lf/update', auth.VerifyJWT(["admin", "student", "teacher"]), UpdateLostData);

module.exports = router;