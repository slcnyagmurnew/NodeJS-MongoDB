const express = require("express");
const router = express.Router();

const mainController = require("../controller/mainController");

router.get("/", mainController.getIndex);

router.post("/counts", mainController.getCounts);

router.post("/master", mainController.getMaster);

router.post("/getFirstTxtData", mainController.getFirstTxtData);

router.post("/getSecondTxtData", mainController.getSecondTxtData);

router.post("/getThirdTxtData", mainController.getThirdTxtData);


module.exports = router;
