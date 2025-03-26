import { post, ResponseProps } from "./root"

interface ChatProps {
    message: string
}

const chatSend = async({message}: ChatProps): Promise<ResponseProps> => {
    return await post('BotChat/send', {message});
}

interface CreateHubProps {
    adminId: number,
    channelName: string,
}

const createChannel = async({adminId, channelName}: CreateHubProps):Promise<ResponseProps> => {
    return await post('Hub/create-channel', {adminId, channelName});
}
export default {
    chatSend,
    createChannel
}