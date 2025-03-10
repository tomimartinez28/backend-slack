import Channel, { CHANNEL_PROPS } from "../models/Channel.model.js"
import workspaceRepository from "./workspace.repository.js"
import { ServerError } from "../utils/errors.utils.js"
class ChannelRepository {

    async findeChannelById(id) {
        return Channel.findById(id).populate([CHANNEL_PROPS.WORKSPACE])
    }
    async create({ name, workspace_id, user_id }) {
        const found_workspace = await workspaceRepository.findWorkspaceById(workspace_id)
        if (!found_workspace) throw new ServerError('Workspace not found', 404)
        if (!found_workspace.members.includes(user_id)) throw new ServerError('You are not a member of this workspace', 403)
        const channel = await Channel.create({
            [CHANNEL_PROPS.NAME]: name,
            [CHANNEL_PROPS.WORKSPACE]: workspace_id,
            [CHANNEL_PROPS.CREATED_BY]: user_id
        })
        return channel
    }
}

const channelRepository = new ChannelRepository()
export default channelRepository