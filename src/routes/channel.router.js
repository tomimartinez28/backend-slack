import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createChannelController, sendMessageToChannelController, getMessagesListFromChannelCrontroller} from "../controllers/channel.controller.js";

const channel_router = Router()

// Crear canal
// chequear que el usuario que quiera crear un canal sea miembro en el workspace
channel_router.post('/:workspace_id', authMiddleware, createChannelController)



// Enviar mensajes
channel_router.post('/:channel_id/messages',  authMiddleware, sendMessageToChannelController)


channel_router.get('/:channel_id/messages', authMiddleware, getMessagesListFromChannelCrontroller)


export default channel_router