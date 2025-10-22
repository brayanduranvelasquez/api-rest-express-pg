require("dotenv").config();
const express = require("express");
const memberRoutes = require("./src/routes/member.routes.js");
const authRoutes = require("./src/routes/auth.route.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
