import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency values consistently across the application
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "$1.2M", "$500K", "$1,234")
 */
export function formatCurrency(
  value: number,
  options: {
    compact?: boolean // Use K/M notation for large numbers
    decimals?: number // Number of decimal places (default: 1 for compact, 0 for full)
    showCents?: boolean // Show cents for smaller values
  } = {}
): string {
  const { compact = true, decimals, showCents = false } = options

  if (compact && Math.abs(value) >= 1000000) {
    const millions = value / 1000000
    const decimalPlaces = decimals !== undefined ? decimals : 1
    return `$${millions.toFixed(decimalPlaces)}M`
  }

  if (compact && Math.abs(value) >= 1000) {
    const thousands = value / 1000
    const decimalPlaces = decimals !== undefined ? decimals : 0
    return `$${thousands.toFixed(decimalPlaces)}K`
  }

  // For smaller values, use standard formatting
  const decimalPlaces = showCents ? 2 : 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value)
}
