import * as z from "zod";

export const UserSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be greater than or 8 characters"),
});

export const leaseSchema = z.object({
  leaseStartDate: z.string().min(1).or(z.date().min(new Date())),
  leaseEndDate: z.string().min(1).or(z.date().min(new Date())),
  monthlyRent: z.string().min(1).or(z.number().min(1)),
  securityDeposit: z.string().min(1).or(z.number().min(1)),
  additionalCharges: z.string().min(1).or(z.number().min(1)),
  annualRentIncreasePercentage: z.string().min(1).or(z.number().min(1)),
  leaseType: z.enum(["residential", "commercial"]),
  utilitiesIncluded: z.string().min(1).or(z.number().min(1)),
  maintenanceFees: z.string().min(1).or(z.number().min(1)),
  latePaymentPenalty: z.string().min(1).or(z.number().min(1)),
});
