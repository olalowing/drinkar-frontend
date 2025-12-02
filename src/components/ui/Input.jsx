import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(({ className, type = 'text', error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'w-full px-4 py-2 border rounded-lg outline-none transition-colors',
        error
          ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
