import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { type ErrorResponse } from "../types/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as SGD currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string, formatString: string = 'PPP'): string {
  try {
    const date = parseISO(dateString)
    return format(date, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Handle API errors and display toast notifications
 */
export function handleApiError(error: unknown): void {
  console.error('API Error:', error)
  
  if (typeof error === 'object' && error !== null) {
    // Handle structured API error responses
    const errorResponse = error as ErrorResponse
    if (errorResponse.message) {
      toast.error(errorResponse.message)
      return
    }
    
    // Handle validation errors
    if (errorResponse.errors) {
      const firstError = Object.values(errorResponse.errors)[0]?.[0]
      if (firstError) {
        toast.error(firstError)
        return
      }
    }
  }
  
  // Default error message
  toast.error('An unexpected error occurred. Please try again.')
}

/**
 * Generate a random string (useful for keys, IDs, etc.)
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return ''
  
  const names = name.split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(later, wait)
  }
}
