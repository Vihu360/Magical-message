import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, "user name must be atleast 2 characters")
	.max(20)
	.regex(/^[a-z0-9]+$/, "Username must not contain any special characters");

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.string().email({ message: 'invalid email id' }),
	password: z.string().min(6, {message: "password must be atleast 6 characters"})
})
