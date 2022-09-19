const SCOPE = {
  ADMIN_SCOPE: "admin",
  TEACHER_SCOPE: "teacher",
  STUDENT_SCOPE: "student",
};

const CLASS_TYPE = {
  LECTURE: "LECTURE",
  TUTORIAL: "TUTORIAL",
  WORKSHOP: "WORKSHOP",
};

ROUTINE_STATUS = ["RUNNING", "UPCOMING", "CANCELLED", "POSTPONED", "COMPLETED"];
COURSE_TYPE = ["BIT", "BIBM", "MBA"];
BLOCK_NAME = { Herald: "HCK", Wolverhampton: "WLV" };
CHECK_IF_AVAILABLE = {room: 'room',teacher: 'teacher', group: 'group'}

const WLV_BLOCK = [
  "LT-01 WULFRUNA",
  "LT-03 WALSALL",
  "SR-01 BANTOK",
  "SR-02 BILSTON",
  "SR-03 WOLVES",
  "TR-02 STAFFORD",
  "TR-03 WESTBROMWICH",
  "LAB-01 MANDAR",
  "LAB-02 MOSELEY",
];
const HCK_BLOCK = ["BASANTAPUR", "CHANDRAGIRI", "SAGARMATHA"];

const ROUTINE_PAYLOAD = [
  "courseType",
  "moduleName",
  "teacherName",
  "classType",
  "group",
  "roomName",
  "blockName",
  "day",
  "startTime",
  "endTime",
];
module.exports = { SCOPE, 
  CLASS_TYPE,
   WLV_BLOCK, 
   HCK_BLOCK, 
   ROUTINE_PAYLOAD,
   ROUTINE_STATUS,
   COURSE_TYPE,
   BLOCK_NAME ,
  CHECK_IF_AVAILABLE};
