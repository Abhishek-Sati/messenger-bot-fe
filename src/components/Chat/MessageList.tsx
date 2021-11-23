import React, { memo, useContext } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";

export const MessageList = memo(() => {
	const { messages } = useContext(WebSocketContext);

	const renderMessageList = () => {
		return messages.map(({ message, fromBot }, index) => (
			<div className={fromBot ? "bot-message" : "user-message"} key={index}>
				{message}
			</div>
		));
	};

	const renderEmptyListMessage = () => <p>No Previous Message Found. Start chat...</p>;

	return <div className='message-list-container'>{messages.length ? renderMessageList() : renderEmptyListMessage()}</div>;
});
