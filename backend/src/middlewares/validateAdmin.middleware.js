const validateAdmin = (req, res, next) => { // Validación de que el usuario sea admin usado en ciertas rutas y procesos, para cortar acceso en métodos específicos a usuarios comunes
  const auth = req.headers["x-auth"];

  // Siempre detecta si es admin
  req.isAdmin = auth === "admin";

  // Solo bloquea el acceso a usuarios normales en los 3 últimos métodos
  const protectedMethods = ["POST", "PUT", "DELETE"];

  if (protectedMethods.includes(req.method) && !req.isAdmin) { // Mensaje de error
    return res.status(403).json({
      mensaje: "Acceso no autorizado, se requieren permisos de administrador"
    });
  }

  next(); // De otro modo, se continúa el flujo
};

export { validateAdmin };