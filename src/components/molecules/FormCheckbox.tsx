import { Label } from '@/components/atoms/ui/label.tsx'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/atoms/ui/form.tsx'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { Checkbox } from '@/components/atoms/ui/checkbox.tsx'

interface FormInputProps<T extends FieldValues> {
  classContent?: string
  name: Path<T>
  content: string
  form: UseFormReturn<T>
}

const FormCheckbox = <T extends FieldValues>({ classContent, name, content, form }: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={classContent}>
          <FormControl>
            <div className='flex items-center space-x-2 w-full'>
              <Checkbox id={name} {...field} />
              <Label htmlFor={name} className={'font-light'}>
                {content}
              </Label>
            </div>
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormCheckbox
