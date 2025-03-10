import ENVIRONMENT from "../config/env.config.js"
import { ServerError } from "../utils/errors.utils.js"
import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
    try {
        // LLEGARA ALGO ASI
        // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjUyNDM2Y2IxN2RiZDllZDRlMDJjYyIsInVzZXJuYW1lIjoidG9taSIsImVtYWkiOiJ0b21pbWFydGluZXouZGV2QGdtYWlsLmNvbSIsImlhdCI6MTc0MDA5Mzg1NCwiZXhwIjoxNzQwMTAxMDU0fQ.nQZnpvfvm1A-GJV9UZK_XG1ei0u10ZASJSRf0WlRfs4
        const autherization_header = req.headers['authorization']

        if (!autherization_header) throw new ServerError('No proporcionaste un header', 401)

        const autherization_token = autherization_header.split(' ')[1]
        if (!autherization_token) throw new ServerError('No hay un token de autorizacion', 401)


        try {

            const user_info = jwt.verify(autherization_token, ENVIRONMENT.SECRET_KEY_JWT)
            req.user = user_info // lo mando en la consulta para que viaje al controller :)
            next()
        } catch (err) {
            throw new ServerError('Token invalido o vencido', 400)
        }

        


    } catch (err) {
        console.log('Error en el middleware', err);

        if (err.status) {
            return res.send({
                ok: false,
                status: err.status,
                message: err.message
            })
        }
        return res.send({
            message: "Internal server error",
            status: 500,
            ok: true
        })
    }
}