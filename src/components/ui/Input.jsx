import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(({ className, type = 'text', label, error, ...props }, ref) => {
  const input = (
    <input
      type={type}
      className={cn(
        'w-full px-4 py-2 bg-white border text-gray-900 rounded-lg outline-none transition-colors placeholder-gray-400',
        error
          ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        className
      )}
      ref={ref}
      {...props}
    />
  )

  if (label) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {input}
      </div>
    )
  }

  return input
})

Input.displayName = 'Input'

export default Input
