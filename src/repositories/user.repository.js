import User from "../models/User.model.js"
import { ServerError } from "../utils/errors.utils.js"
import { USER_PROPS } from "../models/User.model.js"

class UserRepository {
    async create({ username, email, password, verification_token }) {
        try {
            await User.create({
                [USER_PROPS.USERNAME]: username,
                [USER_PROPS.EMAIL]: email,
                [USER_PROPS.PASSWORD]: password,
                [USER_PROPS.VERIFICATION_TOKEN]: verification_token
            })
        } catch (err) {
            if (err.code === 11000) {
                if (err.keyPattern.username) {
                    throw new ServerError('Username already in use', 400)
                }
                if (err.keyPattern.email) {
                    throw new ServerError('Email already in use', 400)
                }

            }
            throw err
        }
    }

    async verifyUserByEmail(email) {
        const foundUser = await this.findUserByEmail(email)
        if(!foundUser) throw new ServerError('User not found', 404)
        if(foundUser.verified) throw new ServerError('User has already been verified', 400)
        foundUser.verified = true
        await foundUser.save()
    }

    async changeUserPassword(id, newPassword) {
        const foundUser = await this.findUserById(id)
        if(!foundUser) throw new ServerError('User not found', 404)
        foundUser.password = newPassword
        await foundUser.save()
    }

    async findUserByEmail(email) {
        return await User.findOne({ [USER_PROPS.EMAIL]: email })
    }

    async findUserById(id) {
        return await User.findOne({ [USER_PROPS._ID]: id })
    }

}


export default new UserRepository()