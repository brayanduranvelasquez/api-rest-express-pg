const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const { verifyToken } = require("../middleware/verifyToken");
const { authorize } = require("../middleware/authorize");
const { ROLES, ROLES_PERMISSIONS } = require("../constants/roles");

router.get("/", verifyToken, authorize(ROLES_PERMISSIONS.ADMIN_AND_ANALYST), memberController.getMembers);
router.post("/", verifyToken, authorize([ROLES.ANALYST]), memberController.createClient);

module.exports = router;
