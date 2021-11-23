import React, { useContext, useEffect, useState, memo } from "react";
import { MessageType, NewMessageType, WebSocketContext } from "../../contexts/webSocketContext";
import { MessageList } from "./MessageList";

let updatedMessages: NewMessageType[] = [];

export const Chat = memo(() => {
	const { chatSocket, messages, onReceiveMessage } = useContext(WebSocketContext);
	const [message, setMessage] = useState("");

	useEffect(() => {
		chatSocket?.on("receiveMessage", (data: any) => {
			onReceiveMessage([...updatedMessages, data]);
			updatedMessages = [];
		});
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.currentTarget.value);
	};

	const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();
		// to find message id of last message sent by user.
		const { message_id, message: prevMessage } = [...messages].reverse().find(({ fromBot }) => !Boolean(fromBot)) ?? {};
		const { type } = messages[messages.length - 1] ?? {};
		console.log(type, message_id, prevMessage);
		chatSocket?.emit("sendMessage", { message, type, prevMessageId: message_id, fromBot: false }, (error: any, data: any) => {
			if (error) {
				console.error(data);
				alert("Something went wrong!");
			} else {
				// storing message copy in global variable, because updating state is an async task and by the time...
				// ... this state gets updated, we already are going to receive new message on above use effect from backend service.
				updatedMessages = [...messages, data];
				console.info("data : ", messages, updatedMessages);
				onReceiveMessage(updatedMessages);
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
