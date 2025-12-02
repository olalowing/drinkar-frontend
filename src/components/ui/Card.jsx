import { cn } from '../../lib/utils'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn('text-lg font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}
