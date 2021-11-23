import React, { useRef, useContext, useEffect, useState, memo } from "react";
import { NewMessageType, WebSocketContext } from "../../contexts/webSocketContext";
import { MessageList } from "./MessageList";
import { apiEndPoints, apiGetRequest } from "../../utils/api";
import "./index.css";

let updatedMessages: NewMessageType[] = [];

export const Chat = memo(() => {
	const bottomMessageRef = useRef<HTMLDivElement>(null);
	const { chatSocket, messages, onReceiveMessage } = useContext(WebSocketContext);
	const [message, setMessage] = useState("");

	useEffect(() => {
		chatSocket?.on("receiveMessage", (data: any) => {
			onReceiveMessage([...updatedMessages, data]);
			updatedMessages = [];
			handleScrollToEnd();
		});
		handleFetchAllMessages();
	}, []);

	const handleScrollToEnd = (smooth: boolean = true) => {
		bottomMessageRef?.current?.scrollIntoView({ behavior: smooth ? "smooth" : undefined });
	};

	const handleFetchAllMessages = async () => {
		const { data: responseData } = await apiGetRequest(apiEndPoints.messages.getAllMessages());
		onReceiveMessage(responseData?.data ?? []);
		handleScrollToEnd(false);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.currentTarget.value);
	};

	const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();
		// return if message doesn't contain any text.
		if (!message.trim()) return;
		// to find message id of last message sent by user.
		const { message_id } = [...messages].reverse().find(({ fromBot }) => !Boolean(fromBot)) ?? {};
		const { type } = messages[messages.length - 1] ?? {};
		chatSocket?.emit("sendMessage", { message, type, prevMessageId: message_id, fromBot: false }, (error: any, data: any) => {
			if (error) {
				console.error(data);
				alert("Something went wrong!");
			} else {
				// storing message copy in global variable, because updating state is an async task and by the time...
				// ... this state gets updated, we already are going to receive new message on above use effect from backend service.
				updatedMessages = [...messages, data];
				onReceiveMessage(updatedMessages);
				setMessage("");
				handleScrollToEnd();
			}
		});
	};

	return (
		<div className='chat-container'>
			<div className='messenger-title'>Messenger Bot</div>
			<MessageList bottomMessageRef={bottomMessageRef} />
			<form onSubmit={handleSubmit}>
				<label>
					Enter Message:
					<input
						className='message-input'
						type='text'
						value={message}
						placeholder='start typing...'
						onChange={handleChange}
					/>
				</label>
				<input type='submit' value='Send' className='send-btn' disabled={!Boolean(message.trim())} />
			</form>
		</div>
	);
});
