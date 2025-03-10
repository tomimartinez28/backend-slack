import dotenv from 'dotenv'

dotenv.config() // Carga las variables de entorno en el objeto process.env

const ENVIRONMENT = {
    PORT: process.env.PORT,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    BACKEND_URL : process.env.BACKEND_URL,
    FRONTEND_URL: process.env.FRONTEND_URL
}

export default ENVIRONMENT