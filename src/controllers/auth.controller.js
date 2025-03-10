import { ServerError } from "../utils/errors.utils.js"
import userRepository from "../repositories/user.repository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ENVIRONMENT from "../config/env.config.js"
import { sendMail } from "../utils/mailer.utils.js"

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) throw new ServerError('All fields are required', 400)

        // Hashear la pwd
        const passwordHash = await bcrypt.hash(password, 10)

        // Crear un token
        const verification_token = jwt.sign({ email }, // lo que queremos guardar en token
            ENVIRONMENT.SECRET_KEY_JWT, // clave con la que vamos a firmar
            { expiresIn: '24h' } // tiempo de validez del token
        )

        // enviar correo con token
        await sendMail({
            to: email,
            html: `<h1>Validate your email </h1>
                    <p>This proccess help us tu make sure you are who you say you are</p>
                    <a href='${ENVIRONMENT.BACKEND_URL}/api/auth/verify-email?verification_token=${verification_token}'>verificar cuenta</a>
            `,
            subject: 'Validate your email'
        })





        await userRepository.create({ username, email, password: passwordHash, verification_token })


        return res.status(201).send({
            message: "User registered",
            status: 201,
            ok: true
        })

    } catch (err) {
        console.log(err);

        if (err.status) {
            return res.status(400).send({
                ok: false,
                status: err.status,
                message: err.message
            })
        }
        return res.status(400).send({
            message: "Internal server error",
            status: 500,
            ok: true
        })
    }


}


export const verifyEmailController = async (req, res) => {
    try {
        const { verification_token } = req.query
        const payload = jwt.verify(verification_token, ENVIRONMENT.SECRET_KEY_JWT)
        const { email } = payload
        await userRepository.verifyUserByEmail(email)
        return res.redirect(ENVIRONMENT.FRONTEND_URL + '/login')

    } catch (err) {
        console.log(err);
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


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const foundUser = await userRepository.findUserByEmail(email)
        if (!foundUser) throw new ServerError('Incorrect email', 404)
        if (!foundUser.verified) throw new ServerError('User is not verified', 400)
        const is_same_password = await bcrypt.compare(password, foundUser.password)
        if (!is_same_password) throw new ServerError('Incorrect password', 400)

        const authorization_token = jwt.sign(
            {
                _id: foundUser._id,
                username: foundUser.username,
                emai: foundUser.email,
            },
            ENVIRONMENT.SECRET_KEY_JWT,
            { expiresIn: '2h' }
        )

        return res.json({
            ok: true,
            status: 200,
            message: 'Logged successfully',
            payload: {
                user: {
                    email: foundUser.email,
                    username: foundUser.username,
                    authorization_token,
                },
                
            }
        })

    } catch (err) {
        console.log(err);
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



export const resetPasswordController = async (req, res) => {
    try {
        const { email } = req.body
        const foundUser = await userRepository.findUserByEmail(email)
        if (!foundUser) throw new ServerError('Email is not registered', 404)
        if (!foundUser.verified) throw new ServerError('Email is not verified', 404)

        const resetToken = await jwt.sign(
            { email, _id: foundUser._id },
            ENVIRONMENT.SECRET_KEY_JWT,
            { expiresIn: '1h' })

        await sendMail({
            to: email,
            subject: 'Reset your password',
            html: `
                <h1>You request a password reset</h1>
                <a href='${ENVIRONMENT.FRONTEND_URL}/rewrite-password/?reset_token=${resetToken}'>Reset your password</a>
            `
        })

        return res.json({
            ok: true,
            status: 200,
            message: 'Reset mail send'
        })





    } catch (err) {
        console.log(err);
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


export const rewritePasswordController = async (req, res) => {
    try {
        const { newPassword, resetToken } = req.body
        const { _id } = jwt.verify(resetToken, ENVIRONMENT.SECRET_KEY_JWT)

        // Hashear la pwd
        const newHashedPassword = await bcrypt.hash(newPassword, 10)
        await userRepository.changeUserPassword(_id, newHashedPassword)

        
        return res.json({
            ok: true,
            message: 'Password changed succesfully',
            status: 201
        })


    } catch (err) {
        console.log(err);
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