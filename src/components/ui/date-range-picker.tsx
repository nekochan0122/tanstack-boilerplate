import { format } from 'date-fns'
import { useState } from 'react'
import { LuCalendar } from 'react-icons/lu'
import type { ComponentPropsWithRef } from 'react'
import type { DateRange } from 'react-day-picker'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cx } from '~/libs/utils'

function DateRangePicker({ className, ...props }: ComponentPropsWithRef<typeof Button>) {
  const [date, setDate] = useState<DateRange | undefined>()

  function formatDate() {
    if (!date?.from) return 'Pick a date'

    const from = format(date.from, 'LLL dd, y')
    if (!date.to) return from

    const to = format(date.to, 'LLL dd, y')
    return `${from} - ${to}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cx(
            'w-full justify-start gap-2 text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
          {...props}
        >
          <LuCalendar className='size-4' />
          <span>{formatDate()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='range'
          selected={date}
          onSelect={setDate}
          autoFocus
          defaultMonth={date?.from}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }
