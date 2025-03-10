
import channelRepository from "./channel.repository.js"
import Message, { MESSAGE_PROPS } from "../models/Message.model.js"
import { ServerError } from "../utils/errors.utils.js"
import { USER_PROPS } from "../models/User.model.js"

class MessageRepository {
    

    async create({ channel_id, user_id, content }) {
        const found_channel = await channelRepository.findeChannelById(channel_id)
        if(!found_channel) throw new ServerError('Channel not found', 404)
        

        if(!found_channel.workspace.members.includes(user_id)) throw new ServerError('User is not member of this workspace', 403)

        const new_message = await Message.create({
            [MESSAGE_PROPS.CHANNEL_ID]: channel_id,
            [MESSAGE_PROPS.CONTENT]: content,
            [MESSAGE_PROPS.SENDER]: user_id,
        })
        return new_message
    }

    async findMessagesFromChannel({channel_id, user_id}) {
        const found_channel = await channelRepository.findeChannelById(channel_id)
        if(!found_channel) throw new ServerError('Channel not found', 404)
        if(!found_channel.workspace.members.includes(user_id)) throw new ServerError('User is not member', 403)
        
        const messages = await Message.find({channel_id: channel_id}).populate('sender', 'username email')
        
        return messages

    }
}


const messageRepository = new MessageRepository()


export default messageRepository
