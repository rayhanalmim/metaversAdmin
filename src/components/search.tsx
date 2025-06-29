import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function Search() {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  return (
    <div className="relative w-full md:w-[240px] lg:w-[280px]">
      <Input
        type='search'
        placeholder='Search...'
        className='pl-8 pr-4'
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none">
        <span className={cn(
          "hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex",
          isMac ? "text-xs" : "text-[10px] xl:text-xs"
        )}>
          {isMac ? '⌘' : 'Ctrl'} K
        </span>
      </kbd>
    </div>
  )
}
