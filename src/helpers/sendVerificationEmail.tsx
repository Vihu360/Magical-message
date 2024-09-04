import { resend } from '@/lib/resend';
import VerificationEmail from '../../Emails/verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

// Verification email
export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {

		const emailContent = VerificationEmail({ username, otp: verifyCode });

		console.log("email to be sent on:", email);

		await resend.emails.send({
			from: 'send@vivekbarnwal.cloud',
			to: email,
			subject: 'Mystery Message Verification Code',
			react: emailContent,
		});

		return { success: true, message: 'Verification email sent successfully.' };
	} catch (emailError) {
		console.error('Error sending verification email:', emailError);
		return { success: false, message: 'Failed to send verification email.' };
	}
}
