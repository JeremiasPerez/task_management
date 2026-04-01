# Partimos de una imagen base con Node.js (versión 20).
FROM node:20-alpine
# Definimos la carpeta de trabajo (equivalente a cd /app)
WORKDIR /app
# Copiamos los ficheros package.json y package-lock.json en /app
COPY package*.json ./
# Instalamos dependencias, omitiendo las devDependencies
RUN npm ci --omit=dev
# Copiamos el schema.prisma y las migraciones en /app
COPY prisma ./prisma
# Copiamos el fichero con la configuracion de Prisma en /app
COPY prisma.config.ts ./
# Definimos la variable de entorno con la URL de la BD
ENV DATABASE_URL="file:/app/data/datos.db"
# Generamos el cliente de Prisma
RUN npx prisma generate
# Copiamos todo el proyecto (.) en la carpeta actual (.)
COPY . .
# Indicamos que el backend escucha en el puerto 3000
EXPOSE 3000
# Arrancamos el backend
CMD ["node", "src/server.js"]