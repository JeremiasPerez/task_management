import jwt from 'jsonwebtoken'


export default function authMiddleware(req, res, next){
 const JWT_SECRET = 'clave_secreta_servidor'
 const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No hay token' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch(e) {
    return res.status(401).json({ error: e })
  }
}