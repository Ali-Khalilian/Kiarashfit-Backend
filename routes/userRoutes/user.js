const express = require("express");
const router = express.Router();
const { getUsers,deleteUser,editUser,getUser, plan } = require("../../controllers/users/user");

const verifyJWT = require('../../middleware/verifyJWT'); 

router.get("/getUsers", getUsers);
router.get("/getUser", getUser);
router.put("/editUser", editUser);
router.delete("/delete", deleteUser);
router.post("/userPlan", plan);

module.exports = router;
