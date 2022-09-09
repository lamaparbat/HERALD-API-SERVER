const router = require('express').Router();
const auth = require("../middlewares/auth");
const {
  PostRoutine,
  GetRoutine,
  UpdateRoutine,
  DeleteRoutine,
} = require("../controllers/index.controller").routineControllers;


// ****** --> CRUD Routine Operation <-- *********
//post routine data
router.post('/admin/postRoutineData', auth.VerifyJWT(["admin"]), PostRoutine);

//get all routine data
router.get('/routines', auth.VerifyJWT(["admin", "teacher","student"]), GetRoutine);

//update routine data
router.put('/admin/updateRoutineData', auth.VerifyJWT(["admin"]), UpdateRoutine )

//delete routine data
router.delete('/admin/deleteRoutineData', auth.VerifyJWT(["admin"]), DeleteRoutine)

module.exports = router;
