const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "user_img") {
            cb(null, './public/uploads/user/');
        }
        else if (file.fieldname === "arka_file") {
            cb(null, './public/uploads/3arka/');
        }
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).fields([
    { name: 'user_img', maxCount: 1 },
    { name: 'arka_file', maxCount: 1 }
]);

module.exports.upload = upload;