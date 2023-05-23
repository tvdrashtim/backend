const router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const {
  getUser,
  signUp,
  updateUser,
  deleteUser,
  loginUser,
  getAllUser,
  searchUserByFname,
  getUserById,
  verifyToken
} = require("./controllers/user.controller");
const { EmployeesignUp, imageUpload } = require("./controllers/employee.controller")

const limit = 3;
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const fileExtName = file.originalname.substring(file.originalname.lastIndexOf('.'));
      const fileName = `${uuidv4()}${fileExtName}`;
      cb(null, fileName);
    }
  })
// }).single('file_name');       //for single image upload
}).array('file_name', limit);    //for multiple image upload

router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.get("/users/name", searchUserByFname);
router.get("/user/:search", getAllUser);
router.post("/users", signUp);
router.put("/users/:id",verifyToken, updateUser);
router.delete("/users/:todoID", deleteUser);
router.post("/users/login", loginUser);
router.post("/employee/signup", verifyToken, EmployeesignUp);
router.post("/upload", upload, imageUpload);

module.exports = router;
