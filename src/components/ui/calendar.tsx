// https://date-picker.luca-felix.com/

import { differenceInCalendarDays } from 'date-fns'
import { useState } from 'react'
import { DayPicker, labelNext, labelPrevious, useDayPicker } from 'react-day-picker'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import type { ComponentProps, Dispatch, SetStateAction } from 'react'
import type { CustomComponents, DayPickerProps } from 'react-day-picker'
import type { Except } from 'type-fest'

import { Button, buttonVariants } from '~/components/ui/button'
import { createContextFactory, cx } from '~/libs/utils'

type CalendarBaseProps = {
  /**
 * In the year view, the number of years to display at once.
 * @default 12
 */
  yearRange?: number
}

type CalendarProps = DayPickerProps & CalendarBaseProps

type NavView = 'days' | 'years'

type DisplayYears = { from: number; to: number }

type Context = {
  navView: NavView
  setNavView: Dispatch<SetStateAction<NavView>>
  displayYears: DisplayYears
  setDisplayYears: Dispatch<SetStateAction<DisplayYears>>
  dayPickerProps: Except<CalendarProps & CalendarBaseProps, 'className' | 'classNames'>
}

const [ContextProvider, useContext] = createContextFactory<Context>()

function Calendar({
  className,
  classNames,
  yearRange = 12,
  showOutsideDays = true,
  numberOfMonths,
  ...props
}: CalendarProps & CalendarBaseProps) {
  const [navView, setNavView] = useState<NavView>('days')
  const [displayYears, setDisplayYears] = useState<DisplayYears>(() => {
    const currentYear = new Date().getFullYear()
    return {
      from: currentYear - Math.floor(yearRange / 2 - 1),
      to: currentYear + Math.ceil(yearRange / 2),
    }
  })

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths

  const customContext: Context = {
    navView,
    setNavView,
    displayYears,
    setDisplayYears,
    dayPickerProps: {
      yearRange,
      showOutsideDays,
      numberOfMonths: columnsDisplayed,
      ...props,
    },
  }

  return (
    <ContextProvider value={customContext}>
      <DayPicker
        numberOfMonths={columnsDisplayed}
        showOutsideDays={showOutsideDays}
        className={cx('overflow-visible p-2', className)}
        style={{ width: 248.8 * (columnsDisplayed ?? 1) + 'px' }}
        classNames={{
          months: 'flex flex-col relative sm:flex-row',
          month_caption: 'flex justify-center h-7 mx-10 relative items-center pt-1',
          weekdays: 'flex flex-row',
          weekday: 'text-muted-foreground w-8 font-normal text-[0.8rem]',
          month: 'gap-y-4 overflow-x-hidden w-full',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium truncate',
          button_next: cx(
            buttonVariants({
              variant: 'outline',
              className: 'absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            }),
          ),
          button_previous: cx(
            buttonVariants({
              variant: 'outline',
              className: 'absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            }),
          ),
          // chevron: buttonVariants({
          //   variant: 'outline',
          //   className: 'absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          // }),
          nav: 'flex items-start',
          month_grid: 'mt-2 mb-0.5 mx-auto',
          week: 'flex w-full mt-2',
          day: 'p-0 size-8 text-sm flex-1 flex items-center justify-center has-[button]:hover:!bg-accent rounded-md has-[button]:hover:aria-selected:!bg-primary has-[button]:hover:text-accent-foreground has-[button]:hover:aria-selected:text-primary-foreground',
          day_button: cx(
            buttonVariants({ variant: 'ghost' }),
            'size-8 select-none p-0 font-normal hover:bg-transparent hover:text-inherit focus-visible:ring-offset-0 aria-selected:opacity-100',
          ),
          range_start: 'day-range-start rounded-s-md',
          range_end: 'day-range-end rounded-e-md',
          selected: 'bg-primary text-primary-foreground hover:!bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          today: 'bg-accent text-accent-foreground',
          outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          disabled: 'text-muted-foreground opacity-50',
          range_middle: 'aria-selected:bg-accent hover:aria-selected:!bg-accent rounded-none aria-selected:text-accent-foreground hover:aria-selected:text-accent-foreground',
          hidden: 'invisible',
          ...classNames,
        }}
        components={{
          Chevron,
          Nav,
          CaptionLabel,
          MonthGrid,
        }}
        {...props}
      />
    </ContextProvider>
  )
}

function Chevron({ orientation }: ComponentProps<CustomComponents['Chevron']>) {
  const Icon = orientation === 'left' ? LuChevronLeft : LuChevronRight
  return <Icon className='size-4' />
}

function Nav({ className }: ComponentProps<CustomComponents['Nav']>) {
  const { nextMonth, previousMonth, goToMonth } = useDayPicker()
  const { navView, displayYears, setDisplayYears, dayPickerProps } = useContext()

  const isPreviousDisabled = (() => {
    if (navView === 'years') {
      return (
        (dayPickerProps.startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            dayPickerProps.startMonth,
          ) < 0) ||
        (dayPickerProps.endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            dayPickerProps.endMonth,
          ) > 0)
      )
    }
    return !previousMonth
  })()

  const isNextDisabled = (() => {
    if (navView === 'years') {
      return (
        (dayPickerProps.startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            dayPickerProps.startMonth,
          ) < 0) ||
        (dayPickerProps.endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            dayPickerProps.endMonth,
          ) > 0)
      )
    }
    return !nextMonth
  })()

  const handlePreviousClick = () => {
    if (!previousMonth) return
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }))
      dayPickerProps.onPrevClick?.(
        new Date(
          displayYears.from - (displayYears.to - displayYears.from),
          0,
          1,
        ),
      )
      return
    }
    goToMonth(previousMonth)
    dayPickerProps.onPrevClick?.(previousMonth)
  }

  const handleNextClick = () => {
    if (!nextMonth) return
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }))
      dayPickerProps.onNextClick?.(
        new Date(
          displayYears.from + (displayYears.to - displayYears.from),
          0,
          1,
        ),
      )
      return
    }
    goToMonth(nextMonth)
    dayPickerProps.onNextClick?.(nextMonth)
  }

  return (
    <nav className={cx('flex items-center', className)}>
      <Button
        variant='outline'
        className='absolute left-0 size-7 bg-transparent p-0 opacity-80 hover:opacity-100'
        type='button'
        tabIndex={isPreviousDisabled ? undefined : -1}
        disabled={isPreviousDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the previous ${displayYears.to - displayYears.from + 1} years`
            : labelPrevious(previousMonth)
        }
        onClick={handlePreviousClick}
      >
        <LuChevronLeft className='size-4' />
      </Button>

      <Button
        variant='outline'
        className='absolute right-0 size-7 bg-transparent p-0 opacity-80 hover:opacity-100'
        type='button'
        tabIndex={isNextDisabled ? undefined : -1}
        disabled={isNextDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
            : labelNext(nextMonth)
        }
        onClick={handleNextClick}
      >
        <LuChevronRight className='size-4' />
      </Button>
    </nav>
  )
}

function CaptionLabel({ children }: ComponentProps<CustomComponents['CaptionLabel']>) {
  const { navView, setNavView, displayYears } = useContext()

  return (
    <Button
      size='sm'
      variant='ghost'
      onClick={() => setNavView((prev) => (prev === 'days' ? 'years' : 'days'))}
      className='h-7 w-full select-none truncate text-sm font-medium focus-visible:ring-offset-0'
    >
      {/* @ts-expect-error React 19 Support */}
      {navView === 'days' ? children : displayYears.from + ' - ' + displayYears.to}
    </Button>
  )
}

function MonthGrid({ className, children, ...props }: ComponentProps<CustomComponents['MonthGrid']>) {
  const { goToMonth } = useDayPicker()
  const { navView, setNavView, displayYears, dayPickerProps } = useContext()

  return navView === 'days' ? (
    <table className={className} {...props}>
      {/* @ts-expect-error React 19 Types Issue */}
      {children}
    </table>
  ) : (
    // @ts-expect-error React 19 Types Issue
    <div
      className={cx('grid grid-cols-4 gap-y-2', className)}
      {...props}
    >
      {Array.from(
        { length: displayYears.to - displayYears.from + 1 },
        (_, i) => {
          const isBefore =
              differenceInCalendarDays(
                new Date(displayYears.from + i, 12, 31),
                dayPickerProps.startMonth!,
              ) < 0

          const isAfter =
              differenceInCalendarDays(
                new Date(displayYears.from + i, 0, 0),
                dayPickerProps.endMonth!,
              ) > 0

          const isDisabled = isBefore || isAfter
          return (
            <Button
              key={i}
              className={cx(
                'h-7 w-full text-sm font-normal text-foreground',
                displayYears.from + i === new Date().getFullYear() &&
                    'bg-accent font-medium text-accent-foreground',
              )}
              variant='ghost'
              onClick={() => {
                setNavView('days')
                goToMonth(
                  new Date(
                    displayYears.from + i,
                    new Date().getMonth(),
                  ),
                )
              }}
              disabled={navView === 'years' ? isDisabled : undefined}
            >
              {displayYears.from + i}
            </Button>
          )
        },
      )}
    </div>
  )
}

export { Calendar }
export type { CalendarBaseProps, CalendarProps }
