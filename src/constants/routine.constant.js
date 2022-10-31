const ROUTINE_STATUS = [
    'RUNNING',
    'UPCOMING',
    'CANCELLED',
    'POSTPONED',
    'COMPLETED',
];

const CHECK_IF_AVAILABLE = { room: 'room', teacher: 'teacher', group: 'group' };

const ROOMS = {
    HCK: ['BASANTAPUR', 'CHANDRAGIRI', 'SAGARMATHA'],
    WLV: [
        'LT-01 WULFRUNA',
        'LT-03 WALSALL',
        'SR-01 BANTOK',
        'SR-02 BILSTON',
        'SR-03 WOLVES',
        'TR-02 STAFFORD',
        'TR-03 WESTBROMWICH',
        'LAB-01 MANDAR',
        'LAB-02 MOSELEY',
    ],
};

const ROUTINE_PAYLOAD = [
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
    'status',
];

const VALID_DAYS = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
];

module.exports = {
    ROUTINE_PAYLOAD,
    ROUTINE_STATUS,
    CHECK_IF_AVAILABLE,
    ROOMS,
    VALID_DAYS,
};
