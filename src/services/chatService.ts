import { get, post, ResponseProps } from './root'

interface ChatProps {
  message: string
}

const chatSend = async ({ message }: ChatProps): Promise<ResponseProps> => {
  return await post('BotChat/send', { message })
}

interface CreateHubProps {
  adminId: number
  channelName: string
  appointmentId: number
}

const createChannel = async ({ adminId, channelName, appointmentId }: CreateHubProps): Promise<ResponseProps> => {
  return await post('Hub/create-channel', { adminId, channelName, appointmentId })
}

interface CreateCustomerProps {
  userId: number
}

const createCustomer = async ({ userId }: CreateCustomerProps): Promise<ResponseProps> => {
  return await post('Hub/create-customer', { userId })
}

interface AddMemberProps {
  channelId: string
  customerId: string
}

const addMember = async ({ channelId, customerId }: AddMemberProps): Promise<ResponseProps> => {
  return await post('Hub/add-member', { channelId, customerId })
}

const addManyMember = async ({ channelId, customerIds }: { channelId: string; customerIds: string[] }): Promise<ResponseProps> => {
    return await post(`Hub/add-many-member?channelId=${channelId}`, customerIds);
  };

interface GetCustomerInfoProps {
  customerId: number
}

const getCustomerInfo = async ({ customerId }: GetCustomerInfoProps): Promise<ResponseProps> => {
  return await post('Hub/get-customer-info', { customerId })
}

interface getUserChannelsProps {
  customerId: string
}

const getUserChannels = async ({ customerId }: getUserChannelsProps): Promise<ResponseProps> => {
  return await post('Hub/channel-messages', { customerId })
}

interface getChannelProps {
  channelId: string
}

const getChannels = async ({ channelId }: getChannelProps): Promise<ResponseProps> => {
  return await post(`Hub/channel/${channelId}`)
}

interface getChannelMessageProps {
  channelId: string
}

const getMessageChannels = async ({ channelId }: getChannelMessageProps): Promise<ResponseProps> => {
  return await post(`Hub/channel-messages/${channelId}`)
}

const checkExistChannel = async (appointmentId: number): Promise<ResponseProps> => {
  return await get(`Hub/check-exist-channel?appointmentId=${appointmentId}`)
}
export default {
  chatSend,
  createChannel,
  createCustomer,
  addMember,
  getCustomerInfo,
  getUserChannels,
  getChannels,
  getMessageChannels,
  checkExistChannel,
  addManyMember,

}
