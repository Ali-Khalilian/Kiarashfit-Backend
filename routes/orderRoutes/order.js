const express = require("express");
const router = express.Router();
const {
    getOrders,createOrder
} = require("../../controllers/order/order");

const verifyJWT = require('../../middleware/verifyJWT'); 

router.get("/getOrders",verifyJWT, getOrders);
router.post("/add", createOrder);


module.exports = router;