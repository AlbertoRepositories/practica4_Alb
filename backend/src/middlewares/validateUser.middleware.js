const validateUser = (req, res, next) => { // Validación para que se requiera el uso de headers con un usuario como nombre, aplicado en ciertas rutas
  const user = req.headers["x-user"];

  if (!user) {
    return res.status(403).json({
      mensaje: "El header x-user es obligatorio"
    });
  }

  req.userName = user;
  next();
};

export { validateUser };