
import { Router } from 'express'

import prisma from '../prisma.js'

const taskRouter = Router()

taskRouter.get("/", async (req, res) => {
   const lista = await prisma.tarea.findMany({
    where: {
        idUsuario: req.user.id
    }
   })
   res.json(lista.map(t => {
        return {id: t.id, 
            nombre: t.nombre, 
            estado: t.estado,
            prioridad: t.prioridad, 
            categoria: t.categoria,
            responsable: t.responsable}
    }))
})

taskRouter.get("/:id", async (req, res) => {
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

taskRouter.post('/', async (req, res) => {
    const t = req.body
    if (t?.nombre == null)
        return res.status(400).json({error: 'El nombre es obligatorio'})

    const nueva = {
        nombre: t.nombre,
        estado: t.estado || 'to do',
        prioridad: t.prioridad || 1,
        idUsuario: req.user.id,
        deadline: t.deadline,
        descripcion: t.descripcion,
        categoria: t.categoria
    }
    const t2 = await prisma.tarea.create({
        data: nueva
    })
    res.status(201).json(t2)
})

taskRouter.delete('/:id', async (req, res) => {
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

taskRouter.patch('/:id', async (req, res) => {
    const id = Number(req.params.id)

    const t = await prisma.tarea.update({
        where: {id: id},
        data: req.body
    })
    if (t == null)
        return res.status(404).json({error: 'No se ha encontrado'})
    res.status(200).json(t)
})

export default taskRouter