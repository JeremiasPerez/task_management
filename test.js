
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
   url: process.env.DATABASE_URL || 'file:./datos.db',
})

const prisma = new PrismaClient({ adapter })

const nuevoProducto = await prisma.producto.create({
    data: {
        id: 1,
        nombre: 'iphone'
    }
})

console.log(nuevoProducto)