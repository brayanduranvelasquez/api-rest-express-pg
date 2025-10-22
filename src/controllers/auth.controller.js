const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { findByEmail } = require("../services/auth.services");
const { createAnalyst } = require("../services/auth.services");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const validateRegister = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El formato del correo electrónico no es válido")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("La contraseña debe contener al menos un carácter especial"),
];

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const existingUser = await findByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "El correo ya está registrado.",
      });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = await createAnalyst(email, passwordHash);
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role_id: newUser.role_id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(201).json({
      success: true,
      message: "Analista registrado exitosamente",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          role_id: newUser.role_id,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al registrar el usuario.",
    });
  }
};

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El formato del correo electrónico no es válido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const user = await findByEmail(email);

    // 1. Validar si el usuario existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // 2. Validar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      });
    }

    // 3. Generar token JWT
    const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // 4. Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        user: {
          id: user.id,
          email: user.email,
          role_id: user.role_id,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al iniciar sesión.",
    });
  }
};

// Export all handlers and validators
module.exports = {
  // Validators
  validateRegister,
  validateLogin,

  // Route handlers
  register: [...validateRegister, register],
  login: [...validateLogin, login],
};
