const router = require("express").Router();
const path = require('path');
// const express = require("express");
// const multer = require("multer");
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
const { EmployeesignUp } = require("./controllers/employee.controller")

router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.get("/users/name", searchUserByFname);
router.get("/user", getAllUser);
router.post("/users", signUp);
router.put("/users/:id",verifyToken, updateUser);
router.delete("/users/:todoID", deleteUser);
router.post("/users/login", loginUser);
router.post("/employee/signup", verifyToken, EmployeesignUp);

module.exports = router;
