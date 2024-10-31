import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { useMemo, useState } from 'react'
import { LuCheck, LuChevronsUpDown } from 'react-icons/lu'

import { Button } from '~/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { ScrollArea } from '~/components/ui/scroll-area'
import { cx } from '~/libs/utils'

type ComboboxOption = {
  label: string
  value: string
}

type ComboboxProps = {
  options: ComboboxOption[]
  selected?: ComboboxOption['value']
  onSelect?: (value: ComboboxOption['value']) => void
  defaultSelected?: ComboboxOption['value']
}

function ComboboxOriginal({ options, ...props }: ComboboxProps) {
  const [selected, onSelect] = useControllableState({
    prop: props.selected,
    onChange: props.onSelect,
    defaultProp: props.defaultSelected,
  })

  const [open, setOpen] = useState(false)

  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(
    () => comboboxFilter(options, search),
    [options, search],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role='combobox'
          variant='outline'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selected
            ? filteredOptions.find((option) => option.value === selected)?.label
            : 'Select option...'}
          <LuChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder='Search option...'
          />
          <CommandList className='p-1'>
            <ScrollArea className='h-72'>
              <CommandEmpty>
                No option found.
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onSelect(currentValue === selected ? '' : currentValue)
                      setOpen(false)
                      setSearch('')
                    }}
                  >
                    <LuCheck
                      className={cx(
                        'mr-2 size-4',
                        selected === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function comboboxFilter(options: ComboboxOption[], search: string) {
  return options.filter((option) => option.label.toLowerCase().includes(search.trim().toLowerCase()))
}

export { ComboboxOriginal }
export type { ComboboxOption, ComboboxProps }
