import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/atoms/ui/form.tsx'
import { Input } from '@/components/atoms/ui/input.tsx'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { cn } from '@/utils/cn.ts'
import formatLabel from '@/utils/formatLabel.ts'

interface FormInputProps<T extends FieldValues> {
  classContent?: string
  name: Path<T>
  type?: 'text' | 'number' | 'checkbox' | 'password' | 'file'
  placeholder?: string
  form: UseFormReturn<T>
  autoFocus?: boolean
  isDisable?: boolean
}

const FormInput = <T extends FieldValues>({
  classContent,
  name,
  type = 'text',
  placeholder,
  form,
  autoFocus = false,
  isDisable
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('relative', classContent)}>
          <FormControl>
            <Input
              autoFocus={autoFocus}
              placeholder={placeholder}
              disabled={isDisable}
              {...form.register(name)}
              {...field}
              type={type}
              className={cn(
                'peer w-full rounded-md border border-gray-300 px-3 py-2 placeholder-transparent focus:outline-none outline-none',
                type === 'password' ? 'tracking-[0.2rem] text-[lg]' : null
              )}
              onChange={(e) => {
                const value = e.target.value
                if (type === 'number') {
                  if (!isNaN(Number(value)) || value === '') {
                    field.onChange(value)
                  }
                } else {
                  field.onChange(value)
                }
              }}
            />
          </FormControl>
          <FormLabel className='absolute font-normal bg-white blur-10 w-fit px-2 -top-5 py-1 rounded left-3 peer-focus:font-semibold'>
            {formatLabel(name as string)}
          </FormLabel>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormInput
