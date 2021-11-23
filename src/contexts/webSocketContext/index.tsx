import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";
import { WS_BASE_URL } from "../../utils/helpers/constants";

export enum MessageType {
	NAME = "name",
	DOB = "dob",
	DAYS_LEFT = "days_left",
	END = "end",
}

export type NewMessageType = {
	message: string;
	message_id: string;
	type: MessageType;
	fromBot: boolean;
	prevMessageId?: string;
};

type WebSocketContextProps = {
	chatSocket?: Socket;
	messages: NewMessageType[];
	onReceiveMessage: (messages: NewMessageType[]) => void;
};

type WebSocketProviderProps = {
	children: ReactNode;
};

export const WebSocketContext = createContext<WebSocketContextProps>({
	chatSocket: undefined,
	messages: [],
	onReceiveMessage: (messages: NewMessageType[]) => {},
});

export const WebSocketContextProvider = (props: WebSocketProviderProps) => {
	const { children } = props;
	const [messages, setMessages] = useState<NewMessageType[]>([]);

	const chatSocket = useMemo(() => io(WS_BASE_URL), []);

	const onReceiveMessage = (messages: NewMessageType[]) => {
		setMessages(messages);
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
