const routineModel = require("./models/routineModel");

routineModel.watch().on("change", (data) => {
 const update_info = {
  type: data.operationType,
  collection_name: data.ns.coll,
  group: data.fullDocument.group,
 }
});