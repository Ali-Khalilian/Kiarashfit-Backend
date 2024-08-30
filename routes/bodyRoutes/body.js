const express = require("express");
const router = express.Router();
const {
 createBody,getAllBodies,updateBody,getBody, deleteBody
} = require("../../controllers/body/bodyController");


router.get("/getAll", getAllBodies);
router.get("/getOne", getBody);
router.post("/add", createBody);
router.put("/update", updateBody);
router.delete("/delete", deleteBody);

module.exports = router;