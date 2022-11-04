
const GetRoutine = require("./sub-controllers/getRoutine.controller");
const PostRoutine = require("./sub-controllers/postRoutine.controller");
const UpdateRoutine = require("./sub-controllers/updateRoutine.controller");
const DeleteRoutine = require("./sub-controllers/deleteRoutine.controller");
const OngoingRoutine = require('./sub-controllers/getOngoingRoutine.controller')

module.exports = {
    GetRoutine,
    PostRoutine,
    UpdateRoutine,
    DeleteRoutine,
    OngoingRoutine,
}
