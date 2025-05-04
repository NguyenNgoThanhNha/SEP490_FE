"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Select, message } from "antd"
import { Button } from "@/components/atoms/ui/button"
import { Card, CardContent } from "@/components/atoms/ui/card"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import serviceService from "@/services/serviceService"
import staffService from "@/services/staffService"
import type { TService } from "@/types/serviceType"
import type { TStaff } from "@/types/staff.type"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { Calendar, Clock, Plus, Trash2, User } from "lucide-react"

const { Option } = Select

interface CreateServiceMoreProps {
  branchId: number
  onSubmit: (data: {
    userId: number
    branchId: number
    staffId: number[]
    serviceId: number[]
    appointmentsTime: string[]
    status: string
    notes: string
    feedback: string
    voucherId: number
  }) => void
}

const CreateServiceMore: React.FC<CreateServiceMoreProps> = ({ branchId, onSubmit }) => {
  const { t } = useTranslation()
  const [services, setServices] = useState<TService[]>([])
  const [staffs, setStaffs] = useState<Record<number, TStaff[]>>({})
  const [selectedServices, setSelectedServices] = useState<
    { serviceId: number; staffId?: number; appointmentTime: string }[]
  >([])
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD"))
  const [selectedTime, setSelectedTime] = useState<string>(dayjs().format("HH:mm"))
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!branchId) return

    setLoading(true)
    serviceService
      .getAllServiceForBranch({ branchId, page: 1, pageSize: 50 })
      .then((res) => {
        setServices(res.result?.data || [])
        setLoading(false)
      })
      .catch(() => {
        message.error(t("errorFetchingServices"))
        setLoading(false)
      })
  }, [branchId, t])

  useEffect(() => {
    const fetchStaffs = async () => {
      if (!branchId || !selectedDate || !selectedTime || selectedServices.length === 0) return

      setLoading(true)
      const baseDate = dayjs(`${selectedDate}T${selectedTime}`)
      let currentTime = baseDate

      const staffMap: Record<number, TStaff[]> = {}

      for (const s of selectedServices) {
        const service = services.find((sv) => sv.serviceId === s.serviceId)
        if (!service) continue

        try {
          const res = await staffService.getListStaffAvailable({
            branchId,
            serviceId: s.serviceId,
            workDate: currentTime.format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
            startTime: currentTime.format("HH:mm:ss"),
          })

          if (res.success && res.result?.data) {
            staffMap[s.serviceId] = res.result.data
            if (res.result.data.length === 0) {
              message.warning(t("noStaffForService", { serviceName: service.name }))
            }
          } else {
            staffMap[s.serviceId] = []
            message.error(t("errorFetchingStaff", { serviceName: service.name }))
          }

          if (service.duration) {
            const durationInMinutes = Number(service.duration)
            currentTime = currentTime.add(durationInMinutes + 7, "minute")
          }
        } catch {
          staffMap[s.serviceId] = []
          message.error(t("errorFetchingStaff", { serviceName: service.name }))
        }
      }

      setStaffs(staffMap)
      setLoading(false)
    }

    fetchStaffs()
  }, [branchId, selectedDate, selectedTime, selectedServices, services, t])

  const handleAddService = () => {
    if (selectedServices.length === 0) {
      setSelectedServices([{ serviceId: 0, staffId: undefined, appointmentTime: "" }])
    } else {
      setSelectedServices([...selectedServices, { serviceId: 0, staffId: undefined, appointmentTime: "" }])
    }
  }

  const handleRemoveService = (index: number) => {
    const updated = [...selectedServices]
    updated.splice(index, 1)
    setSelectedServices(updated)
  }

  const handleServiceChange = (value: number, index: number) => {
    const updated = [...selectedServices]
    updated[index].serviceId = value
    updated[index].staffId = undefined 
    setSelectedServices(updated)
  }

  const handleStaffChange = (value: number, index: number) => {
    const updated = [...selectedServices]
    updated[index].staffId = value
    setSelectedServices(updated)
  }

  const handleSubmit = () => {
    const isValid = selectedServices.every((s) => s.serviceId && s.staffId)

    if (!isValid) {
      message.error(t("pleaseSelectServiceAndStaff"))
      return
    }

    const payload = {
      userId: 0,
      branchId,
      staffId: selectedServices.map((s) => s.staffId || 0),
      serviceId: selectedServices.map((s) => s.serviceId),
      appointmentsTime: selectedServices.map((s, index) => {
        const service = services.find((sv) => sv.serviceId === s.serviceId)
        const duration = service?.duration || 0

        let appointmentTime = dayjs(`${selectedDate}T${selectedTime}`).local()

        if (index > 0) {
          appointmentTime = appointmentTime.add(Number(duration) * index, "minute")
        }

        return appointmentTime.format("YYYY-MM-DDTHH:mm:ss")
      }),
      status: "Pending",
      notes: "",
      feedback: "",
      voucherId: 0,
    }

    console.log("Payload gửi đi:", payload)
    onSubmit(payload)
  }

  const getServiceName = (serviceId: number) => {
    const service = services.find((s) => s.serviceId === serviceId)
    return service?.name || ""
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("date")}
          </Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("time")}
          </Label>
          <Input
            id="time"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{t("service")}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddService}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> {t("addService")}
          </Button>
        </div>

        {selectedServices.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-md">
            <p className="text-slate-500">{t("noServicesSelected")}</p>
            <Button type="button" variant="outline" size="sm" onClick={handleAddService} className="mt-2">
              <Plus className="h-4 w-4 mr-1" /> {t("addService")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedServices.map((service, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 bg-slate-50 flex justify-between items-center">
                    <h4 className="font-medium">
                      {t("service")} {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveService(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">{t("selectService")}</Label>
                      <Select
                        placeholder={t("selectService")}
                        value={service.serviceId || undefined}
                        onChange={(value) => handleServiceChange(value, index)}
                        style={{ width: "100%" }}
                        loading={loading}
                      >
                        {services.map((s) => (
                          <Option key={s.serviceId} value={s.serviceId}>
                            {s.name} {s.duration && `(${s.duration} ${t("minutes")})`}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {service.serviceId > 0 && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t("selectStaff")} {t("for")} {getServiceName(service.serviceId)}
                        </Label>
                        <Select
                          placeholder={t("selectStaff")}
                          value={service.staffId}
                          onChange={(value) => handleStaffChange(value, index)}
                          style={{ width: "100%" }}
                          loading={loading}
                          disabled={!staffs[service.serviceId] || staffs[service.serviceId].length === 0}
                        >
                          {staffs[service.serviceId]?.map((staff) => (
                            <Option key={staff.staffId} value={staff.staffId}>
                              {staff.staffInfo.fullName || staff.staffInfo.userName}
                            </Option>
                          ))}
                        </Select>
                        {staffs[service.serviceId]?.length === 0 && (
                          <p className="text-sm text-red-500">{t(" no_available_staff")}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={selectedServices.length === 0 || loading} className="w-full">
        {t("addServices")}
      </Button>
    </div>
  )
}

export default CreateServiceMore
