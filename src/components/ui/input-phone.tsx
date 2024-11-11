// https://shadcn-phone-input.vercel.app/

// FIXME: getVirtualItems() always returns an empty array with React Compiler, 'use no memo' is a temporary solution
'use no memo'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useState } from 'react'
import { LuChevronsUpDown } from 'react-icons/lu'
import * as PhoneInputPrimitive from 'react-phone-number-input'
import type { Virtualizer } from '@tanstack/react-virtual'
import type { ComponentProps, PropsWithChildren } from 'react'
import type { Except, Simplify } from 'type-fest'

import { Button } from '~/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '~/components/ui/drawer'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { ScrollAreaRoot, ScrollBar, ScrollCorner, ScrollViewport } from '~/components/ui/scroll-area'
import { TwemojiFlag } from '~/components/ui/twemoji'
import { useDynamicNode } from '~/hooks/use-dynamic-node'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { createContextFactory, cx } from '~/libs/utils'

type InputPhoneProps = Simplify<
  Except<
    ComponentProps<'input'>,
    'ref' | 'onChange' | 'value'
  > &
  Except<
    PhoneInputPrimitive.Props<typeof PhoneInputPrimitive.default>, 'onChange'
  > & {
    onChange?: (value: PhoneInputPrimitive.Value) => void
  }
>

function InputPhone({ onChange, className, ...props }: InputPhoneProps) {
  return (
    <PhoneInputPrimitive.default
      flagComponent={FlagComponent}
      inputComponent={InputComponent}
      countrySelectComponent={CountrySelect}
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input might trigger the onChange event as undefined
       * when a valid phone number is not entered.
       *
       * To prevent this, the value is coerced to an empty string.
       *
       * @param {E164Number | undefined} value - The entered value
       */
      onChange={(value) => onChange?.(value || '' as PhoneInputPrimitive.Value)}
      className={cx('flex', className)}
      {...props}
    />
  )
}

function InputComponent({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cx('rounded-e-lg rounded-s-none', className)}
      {...props}
    />
  )
}

type CountrySelectOption = { label: string; value: PhoneInputPrimitive.Country }

type CountrySelectProps = {
  disabled?: boolean
  value: PhoneInputPrimitive.Country
  options: CountrySelectOption[]
  onChange: (value: PhoneInputPrimitive.Country) => void
}

type CountrySelectContext = {
  value: PhoneInputPrimitive.Country
  onChange: (value: PhoneInputPrimitive.Country) => void
  open: boolean
  setOpen: (value: boolean) => void
  search: string
  setSearch: (value: string) => void
  countries: CountrySelectOption[]
  parentNodeRef: (node: HTMLDivElement) => void
  virtualizer: Virtualizer<HTMLDivElement, Element>
}

const [ContextProvider, useContext] = createContextFactory<CountrySelectContext>()

function CountrySelect({ disabled, value, options, onChange }: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const countries = options
    .filter((item) => item.value !== undefined)
    .filter((item) =>
      item.label.toLowerCase().includes(search.trim().toLowerCase()) ||
      PhoneInputPrimitive.getCountryCallingCode(item.value).includes(search),
    )

  const [parentNode, parentNodeRef] = useDynamicNode()

  const virtualizer = useVirtualizer({
    count: countries.length,
    getScrollElement: () => parentNode,
    estimateSize: () => 32,
  })

  const isMobile = useIsMobile()

  const DynamicView = isMobile ? MobileView : DesktopView

  const context: CountrySelectContext = {
    value,
    onChange,
    open,
    setOpen,
    search,
    setSearch,
    countries,
    parentNodeRef,
    virtualizer,
  }

  return (
    <ContextProvider value={context}>
      <DynamicView>
        <Button
          role='combobox'
          variant='outline'
          className={cx('flex gap-1 rounded-e-none rounded-s-lg px-3')}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <LuChevronsUpDown
            className={cx(
              '-mr-2 size-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100',
            )}
          />
        </Button>
      </DynamicView>
    </ContextProvider>
  )
}

function DesktopView({ children }: PropsWithChildren) {
  const context = useContext()

  return (
    <Popover open={context.open} onOpenChange={context.setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <CountrySelectCommand />
      </PopoverContent>
    </Popover>
  )
}

function MobileView({ children }: PropsWithChildren) {
  const context = useContext()

  return (
    <Drawer open={context.open} onOpenChange={context.setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className='sr-only' />
        <div className='mt-4 border-t'>
          <CountrySelectCommand />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function CountrySelectCommand() {
  const context = useContext()

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder='Search country...'
        value={context.search}
        onValueChange={context.setSearch}
      />
      <CommandList>
        <ScrollAreaRoot className='h-72'>
          <ScrollViewport ref={context.parentNodeRef}>
            <div
              style={{
                height: context.virtualizer.getTotalSize(),
                width: '100%',
                position: 'relative',
              }}
            >
              <CommandEmpty
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
              >
                No country found.
              </CommandEmpty>
              <CommandGroup>
                {context.virtualizer.getVirtualItems().map((virtualItem) => {
                  const country = context.countries[virtualItem.index]

                  return (
                    <CommandItem
                      key={virtualItem.key}
                      onSelect={() => {
                        context.onChange(country.value)
                        context.setSearch('')
                        context.setOpen(false)
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className={cx('gap-2', country.value === context.value && 'bg-accent/50')}
                    >
                      <FlagComponent
                        country={country.value}
                        countryName={country.label}
                      />
                      <span className='flex-1 text-sm'>
                        {country.label}
                      </span>
                      <span className='text-sm text-foreground/50'>
                        {`+${PhoneInputPrimitive.getCountryCallingCode(country.value)}`}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </div>
          </ScrollViewport>
          <ScrollBar />
          <ScrollCorner />
        </ScrollAreaRoot>
      </CommandList>
    </Command>
  )
}

function FlagComponent({ country, countryName }: PhoneInputPrimitive.FlagProps) {
  return (
    <span className='h-5 w-6 overflow-hidden rounded-sm'>
      {country
        ? <TwemojiFlag countryCode={country} alt={countryName} className='size-full' />
        : <span className='inline-block size-full bg-foreground/20' />
      }
    </span>
  )
}

export { InputPhone }
