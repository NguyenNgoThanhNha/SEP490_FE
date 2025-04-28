import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/atoms/ui/form.tsx'
import formatLabel from '@/utils/formatLabel.ts'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/atoms/ui/calendar.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/ui/popover.tsx'
import { Button } from '@/components/atoms/ui/button.tsx'
import { cn } from '@/utils/cn.ts'
import { addDays, format, subDays } from 'date-fns'
import { useTranslation } from "react-i18next"; // Import hook i18next
import { enUS, vi } from "date-fns/locale"; // Import locale cho date-fns

interface FormInputProps<T extends FieldValues> {
  classContent?: string
  name: Path<T>
  form: UseFormReturn<T>
  addDay?: number
  subDay?: number
}

const FormDatePicker = <T extends FieldValues>({
  classContent,
  name,
  form,
  addDay = 365,
  subDay = 365
}: FormInputProps<T>) => {
  const { t, i18n } = useTranslation(); // Hook để sử dụng i18next

  // Lấy locale từ i18next
  const currentLocale = i18n.language === "vi" ? vi : enUS;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(" relative", classContent)}>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? format(field.value, "dd/MM/yyyy", { locale: currentLocale }) // Định dạng ngày theo locale
                    : <span>{t("pickADate")}</span>} {/* Sử dụng khóa dịch */}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <FormLabel className="absolute font-medium bg-white blur-10 w-fit px-2 -top-5 py-1 rounded left-3 peer-focus:font-semibold">
              {formatLabel(name as string)}
            </FormLabel>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                disabled={(date) =>
                  date > new Date(addDays(new Date(), addDay)) ||
                  date < new Date("2024-01-01") ||
                  date < new Date(subDays(new Date(), subDay))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDatePicker
