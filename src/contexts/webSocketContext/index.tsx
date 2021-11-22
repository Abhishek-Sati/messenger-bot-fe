import { createContext, ReactNode, useEffect, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { WS_BASE_URL } from "../../utils/helpers/constants";

type WebSocketContextProps = {
	chatSocket?: Socket;
};

type WebSocketProviderProps = {
	children: ReactNode;
};

export const WebSocketContext = createContext<WebSocketContextProps>({ chatSocket: undefined });

export const WebSocketContextProvider = (props: WebSocketProviderProps) => {
	const { children } = props;

	const chatSocket = useMemo(() => io(WS_BASE_URL), []);

	useEffect(() => {
		chatSocket.on("connection", () => {
			console.log("connected to backend service");
		});

		return () => {
			chatSocket.disconnect();
		};
	}, []);

	return <WebSocketContext.Provider value={{ chatSocket }}>{children}</WebSocketContext.Provider>;
};
