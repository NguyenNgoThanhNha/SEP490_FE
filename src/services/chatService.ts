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

interface AddManyMemberProps {
  channelId: string
  customerIds: string[]
}
const addManyMember = async ({ channelId, customerIds }: AddManyMemberProps): Promise<ResponseProps> => {
  return await post(`Hub/add-many-member?channelId=${channelId}`, customerIds)
}

interface GetCustomerInfoProps {
  userId: string
}

const getCustomerInfo = async ({ userId }: GetCustomerInfoProps): Promise<ResponseProps> => {
  return await get(`Hub/get-customer-info/${userId}`)
}

interface getUserChannelsProps {
  customerId: string
}

const getUserChannels = async ({ customerId }: getUserChannelsProps): Promise<ResponseProps> => {
  return await get(`Hub/user-channels/${ customerId }`)
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
  return await get(`Hub/channel-messages/${channelId}`)
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
  addManyMember
}
