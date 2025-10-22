const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // 1. Extraer el token de la cabecera 'Authorization'
  // El formato esperado es: Bearer <token>
  const authHeader = req.headers["authorization"];

  // Si no hay cabecera 'Authorization' o no empieza con 'Bearer ', acceso denegado.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Acceso denegado. Token no proporcionado o formato inválido." });
  }

  // El token es la segunda parte después de 'Bearer '
  const token = authHeader.split(" ")[1];

  try {
    // 2. Verificación del Token
    // Usamos jwt.verify(token, clave_secreta)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Adjuntar la información del usuario a la petición (req.user)
    // Esto permite a los controladores saber quién está haciendo la petición
    req.user = decoded;

    // 4. Continuar: Permitir que la petición avance al controlador
    next();
  } catch (err) {
    // Si el token expiró, es inválido, o la firma no coincide
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};
