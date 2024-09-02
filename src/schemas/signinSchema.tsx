import { z } from "zod";

export const signInSchema = z.object({

	identifier: z.string(),   // email check
	password: z.string()      // password check 

})
