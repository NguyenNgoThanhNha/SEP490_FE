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

interface CreateCustomerProps {
    userId: number,
}

const createCustomer = async ({userId}: CreateCustomerProps) :Promise<ResponseProps> => {
    return await post('Hub/create-customer', {userId});
}

interface AddMemberProps {
    channelId: string,
    customerId: string
}

const addMember = async ({channelId, customerId}: AddMemberProps) :Promise<ResponseProps> => {
    return await post('Hub/add-member', {channelId, customerId});
}

interface GetCustomerInfoProps {
    customerId: number
}

const getCustomerInfo = async ({customerId}: GetCustomerInfoProps) :Promise<ResponseProps> => {
    return await post('Hub/get-customer-info', {customerId});
}

interface getUserChannelsProps {
    customerId: string
}

const getUserChannels = async ({customerId}: getUserChannelsProps) :Promise<ResponseProps> => {
    return await post('Hub/channel-messages', {customerId});
}

interface getChannelProps {
    channelId: string
}

const getChannels = async ({channelId}: getChannelProps) :Promise<ResponseProps> => {
    return await post(`Hub/channel/${channelId}`);
}

interface getChannelMessageProps {
    channelId: string
}

const getMessageChannels = async ({channelId}: getChannelMessageProps) :Promise<ResponseProps> => {
    return await post(`Hub/channel-messages/${channelId}`);
}
export default {
    chatSend,
    createChannel,
    createCustomer,
    addMember,
    getCustomerInfo,
    getUserChannels,
    getChannels,
    getMessageChannels

}