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
router.post('/admin/postRoutineData', auth.VerifyJWT, PostRoutine);

//get all routine data
router.get('/routines', auth.VerifyJWT, GetRoutine);

//update routine data
router.put('/admin/updateRoutineData', auth.VerifyJWT, UpdateRoutine )

//delete routine data
router.delete('/admin/deleteRoutineData', auth.VerifyJWT, DeleteRoutine)

module.exports = router;
