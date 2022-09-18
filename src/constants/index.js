const SCOPE = {
  ADMIN_SCOPE: 'admin',
  TEACHER_SCOPE: 'teacher',
  STUDENT_SCOPE: 'student',
}

const CLASS_TYPE = {
  LECTURE: 'LECTURE',
  TUTORIAL: 'TUTORIAL',
  WORKSHOP: 'WORKSHOP',
}

const BLOCK = [
  "HCK",
  "WLV"
]

const WLV_ROOMS = [
  'LT-01 WULFRUNA',
  'LT-03 WALSALL',
  'SR-01 BANTOK',
  'SR-02 BILSTON',
  'SR-03 WOLVES',
  'TR-02 STAFFORD',
  'TR-03 WESTBROMWICH',
  'LAB-01 MANDAR',
  'LAB-02 MOSELEY',
]
const HCK_ROOMS = [
    'BASANTAPUR',
    'CHANDRAGIRI',
    'SAGARMATHA',
]

const ROUTINE_PAYLOAD=[
    'courseType',
    'moduleName',
    'teacherName',
    'classType',
    'group',
    'roomName',
    'blockName',
    'day',
    'startTime',
    'endTime',
]

const ROUTINE_STATUS = ["Running", "Upcoming", "Cancelled", "Postponed", "Completed"]
  
module.exports = {
  SCOPE,
  CLASS_TYPE,
  BLOCK,
  WLV_ROOMS,
  HCK_ROOMS,
  ROUTINE_PAYLOAD,
  ROUTINE_STATUS
}
