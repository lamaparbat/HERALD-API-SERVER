const router = require('express').Router();
const auth = require("../middlewares/auth");
const {
  POST_ROUTINE,
  GET_ROUTINE,
  UPDATE_ROUTINE,
  DELETE_ROUTINE
} = require("../controllers/index.controller").routineControllers;


// ****** --> CRUD Routine Operation <-- *********
//post routine data
router.post('/api/v4/admin/postRoutineData', auth.VerifyJWT, POST_ROUTINE);

//get all routine data
router.get('/api/v4/routines/getRoutineData', auth.VerifyJWT, GET_ROUTINE);

//update routine data
router.put('/api/v4/admin/updateRoutineData', auth.VerifyJWT, UPDATE_ROUTINE )

//delete routine data
router.delete('/api/v4/admin/deleteRoutineData', auth.VerifyJWT, DELETE_ROUTINE)

module.exports = router;
