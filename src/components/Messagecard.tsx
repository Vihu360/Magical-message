import React from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/Users'
import { useToast } from './ui/use-toast'
import axios from 'axios'

type messageCardProp = {
	message: Message
	onMessageDelete: (messageId: string) => void
}

const Messagecard = ({ message, onMessageDelete }: messageCardProp) => {

	const { toast } = useToast();

	const handleDeleteConfirm = async () => {

		const response = await axios.delete(`/api/delete-message/${message._id}`,)

		if (response.status === 200) {
			toast({
				title: 'Success',
				description: 'Message deleted successfully',
			})
			onMessageDelete(message._id as string)
		}


	}
	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>{message.content}</CardTitle>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive"><X className='w-5 h-5'/></Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your
									message and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardHeader>
			</Card>

		</div>
	)
}

export default Messagecard
