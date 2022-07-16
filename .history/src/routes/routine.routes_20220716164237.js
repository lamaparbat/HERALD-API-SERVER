const router = require('express').Router();
const auth = require("../middlewares/auth");
const {
  POST_ROUTINE,
  GET_ROUTINE,
  GET_ROUTINE_BY_LEVEL,
  GET_ROUTINE_BY_GROUP,
  UPDATE_ROUTINE
} = require("../controllers/index.controller").routineControllers;


// ****** --> CRUD Routine Operation <-- *********
//post routine data
router.post('/api/v4/admin/postRoutineData', auth.VerifyJWT, POST_ROUTINE);

//get all routine data
router.get('/api/v4/routines/getRoutineData', auth.VerifyJWT, GET_ROUTINE);

//get the routine data based on level wise
router.get('/api/v4/routines/getRoutineByLevel', auth.VerifyJWT, GET_ROUTINE_BY_LEVEL);

//get the routine data based on level wise
router.get('/api/v4/routines/getRoutineByGroup', auth.VerifyJWT, GET_ROUTINE_BY_GROUP);

//update routine data
router.put('/api/v4/admin/updateRoutineData', auth.VerifyJWT, UPDATE_ROUTINE )

//delete routine data
router.delete('/api/v4/admin/deleteRoutineData', auth.VerifyJWT, (req, res) => {
 //get the routine doc id
 const { routineID } = req.body
 routineModel
  .remove({ _id: routineID })
  .then((data) => {
   return res.status(200).send({
    message: 'Routine succesfully deleted !!',
   })
  })
  .catch((err) => {
   return res.status(500).send({
    message: 'Failed to delete routine !!',
   })
  })
})

// search routine by id
router.get('/api/v4/routines/searchRoutine', auth.VerifyJWT, async (req, res) => {
 const { module_name, group } = req.headers

 //search routine in db
 const result = await routineModel.find({
  module_name: module_name,
  group: group,
 })

 if (result.length != 0) {
  return res.status(200).send({
   data: result,
  })
 } else {
  return res.status(404).send({
   message: 'Routine not found !!',
  })
 }
}
)


module.exports = router;
