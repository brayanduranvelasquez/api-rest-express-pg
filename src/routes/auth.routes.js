const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/verifyToken");
const { authorize } = require("../middleware/authorize");
const { ROLES, ROLES_PERMISSIONS } = require("../constants/roles");

// Solo accesible sin autenticación
router.post("/login", authController.login);

// Solo accesible por administradores
router.post(
  "/register", 
  verifyToken, 
  authorize(ROLES_PERMISSIONS.ADMIN_ONLY), 
  authController.register
);

module.exports = router;
