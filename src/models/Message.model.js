import mongoose from 'mongoose'


export const MESSAGE_PROPS = {
    CHANNEL_ID: 'channel_id',
    SENDER: 'sender',
    CONTENT: 'content',
    CREATED_AT: 'created_at'
}
const messageSchema = new mongoose.Schema({
    [MESSAGE_PROPS.CHANNEL_ID]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },
    [MESSAGE_PROPS.SENDER]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    [MESSAGE_PROPS.CONTENT] : {
        type: String,
        required: true,
    },
    [MESSAGE_PROPS.CREATED_AT] : {
        type: Date,
        default: Date.now
    }

})

const Message = mongoose.model('Message', messageSchema)

export default Message