import Workspace, { WORKSPACE_PROPS } from "../models/Workspace.model.js"
import { ServerError } from "../utils/errors.utils.js"
class WorkspaceRepository {

    async findWorkspaceById(id) {
        return await Workspace.findById(id)
    }
    async createWorkspace({ name, owner_id }) {
        try {
            const workspace = await Workspace.create({
                [WORKSPACE_PROPS.NAME]: name,
                [WORKSPACE_PROPS.OWNER]: owner_id,
                [WORKSPACE_PROPS.MEMBERS]: [owner_id]
            })
            return workspace
        } catch (err) {
            console.log('Error when creating a workspace', err);

        }
    }

    async addNewMember({ workspace_id, owner_id, invited_id }) {
        const found_workspace = await this.findWorkspaceById(workspace_id)

        // que exista el workspace
        if(!found_workspace) throw new ServerError('Workspace not found', 404)
        console.log('USER FOUND: ', found_workspace);
        // que el dueño sea el que esta invitando
        if(!found_workspace.owner.equals(owner_id)) throw new ServerError('You are not allowed to invite to this workspace', 403)

        // que el invitado ya no este
        if(found_workspace.members.includes(invited_id))throw new ServerError('The user is already part of the workspace', 400)

        found_workspace.members.push(invited_id)
        await found_workspace.save()

        return found_workspace
    }

    async getWorkspacesByUserId(user_id) {
        
        return await Workspace.find({members: {$in: [user_id]}})
    }
}


const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository