"use client"

import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/models/Users'
import React, { useState, useCallback, useEffect } from 'react'
import { Form, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import Messagecard from '@/components/Messagecard'
import { Separator } from '@radix-ui/react-separator'
import { Switch } from '@/components/ui/switch'

const dashboard = () => {

	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);

	const { toast } = useToast();

	const handleDeleteMessage = (messageId: string) => {

		setMessages(messages.filter((message) => message._id !== messageId))

	}

	const { data: session } = useSession();

	const form = useForm({
		resolver: zodResolver(acceptMessagesSchema)
	})

	const { setValue, register, watch } = form

	const acceptMessages = watch('acceptMessages')

	const fetchAcceptMessages = async () => {
		setIsSwitchLoading(true);

		try {

			const response = await axios.get('/api/accept-messages')

			console.log("response:",response)

			setValue('acceptMessages', response.data.isAcceptingMessage)

		} catch (error) {

			const axiosError = error as AxiosError<ApiResponse>;

			toast({
				title: 'Error',
				description: axiosError.response?.data.message ?? 'An error occurred. Please try again.',
				variant: 'destructive'
			})

		}
		finally {
			setIsSwitchLoading(false)
		}

	}

	const fetchMessages = useCallback(async (refresh: boolean = false) => {

		setIsLoading(true)
		setIsSwitchLoading(false)


		try {

			const response = await axios.get<ApiResponse>('/api/get-messages')
			console.log("Response:", response.data);
			setMessages(response.data.messages || []);

			if (refresh) {

				toast({
					title: 'Refreshed Messages',
					description: 'Messages refreshed already',
				})

			}
		 }
		catch (error) {

			const axiosError = error as AxiosError<ApiResponse>;

			toast({
				title: 'Error',
				description: axiosError.response?.data.message ?? 'An error occurred. Please try again.',
				variant: 'default'
			})

		}
		finally {
			setIsLoading(false)
			setIsSwitchLoading(false)
		}
	}, [setIsLoading, setMessages])

	useEffect(() => {

		if (!session?.user) {
			fetchMessages(),
			fetchAcceptMessages()
		}

	}, [session, setValue, fetchAcceptMessages, fetchMessages])

	// handle switch change

	const handleSwitchChange = async () => {
		try {
			const response = await axios.post<ApiResponse>('/api/accept-messages', {
				acceptMessages: !acceptMessages,
			});
			setValue('acceptMessages', !acceptMessages);
			toast({
				title: response.data.message,
				variant: 'default',
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: 'Error',
				description:
					axiosError.response?.data.message ??
					'Failed to update message settings',
				variant: 'destructive',
			});
		}
	};

	// Url generator for the anonymous user to write

	const username = session?.user?.username;

	const baseUrl = `${window.location.protocol}//${window.location.host}`

	const profileUrl = `${baseUrl}/u/${username}`

	// copy to clipboard feature

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(profileUrl);
		toast({
			title: 'Copied to clipboard',
		})
	}

	// if session is not there or the user is not authenticated, return please login

	if (!session?.user) {
		return <div>please login</div>
	}

	return (
		<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
			<h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

			<div className="mb-4">
				<h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
				<div className="flex items-center">
					<input
						type="text"
						value={profileUrl}
						disabled
						className="input input-bordered w-full p-2 mr-2"
					/>
					<Button onClick={copyToClipboard}>Copy</Button>
				</div>
			</div>

			<div className="mb-4">
				<Switch
					{...register('acceptMessages')}
					checked={acceptMessages}
					onCheckedChange={handleSwitchChange}
					disabled={isSwitchLoading}
				/>
				<span className="ml-2">
					Accept Messages: {acceptMessages ? 'On' : 'Off'}
				</span>
			</div>
			<Separator />

			<Button
				className="mt-4"
				variant="outline"
				onClick={(e) => {
					e.preventDefault();
					fetchMessages(true);
				}}
			>
				{isLoading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<RefreshCcw className="h-4 w-4" />
				)}
			</Button>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
				{messages.length > 0 ? (
					messages.map((message, index) => (
						<Messagecard
							key={message._id as any}
							message={message}
							onMessageDelete={handleDeleteMessage}
						/>
					))
				) : (
					<p>No messages to display.</p>
				)}
			</div>
		</div>
	);
}

export default dashboard
