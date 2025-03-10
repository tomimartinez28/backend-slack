import ENVIRONMENT from "./config/env.config.js";
import express from 'express'
import auth_router from "./routes/auth.router.js";
import mongoose from "./config/mongodb.config.js";
import cors from "cors"
import workspace_router from "./routes/workspace.router.js";
import channel_router from "./routes/channel.router.js";



const app = express()
// Si queres que sea publico
// app.use(cors())

// Reservado para ciertos dominios
app.use(cors({
    origin:ENVIRONMENT.FRONTEND_URL
})) 
app.use(express.json())


app.use('/api/auth', auth_router)
app.use('/api/workspace', workspace_router)
app.use('/api/channel', channel_router)


app.listen(ENVIRONMENT.PORT, () => {
    console.log(`Server is now running in http://localhost:${ENVIRONMENT.PORT}`);
})


