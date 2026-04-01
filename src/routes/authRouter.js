
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const JWT_SECRET = 'clave_secreta_servidor'

import prisma from '../prisma.js'

const authRouter = Router()

authRouter.post('/login', async (req, res) => {
    const u = await prisma.usuario.findUnique({
        where: {
            email: req.body.email
        }
    })
    if (u == null)
        return res.status(404).json({error: 'Usuario desconocido'})

    const esValida = await bcrypt.compare(req.body.password, u.password)
    if (!esValida)
        return res.status(401).json({error: 'Credenciales incorrectas'})

    const token = jwt.sign(
        { id: u.id, email: u.email }, // los datos que queremos guardar en el token
        JWT_SECRET, // la clave de firma
        { expiresIn: '4h' } // cuándo expira el token
    )

    return res.json({token: token})
})

authRouter.post('/registro', async (req, res) => {
    const user = await prisma.usuario.findUnique({
        where: {
            email: req.body.email
        }
    })
    if (user != null)
        return res.status(400).json({error: 'Ya existe el usuario'})
    
    const passCifrada = await bcrypt.hash(req.body.password, 10)

    const u = await prisma.usuario.create({
        data: {
            email: req.body.email,
            password: passCifrada
        }
    })

    return res.json({ok: true})

})

export default authRouter