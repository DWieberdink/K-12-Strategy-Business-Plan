import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

interface MultiSelectDropdownProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  title: string
}

export const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  title,
}: MultiSelectDropdownProps) => {
  const handleSelect = (option: string) => {
    if (!selected.includes(option)) {
      onChange([...selected, option])
    }
  }

  const handleDeselect = (option: string) => {
    onChange(selected.filter(item => item !== option))
  }

  const getButtonText = () => {
    if (selected.length === 0) return title
    if (selected.length === 1) return selected[0]
    if (selected.length === options.length) return "All"
    return `${selected.length} selected`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {getButtonText()}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) {
                handleSelect(option)
              } else {
                handleDeselect(option)
              }
            }}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 