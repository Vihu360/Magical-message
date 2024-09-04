"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormField, FormControl, FormLabel, FormMessage, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// need a router
// take username from params
// use the toast

const verifyAccount = () => {

	const router = useRouter();
	const param = useParams<{ username: string }>()
	const {toast} = useToast();

	const [isSubmitting, setIsSubmitting] = useState(false);


	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	})

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {

		setIsSubmitting(true);

			try {
				const response = await axios.post('/api/verify-code', {
					username: param.username,
					code: data.code
				});

				toast({
					title: 'Success',
					description: response.data.message,
					variant: 'default',
				});

				router.replace('/dashboard')
			} catch (error) {

				const axiosError = error as AxiosError<ApiResponse>;

				toast({
					title: 'Verification Failed',
					description:
						axiosError.response?.data.message ??
						'An error occurred. Please try again.',
					variant: 'destructive',
				});
		}
		finally {
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
						<FormField
							name="code"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>
										<Input placeholder="code" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full' disabled={isSubmitting}>
							{
								isSubmitting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : ('Submit')
							}
						</Button>
					</form>
				</Form>





			</div>




		</div>
	)
}

export default verifyAccount
