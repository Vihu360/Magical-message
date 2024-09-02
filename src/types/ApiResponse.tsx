import { Message } from "@/models/Users";

export interface ApiResponse{
	success: boolean,
	message: string,
	isAcceptingMessage?: boolean,
	messages? : Array<Message>

}
