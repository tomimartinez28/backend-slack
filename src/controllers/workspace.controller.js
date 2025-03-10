import workspaceRepository from "../repositories/workspace.repository.js"

export const createWorkspaceController = async (req, res) => {
    try {
        const { name } = req.body
        const { _id } = req.user
        const workspace = await workspaceRepository.createWorkspace({ name, owner_id: _id })



        res.json({
            ok: true,
            status: 201,
            message: 'Workspace created successfully',
            payload: workspace
        })
    } catch (error) {
        console.log("An error ocurred when creating a workspace", error);
        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }
        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
}


export const inviteUserToWorkspaceController = async (req, res) => {
    try {
        const owner_id = req.user._id
        const { invited_id, workspace_id } = req.params
        const found_workspace = await workspaceRepository.addNewMember({
            owner_id,
            workspace_id,
            invited_id
        })





        res.json({
            ok: true,
            status: 201,
            message: 'User invited successfully',
            payload: {
                workspace: found_workspace
            }
        })
    } catch (error) {
        console.log("An error ocurred when inviting a user", error);
        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }
        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
}


export const getWorkspacesController = async (req, res) => {
    try {
        const  user_id  = req.user._id
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id)

        return res.json({
            ok: true,
            message:'Workspaces got successfully',
            status: 200,
            payload: {
                workspaces
            }

        })




    } catch (error) {
        console.log("An error ocurred when getiing the workspaces", error);
        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }
        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
}
