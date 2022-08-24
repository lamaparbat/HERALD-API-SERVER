const GetLostFoundData = require("./sub-controllers/getLostFound.controller"); // public scope
const ReportLostFoundData = require("./sub-controllers/reportLostFound.controller"); // public scope
const UpdateLostData = require("./sub-controllers/updateLostData.controller"); // private scope

module.exports = {
 GetLostFoundData,
 ReportLostFoundData,
 UpdateLostData
};