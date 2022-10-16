import { z } from "zod";

export const UserName = z
  .string()
  .trim()
  .min(3, "Username is too short.")
  .max(50, "Why would you username be so long?");

export const UserPassword = z
  .string()
  .trim()
  .min(8, "Password must contain at least 8 characters.")
  .max(128, "Password is too long, do not exceed 128 characters.");

export const UserNameAndPassword = z.object({
  name: UserName,
  password: UserPassword,
});

export const PasswordNewPasswordRepeatNew = z
  .object({
    currentPassword: UserPassword,
    newPassword: UserPassword,
    newPasswordRepeat: UserPassword,
  })
  .refine((obj) => obj.newPassword === obj.newPasswordRepeat, {
    message: "Repeated password doesn't match the new password.",
    path: ["newPasswordRepeat"],
  });