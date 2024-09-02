import mongoose from "mongoose";

type ConnectObject = {
	isConnected? : number
}

const connection: ConnectObject = {}

async function dbConnect(): Promise<void> {

	// Check if we have a connection to the database or if it's currently connecting

	if (connection.isConnected) {
		console.log('Already connected to the database');
		return;
	}


	try {

		// Attempt to connect to the database
		const db = await mongoose.connect(process.env.MONGO_URI ?? '')
		connection.isConnected = db.connections[0].readyState
		console.log("db connected successfully")

	}
	catch (error) {
		console.log("db connection failed", error)
		process.exit(1);
	}

}

export default dbConnect
