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
router.post('/admin/postRoutineData', auth.VerifyJWT, POST_ROUTINE);

//get all routine data
router.get('/routines', auth.VerifyJWT, GET_ROUTINE);

//update routine data
router.put('/admin/updateRoutineData', auth.VerifyJWT, UPDATE_ROUTINE )

//delete routine data
router.delete('/admin/deleteRoutineData', auth.VerifyJWT, DELETE_ROUTINE)

module.exports = router;
