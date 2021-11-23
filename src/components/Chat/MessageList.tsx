import React, { memo, useContext } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";

export const MessageList = memo(() => {
	const { messages } = useContext(WebSocketContext);
	return (
		<div>
			{messages.map((message, index) => (
				<div key={index}>{message}</div>
			))}
		</div>
	);
});
