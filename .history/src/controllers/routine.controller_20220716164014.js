const routineModel = require('../models/routineModel');

const POST_ROUTINE_DATA = async (req, res) => {
 //destructuring incoming data
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
 } = req.body

 //check if all attributes are recieved or not ?
 if (Object.keys(req.body).length < 9) {
  return res
   .status(404)
   .send('Some fields are missing. Please provide all the fields !!')
 }

 //minor validation
 if (
  course_type.length > 0 &&
  module_name.length > 0 &&
  lecturer_name.length > 0 &&
  class_type.length > 0 &&
  group.length > 0 &&
  room_name.length > 0 &&
  day.length > 0 &&
  start_time.length > 0 &&
  end_time.length > 0 &&
  block_name.length > 0
 ) {
  const data = new routineModel({
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
  });

  const result = await routineModel.find({ createdOn: new Date().toLocaleDateString(), day: day, module_name: module_name });
  if (result.length > 0) {
   res.status(404).send(`Routine of ${module_name} for the date ${new Date().toLocaleDateString()} has already been created.`)
  }

  data.save().then(async () => {
   //upload message to notification db
   const notifData = new notifModel({
    message: `Dear ${group} of ${course_type}, a new routine of ${module_name} has recently published. Please see it once.`,
    group: group,
    createdOn: new Date().toLocaleDateString(),
   })

   try {
    const result = await notifData.save()
    if (result.message) {
     pusher.trigger("my-channel", "notice", {
      message: `Dear ${group} of ${course_type}, a new routine of ${module_name} has recently published. Please see it once.`
     });
     return res.status(200).send({
      message: 'Routine posted successfully !!',
     })
    }
   } catch (error) {
    return res.status(500).send(err)
   }
  })
   .catch((err) => {
    return res.status(500).send(err)
   })
 } else {
  return res.status(403).send('Please fill all the field !!')
 }
}


const GET_ROUTINE_DATA = async (req, res) => {
  //fetch all routine from db
  const result = await routineModel.find()
  if (result.length != 0) {
    return res.status(200).send({
      data: result,
    })
  } else {
    return res.status(200).send({
      message: 'Result: 0 found !!',
    })
  }
}

const GET_ROUTINE_BY_LEVEL = async (req, res) => {
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


module.exports = { POST_ROUTINE_DATA, GET_ROUTINE_DATA, GET_ROUTINE_BY_LEVEL }