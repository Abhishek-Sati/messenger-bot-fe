import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";
import { WS_BASE_URL } from "../../utils/helpers/constants";

type WebSocketContextProps = {
	chatSocket?: Socket;
	messages: any[];
	onReceiveMessage: (newMessage: any) => void;
};

type WebSocketProviderProps = {
	children: ReactNode;
};

export const WebSocketContext = createContext<WebSocketContextProps>({
	chatSocket: undefined,
	messages: [],
	onReceiveMessage: (newMessage: any) => {},
});

export const WebSocketContextProvider = (props: WebSocketProviderProps) => {
	const { children } = props;
	const [messages, setMessages] = useState<any[]>([]);

	const chatSocket = useMemo(() => io(WS_BASE_URL), []);

	const onReceiveMessage = (newMessage: any) => {
		console.log(messages, newMessage);
		setMessages([...messages, newMessage]);
	};

	useEffect(() => {
		chatSocket.on("connection", (data) => {
			console.log("connected to backend service", data);
		});

		return () => {
			chatSocket.disconnect();
		};
	}, []);

	return <WebSocketContext.Provider value={{ chatSocket, messages, onReceiveMessage }}>{children}</WebSocketContext.Provider>;
};
