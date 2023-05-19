const router = require("express").Router();
const path = require('path');
// const express = require("express");
// const multer = require("multer");
const {
  getUser,
  signUp,
  updateUser,
  deleteUser,
  loginUser
} = require("./controllers/user.controller");

router.get("/users", getUser);
router.post("/users", signUp);
router.put("/users/:id", updateUser);
router.delete("/users/:todoID", deleteUser);
router.post("/users/login", loginUser);

module.exports = router;
