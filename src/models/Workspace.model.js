import mongoose from "mongoose";



// Hago esto para reducir margen de error
export const WORKSPACE_PROPS = {
    _ID: '_id',
    NAME: 'name',
    OWNER: 'owner',
    MEMBERS : 'members',
    CREATED_AT: 'created_at',



}

const workspaceSchema = new mongoose.Schema(
    {
        [WORKSPACE_PROPS.NAME]: { type: String, required: true },
        [WORKSPACE_PROPS.OWNER]: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        [WORKSPACE_PROPS.MEMBERS]: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        [WORKSPACE_PROPS.CREATED_AT]: { type: Date, default: Date.now }
    }
)

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace

