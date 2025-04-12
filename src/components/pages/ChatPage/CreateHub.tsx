import { useState } from 'react'

const CreateChannel = ({ onCreate }) => {
  const [channelName, setChannelName] = useState('')
  const [customerIds, setCustomerIds] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const customerIdsArray = customerIds.split(',').map(Number)
    onCreate(channelName, customerIdsArray)
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Channel Name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Customer IDs (comma-separated)"
        value={customerIds}
        onChange={(e) => setCustomerIds(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Channel
      </button>
    </form>
  )
}

export default CreateChannel
