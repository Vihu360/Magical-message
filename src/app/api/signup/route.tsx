import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Users";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { email, username, password } = await request.json();

		// Checking if username already exists
		const existingVerifiedUserByUsername = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUserByUsername) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Username already exists",
				}),
				{ status: 400 }
			);
		}

		// Checking if email already exists
		const existingVerifiedUserByEmail = await UserModel.findOne({ email });
		let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (existingVerifiedUserByEmail) {
			if (existingVerifiedUserByEmail.isVerified) {
				return new Response(
					JSON.stringify({
						success: false,
						message: "User already exists with this email",
					}),
					{ status: 400 }
				);
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				existingVerifiedUserByEmail.password = hashedPassword;
				existingVerifiedUserByEmail.verifyCode = verifyCode;
				existingVerifiedUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
				await existingVerifiedUserByEmail.save();
			}
		} else {
			// Create new user
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);

			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerified: false,
				isAcceptingMessage: true,
				messages: [],
			});

			await newUser.save();
		}

		// Send verification email
		const emailResponse = await sendVerificationEmail(email, username, verifyCode);

		console.log("email response: ",emailResponse)

		if (!emailResponse.success) {
			return new Response(
				JSON.stringify({
					success: false,
					message: emailResponse.message,
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "Email registered successfully. Please verify the Email",
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error registering user:", error);

		return new Response(
			JSON.stringify({
				success: false,
				message: "Error registering user",
			}),
			{ status: 500 }
		);
	}
}
