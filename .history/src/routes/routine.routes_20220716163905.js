const router = require('express').Router();
const auth = require("../middlewares/auth");
const { POST_ROUTINE_DATA, GET_ROUTINE_DATA } = require("../controllers/index.controller").routineControllers;


// ****** --> CRUD Routine Operation <-- *********
//post routine data
router.post('/api/v4/admin/postRoutineData', auth.VerifyJWT, POST_ROUTINE_DATA);

//get all routine data
router.get('/api/v4/routines/getRoutineData', auth.VerifyJWT, GET_ROUTINE_DATA);

//get the routine data based on level wise
router.get(
 '/api/v4/routines/getRoutineByLevel',
 auth.VerifyJWT,
 async (req, res) => {
  // destructuring the level from headers
  const level = `L${req.headers.level}`;

  //fetch all routine from db
  const result = await routineModel.find();

  const filterData = result.filter(data => {
   return data.group.includes(level);
  })

  if (filterData.length != 0) {
   return res.status(200).send({
    data: filterData,
   })
  } else {
   return res.status(404).send({
    message: 'Result: 0 found !!',
   })
  }
 }
);

//get the routine data based on level wise
router.get(
 '/api/v4/routines/getRoutineByGroup',
 auth.VerifyJWT,
 async (req, res) => {
  // destructuring the level from headers
  const group = `G${req.headers.group}`;

  //fetch all routine from db
  const result = await routineModel.find();

  const filterData = result.filter(data => {
   return data.group.includes(group);
  })

  if (filterData.length != 0) {
   return res.status(200).send({
    data: filterData,
   })
  } else {
   return res.status(404).send({
    message: 'Result: 0 found !!',
   })
  }
 }
);

//update routine data
router.put('/api/v4/admin/updateRoutineData', auth.VerifyJWT, (req, res) => {
 //get the routine doc id
 const {
  course_type,
  module_name,
  lecturer_name,
  class_type,
  group,
  room_name,
  block_name,
  day,
  start_time,
  end_time,
 } = req.body;

 routineModel.findByIdAndUpdate(
  routineID,
  {
   course_type: course_type.toUpperCase(),
   module_name: module_name.toUpperCase(),
   lecturer_name: lecturer_name,
   class_type: class_type.toUpperCase(),
   group: group.toUpperCase(),
   room_name: room_name.toUpperCase(),
   block_name: block_name,
   day: day.toUpperCase(),
   start_time: start_time,
   end_time: end_time,
   createdOn: new Date().toLocaleDateString(),
  },
  (err, data) => {
   if (err) {
    return res.status(500).send({
     message: 'Internal Server Error !!',
    })
   } else {
    return res.status(200).send({
     message: 'Routine succesfully updated !!',
    })
   }
  }
 )
})

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
