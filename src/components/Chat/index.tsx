import React, { useContext, useEffect, useState, memo } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import { MessageList } from "./MessageList";

export const Chat = memo(() => {
	const { chatSocket, messages, onReceiveMessage } = useContext(WebSocketContext);
	const [message, setMessage] = useState("");

	useEffect(() => {
		chatSocket?.on("receiveMessage", (data: any) => {
			console.log("new message receive : ", data);
			onReceiveMessage(data);
		});
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.currentTarget.value);
	};

	const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();
		chatSocket?.emit("sendMessage", message, (error: any, data: any) => {
			if (error) {
				console.error(error);
				alert("Something went wrong!");
			} else {
				console.info("data : ", data);
				onReceiveMessage(data);
				setMessage("");
			}
		});
	};

	return (
		<div>
			<MessageList />
			<form onSubmit={handleSubmit}>
				<label>
					Enter Message:
					<input type='text' value={message} onChange={handleChange} />
				</label>
				<input type='submit' value='Submit' />
			</form>
		</div>
	);
});
