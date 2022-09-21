
  
  ROUTINE_STATUS = ["RUNNING", "UPCOMING", "CANCELLED", "POSTPONED", "COMPLETED"];
  BLOCK_NAME = { Herald: "HCK", Wolverhampton: "WLV" };
  CHECK_IF_AVAILABLE = { room: "room", teacher: "teacher", group: "group" };
  
  const WLV_BLOCK_ROOMS = [
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
  const HCK_BLOCK_ROOMS = ["BASANTAPUR", "CHANDRAGIRI", "SAGARMATHA"];
  
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
    "status"
  ];
  
  
  module.exports = {
    WLV_BLOCK_ROOMS,
    HCK_BLOCK_ROOMS,
    ROUTINE_PAYLOAD,
    ROUTINE_STATUS,
    BLOCK_NAME,
    CHECK_IF_AVAILABLE,
  };
  
  
  
  