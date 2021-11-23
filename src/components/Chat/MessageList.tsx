import { memo, useContext } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";

type PropsFromParent = {
	bottomMessageRef: any;
};

export const MessageList = memo((props: PropsFromParent) => {
	const { bottomMessageRef } = props;
	const { messages } = useContext(WebSocketContext);

	const renderMessageList = () => {
		return messages.map(({ message, fromBot }, index) => (
			<div className={fromBot ? "bot-message" : "user-message"} key={index}>
				{message}
			</div>
		));
	};

	const renderEmptyListMessage = () => <p className="empty-list-text" >No Previous Message Found. Start chat...</p>;

	return (
		<div className='message-list-container'>
			{messages.length ? renderMessageList() : renderEmptyListMessage()}
			<div ref={bottomMessageRef} />
		</div>
	);
});
