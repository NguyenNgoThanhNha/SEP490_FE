import { post, ResponseProps } from "./root"

interface ChatProps {
    message: string
}

const chatSend = async({message}: ChatProps): Promise<ResponseProps> => {
    return await post('BotChat/send', {message});
}

export default {
    chatSend
}