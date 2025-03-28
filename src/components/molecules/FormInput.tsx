import { useState } from 'react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/atoms/ui/form.tsx'
import { Input } from '@/components/atoms/ui/input.tsx'
import { Eye, EyeOff } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('relative', classContent)}>
          <FormControl>
            <div className='relative w-full'>
              <Input
                autoFocus={autoFocus}
                placeholder={placeholder}
                disabled={isDisable}
                {...form.register(name)}
                {...field}
                type={type === 'password' && showPassword ? 'text' : type}
                className={cn(
                  'peer w-full rounded-md borderpx-3 py-2 pr-10 placeholder-transparent focus:outline-none outline-none',
                  type === 'password' ? '' : null
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
              {type === 'password' && (
                <button
                  type='button'
                  className='absolute inset-y-0 right-3 flex items-center text-gray-500'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
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
