
import channelRepository from "../repositories/channel.repository.js"
import messageRepository from "../repositories/message.repository.js"

export const createChannelController = async (req, res) => {
    try {
        const { name } = req.body
        const { _id } = req.user
        const { workspace_id } = req.params


        const channel = await channelRepository.create(
            {
                name,
                workspace_id,
                user_id: _id
            })

        return res.json({
            ok: true,
            message: 'Channel created successfully',
            status: 201,
            payload: {
                channel
            }
        })


    } catch (err) {
        console.log("An error ocurred when creating a channel", err);
        if (err.status) {
            return res.status(400).send({
                ok: false,
                status: err.status,
                message: err.message
            });
        }
        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
}

export const sendMessageToChannelController = async (req, res) => {
    try {
        const { channel_id } = req.params
        const user_id = req.user._id
        const { content } = req.body


        const new_message = await messageRepository.create({
            channel_id,
            user_id,
            content,
        })

        return res.json({
            ok: true,
            message: 'Message sent successfully',
            status: 201,
            payload: {
                new_message
            }

        })





    } catch (err) {
        console.log("An error ocurred when sending a message", err);
        if (err.status) {
            return res.status(400).send({
                ok: false,
                status: err.status,
                message: err.message
            });
        }
        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
}



export const getMessagesListFromChannelCrontroller = async (req, res) => {
    try {
        const { channel_id } = req.params
        const user_id = req.user._id
        
        const messages = await messageRepository.findMessagesFromChannel({channel_id, user_id})

        return res.json({
            ok:true,
            message: 'Messages list found successfully',
            status: 200,
            payload: {
                messages
            }
        })

    } catch (err) {
        console.log("An error ocurred when geting the messages from channel", err);
        if (err.status) {
            return res.status(400).send({
                ok: false,
                status: err.status,
                message: err.message
            });
        }
        return res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
}
