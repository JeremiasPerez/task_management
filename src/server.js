
import express from "express";
import cors from 'cors'
import authMiddleware from "./authMiddleware.js";

import authRouter from "./routes/authRouter.js";
import taskRouter from "./routes/taskRouter.js";

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/tareas', authMiddleware, taskRouter)
app.use('/api/auth', authRouter)


app.listen(3000);
