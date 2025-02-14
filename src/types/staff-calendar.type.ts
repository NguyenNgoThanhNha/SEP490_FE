export type Appoinment = {
  id: string
  service: { name: string }
  orderDetail: {
    workDay: string
    time: string
    duration: number
    customerName: string
    note: string
    staff: string
  }
  status: boolean
}

export type Event = {
  id: string
  title: string
  start: Date
  end: Date
  status: boolean
}
