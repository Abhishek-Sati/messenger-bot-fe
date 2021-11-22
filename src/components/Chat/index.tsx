import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";

export const Chat = () => {
	const { chatSocket } = useContext(WebSocketContext);

	useEffect(() => {
		chatSocket?.on("receiveMessage", (data: any) => {
			console.log("new message receive : ", data);
		});
	}, []);

	return <div>chat</div>;
};
