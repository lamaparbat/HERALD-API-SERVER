const multer = require('multer');
const path = require('path');

//disk storage configuration for schedule uploads
const scheduleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../../uploads/scheduleUploads`)
    },
    filename: (req, file, cb) => {
        const date = new Date();
        const prefix = date.toString().slice(0, 24).split(' ').join('-')
        cb(null, prefix + '-' + file.originalname)
    }
})

//filter function to filter out non .xlsx files
const uploadFilter = (req, file, cb) => {
    if (path.extname(file.originalname) !== '.xlsx') cb(null, false)
    cb(null, true)
}

//using fields insted of single for later scalibility
const scheduleUpload = multer({ storage : scheduleStorage, fileFilter : uploadFilter }).fields([{ name : 'schedule', maxCount : 1}]);

// upload college data
const storage2 = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, `${__dirname}/../../uploads`);
 },
 filename: (req, file, cb) => {
  req.body.uploadFileName = Date.now() + "-" + file.originalname;
  cb(null, req.body.uploadFileName);
 }
});

const collegeUpload = multer({ storage: storage2 }).single('excelfile');

module.exports = { scheduleUpload, collegeUpload }
