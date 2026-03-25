

import express from "express";
import cors from 'cors'

import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
   url: process.env.DATABASE_URL || 'file:./datos.db',
})

const prisma = new PrismaClient({ adapter })


const app = express();
app.use(express.json());
app.use(cors())

app.get("/api/tareas", async (req, res) => {
   const lista = await prisma.tarea.findMany({})
   res.json(lista.map(t => {
        return {id: t.id, 
            nombre: t.nombre, 
            estado: t.estado,
            prioridad: t.prioridad, 
            categoria: t.categoria,
            responsable: t.responsable}
    }))
})

app.get("/api/tareas/:id", async (req, res) => {
    const idPar = Number(req.params.id)
    const tarea = await prisma.tarea.findUnique({
        where: {
            id: idPar
        }
    })
    if (tarea == null)
        res.status(404).json({error: 'No se ha encontrado la tarea'})

    const newT = {...tarea}
    newT.deadline = new Date(newT.deadline).toISOString().split('T')[0]

    res.json(newT)
})

app.post('/api/tareas', async (req, res) => {
    const t = req.body
    if (t?.nombre == null)
        return res.status(400).json({error: 'El nombre es obligatorio'})

    const nueva = {
        nombre: t.nombre,
        estado: t.estado || 'to do',
        prioridad: t.prioridad || 1,
        responsable: t.responsable,
        deadline: t.deadline,
        descripcion: t.descripcion,
        categoria: t.categoria
    }
    const t2 = await prisma.tarea.create({
        data: nueva
    })
    res.status(201).json(t2)
})

app.delete('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id)

    const t = await prisma.tarea.delete({
        where: {
            id: id
        }
    })
    if (t == null) 
        return res.status(404).json({error: 'La tarea no se ha encontrado'})

    res.status(200).send()
})

app.patch('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id)

    const t = await prisma.tarea.update({
        where: {id: id},
        data: req.body
    })
    if (t == null)
        return res.status(404).json({error: 'No se ha encontrado'})
    res.status(200).json(t)
})

app.post('/api/auth/login', async (req, res) => {
    const u = await prisma.usuario.findUnique({
        where: {
            email: req.body.email
        }
    })
    if (u == null)
        return res.status(404).json({error: 'Usuario desconocido'})

    if (u.password != req.body.password)
        return res.status(401).json({error: 'Credenciales incorrectas'})

    return res.json({ok: true})

})

app.post('/api/auth/registro', async (req, res) => {
    
    const user = await prisma.usuario.findUnique({
        where: {
            email: req.body.email
        }
    })

    if (user != null)
        return res.status(400).json({error: 'Ya existe el usuario'})
    
    const u = await prisma.usuario.create({
        data: {
            email: req.body.email,
            password: req.body.password
        }
    })

    return res.json({ok: true})

})


app.listen(3000);
