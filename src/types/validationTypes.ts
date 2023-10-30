import * as z from 'zod';

export const DevFormSchema = z.object({
  name: z.string().nonempty('Please specify an name'),
  email: z
    .string()
    .nonempty('Please specify an email')
    .email('Please specify a valid email'),
});

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty()
      .min(8, 'Password must be at least 8 characters long')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter',
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter',
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one digit',
      )
      .refine(
        (password) => /[\W_]/.test(password),
        'Password must contain at least one special character',
      ),
    confirmPassword: z
      .string()
      .nonempty()
      .min(8, 'Password must be at least 8 characters long')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter',
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter',
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one digit',
      )
      .refine(
        (password) => /[\W_]/.test(password),
        'Password must contain at least one special character',
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Please ensure passwords match',
    path: ['confirmPassword'],
  });
