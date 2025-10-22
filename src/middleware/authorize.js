// Esta función toma un array de IDs de rol permitidos (ej: [1, 2])
exports.authorize = (allowedRoles) => {
  // Y devuelve la función middleware (la que Express ejecuta)
  return (req, res, next) => {
    // 1. Obtener el rol del usuario desde el JWT (que ya fue adjuntado por verifyToken)
    const userRoleId = req.user.role_id;

    // 2. Verificar el Rol
    // Comprobar si el role_id del usuario está incluido en el array de roles permitidos
    if (allowedRoles.includes(userRoleId)) {
      // 3. Si el rol está permitido, la petición continúa
      next();
    } else {
      // 4. Si el rol no está permitido, acceso denegado (403 Forbidden)
      return res.status(403).json({ message: "Permiso denegado. Rol insuficiente para esta acción." });
    }
  };
};
