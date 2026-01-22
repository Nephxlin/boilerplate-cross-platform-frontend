'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormProps, type FieldValues, type Resolver } from 'react-hook-form'
import type { z } from 'zod'

export function useFormWithValidation<T extends FieldValues>(
  schema: z.ZodType<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
) {
  return useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as unknown as Resolver<T>,
    ...options,
  })
}
