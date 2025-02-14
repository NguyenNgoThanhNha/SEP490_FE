import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/atoms/ui/form.tsx'
import { cn } from '@/utils/cn.ts'
import formatLabel from '@/utils/formatLabel.ts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/ui/select.tsx'

interface FormInputProps<T extends FieldValues> {
  classContent?: string
  name: Path<T>
  content: string[]
  form: UseFormReturn<T>
  trigger?: string
  enableOther?: boolean
}

const FormSelect = <T extends FieldValues>({
  classContent,
  name,
  content,
  form,
  trigger,
  enableOther = false
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn('relative', classContent)}>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={'peer'}>
                  <SelectValue placeholder={trigger} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {content.map((value, index) => (
                  <SelectItem value={value} key={index}>
                    {value}
                  </SelectItem>
                ))}
                {enableOther && <SelectItem value={'other'}>Other </SelectItem>}
              </SelectContent>
            </Select>

            <FormLabel
              className={cn(
                'absolute font-normal bg-white blur-10 w-fit px-2 -top-5 py-1 rounded left-3 peer-focus:font-semibold',
                'peer-focus:font-semibold',
                !field.value && 'peer-placeholder-shown:font-normal'
              )}
            >
              {formatLabel(name as string)}
            </FormLabel>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default FormSelect
