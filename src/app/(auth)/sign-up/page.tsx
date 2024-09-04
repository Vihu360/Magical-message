"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signupSchema';
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormField, FormControl, FormLabel, FormMessage, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';



const Page = () => {

	const [username, setUsername] = useState<string>('');
	const [usernameMessage, setUsernameMessage] = useState<string>('');
	const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const debounced = useDebounceCallback(setUsername, 300);
	const { toast } = useToast()
	const router = useRouter()


	//zod implementation

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),

		// deafult value of the form

		defaultValues: {
			username: '',
			email: '',
			password: '',
		}
	});

	useEffect(() => {

		const checkUsername = async () => {

			if (username) {
				setIsCheckingUsername(true);  // start loader
				setUsernameMessage("");

				try {

					const response = await axios.get(`/api/check-username-unique?username=${username}`)
					console.log(response)
					setUsernameMessage(response.data.message)

				} catch (error) {

					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');

				} finally {
					setIsCheckingUsername(false)
				}
			}
		}
		checkUsername();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

		setIsSubmitting(true);

		try {

			const response = await axios.post('/api/signup', data);  // data contains the body that we sharing to sever as a part of request

			console.log(data);

			console.log("response:", response)

			toast({
				title: "Success",
				description: response.data.message,
			})

			router.replace(`/verify/${data.username}`)
			setIsSubmitting(false);

		} catch (error) {

			console.log("Error during sign-up:", error)

			const axiosError = error as AxiosError<ApiResponse>;

			let errorMessage = axiosError.response?.data.message ?? ('There was a problem with your sign-up. Please try again.');

			toast({
				title: 'sign-up failed',
				description: errorMessage,
				variant: 'destructive',
			})

			setIsSubmitting(false);

		}
	}

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-800'>
			<div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure</p>
				</div>


				<Form {...form}>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

						{/*  username field  */}



						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="username"
											{...field}
											onChange={(e) => {
												field.onChange(e); // Update form state
												debounced(e.target.value); // Update the username state
											}}
										/>
									</FormControl>

									{/* Display loader when checking username */}
									{isCheckingUsername && <Loader2 className="w-4 h-4 animate-spin" />}

									{/* Display message only if username is not empty and a message exists */}
									{!isCheckingUsername && username && usernameMessage && (
										<p
											className={`text-sm ${usernameMessage === 'Username is available' ? 'text-green-500' : 'text-red-500'
												}`}
										>
											{usernameMessage}
										</p>
									)}

									<FormMessage />
								</FormItem>
							)}
						/>


						{/* // email field */}

						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email address" {...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>


						{/* // password field */}

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input placeholder="password" {...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type='submit' className='w-full' disabled={isSubmitting}>
							{
								isSubmitting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								): ('Sign Up')
							}
						</Button>

					</form>
				</Form>

				<div className="text-center mt-4">
					<p>
						Already a member?{' '}
						<Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
							Sign in
						</Link>
					</p>
				</div>


			</div>
		</div>
	)
}

export default Page
