import { z } from "zod"

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "First name is required" })
      .max(50, { message: "First name must be less than 50 characters" }),
    last_name: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(50, { message: "Last name must be less than 50 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

/**
 * Product review form validation schema
 */
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating is required" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  comment: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(500, { message: "Comment must be less than 500 characters" }),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

/**
 * Checkout form validation schema
 */
export const checkoutSchema = z.object({
  shipping_address: z
    .string()
    .min(1, { message: "Shipping address is required" })
    .max(255, { message: "Address must be less than 255 characters" }),
  shipping_city: z
    .string()
    .min(1, { message: "City is required" })
    .max(100, { message: "City must be less than 100 characters" }),
  shipping_postal_code: z
    .string()
    .min(1, { message: "Postal code is required" })
    .max(20, { message: "Postal code must be less than 20 characters" }),
  shipping_country: z
    .string()
    .min(1, { message: "Country is required" })
    .max(100, { message: "Country must be less than 100 characters" }),
  payment_method: z
    .string()
    .min(1, { message: "Payment method is required" }),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  subject: z
    .string()
    .min(1, { message: "Subject is required" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
})

export type ContactFormValues = z.infer<typeof contactSchema>

/**
 * Profile update form validation schema
 */
export const profileUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
})

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>

/**
 * Password change form validation schema
 */
export const passwordChangeSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Current password is required" }),
    new_password: z
      .string()
      .min(1, { message: "New password is required" })
      .min(8, { message: "New password must be at least 8 characters" }),
    confirm_new_password: z
      .string()
      .min(1, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  })

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>

/**
 * Product search form validation schema
 */
export const searchSchema = z.object({
  query: z.string().optional(),
  category_id: z.number().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  sort_by: z.enum(["price", "name", "created_at"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
})

export type SearchFormValues = z.infer<typeof searchSchema> 
