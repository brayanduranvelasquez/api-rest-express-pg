const { getMembers, createClient } = require("../services/member.services");
const { body, validationResult } = require("express-validator");

// Route handlers
const getMembersHandler = async (req, res) => {
  try {
    const membersList = await getMembers();

    res.status(200).json({
      success: true,
      message: "Lista de clientes obtenida exitosamente.",
      count: membersList.length,
      data: membersList,
    });
  } catch (error) {
    console.error("Error al obtener miembros:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener miembros.",
    });
  }
};

// Validation middleware
const validateCreateClient = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras y espacios"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("El teléfono es requerido")
    .isMobilePhone("es-MX")
    .withMessage("El formato del teléfono no es válido")
    .isLength({ min: 10, max: 15 })
    .withMessage("El teléfono debe tener entre 10 y 15 dígitos"),

  body("creatorId").isInt({ min: 1 }).withMessage("ID de creador no válido"),
];

const createClientHandler = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: errors.array(),
      });
    }

    const { firstName, lastName, phone, creatorId } = req.body;

    const newClient = await createClient(firstName.trim(), lastName.trim(), phone.trim(), creatorId);

    return res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente.",
      data: newClient,
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor al crear cliente.",
    });
  }
};

// Export all handlers and validators
module.exports = {
  // Validators
  validateCreateClient,

  // Route handlers
  getMembers: getMembersHandler,
  createClient: [...validateCreateClient, createClientHandler],
};
