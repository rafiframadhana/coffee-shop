// Check for authenticated user
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Not authenticated" });
};

// Check for authenticated admin
export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  return res.status(403).json({ error: "Forbidden, You're not admin" });
};
