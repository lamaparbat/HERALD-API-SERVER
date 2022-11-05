const router = require('express').Router();
const auth = require("../middlewares/auth");
const {
  PostRoutine,
  GetRoutine,
  UpdateRoutine,
  DeleteRoutine,
  OngoingRoutine
} = require("../controllers/index.controller").routineControllers;


router.post('/routines/ongoing', auth.VerifyJWT(['admin', 'teacher', 'student']), OngoingRoutine)

// ****** --> CRUD Routine Operation <-- *********
//post routine data
router.post('/admin/postRoutineData', auth.VerifyJWT(["admin"]),auth.routineAuth(), PostRoutine);

//get all routine data
router.get('/routines', auth.VerifyJWT(["admin", "teacher","student"]), GetRoutine);

//get single routine data
router.get('/routines/:routineID', auth.VerifyJWT(["admin", "teacher","student"]), GetRoutine);

//update routine data
router.put('/admin/updateRoutineData',auth.VerifyJWT(["admin"]),auth.routineAuth(),UpdateRoutine )

//delete routine data
router.delete('/admin/deleteRoutineData', auth.VerifyJWT(["admin"]), DeleteRoutine)

module.exports = router;
