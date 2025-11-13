import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "لا يوجد توكن" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("خطأ في التوكن:", err.message);
    return res.status(401).json({ error: "Token invalid" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "ممنوع - صلاحيات غير كافية" });
    }
    next();
  };
};