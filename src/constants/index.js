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

const WLV_BLOCK = [
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
const HCK_BLOCK = [
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
module.exports = { SCOPE, CLASS_TYPE ,WLV_BLOCK,HCK_BLOCK, ROUTINE_PAYLOAD}
