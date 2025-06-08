export type TSlotWorking  ={
  staffId: number,
  staffName: string,
  slots: [
    {
      status: unknown
      workDate: string,
      dayOfWeek: number,
      shiftId: number,
      shiftName: string,
      startTime: string,
      endTime: string,
    }
  ]
}
export type Event = {
  id: string
  title: string
  start: Date
  end: Date
  status: boolean
}
