import { cn } from '@/lib/utils'

// Decorative geometric band inspired by Wayuu weaving (kanás) patterns.
export function WayuuDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('h-3 w-full', className)}
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, var(--primary) 0 10px, transparent 10px 20px, var(--clay) 20px 30px, transparent 30px 40px)',
      }}
    />
  )
}

export function WayuuZigzag({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('h-6 w-full opacity-90', className)}
      style={{
        backgroundColor: 'var(--primary)',
        maskImage:
          'linear-gradient(135deg, #000 25%, transparent 25%), linear-gradient(225deg, #000 25%, transparent 25%)',
        maskSize: '24px 24px',
        WebkitMaskImage:
          'linear-gradient(135deg, #000 25%, transparent 25%), linear-gradient(225deg, #000 25%, transparent 25%)',
        WebkitMaskSize: '24px 24px',
      }}
    />
  )
}
