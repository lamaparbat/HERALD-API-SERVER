const GetLostFoundData = require("./utility/lostFound.controller"); // public scope
const ReportLostFoundData = require("./utility/reportLostFound.controller"); // public scope
const UpdateLostData = require("./utility/updateLostData.controller"); // private scope

module.exports = {
 GetLostFoundData,
 ReportLostFoundData,
 UpdateLostData
};