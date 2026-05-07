import { Socket, io } from "socket.io-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuth } from "@contexts/AuthProvider";
import type { WorkspaceResponse } from "@customTypes/workspace";
import { consumeClientRequestId } from "@utils/clientRequestTracker";
import {
  addWorkspaceToCache,
  removeWorkspaceFromCache,
  updateWorkspaceInCache,
} from "@utils/queryCache";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function useSocket() {
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    throw new Error("useSocket must be used within a SocketProvider.");
  }

  return socketContext;
}

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

function createSocketConnection() {
  return io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: true,
  });
}

export function SocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isLoggedIn, isCheckingToken } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || isCheckingToken) {
      return;
    }

    const newSocket = createSocketConnection();

    function handleConnection() {
      setSocket(newSocket);
      setIsConnected(true);
    }

    function handleDisconnection() {
      setIsConnected(false);
    }

    function handleConnectionError(error: unknown) {
      console.error("Socket connection error", error);
      setIsConnected(false);
    }

    function handleWorkspaceCreated(
      workspace: WorkspaceResponse,
      clientRequestId: string,
    ) {
      if (!consumeClientRequestId(clientRequestId)) {
        addWorkspaceToCache(workspace);
      }
    }

    function handleWorkspaceUpdated(
      workspaceId: number,
      workspaceTitle: string,
      clientRequestId: string,
    ) {
      if (!consumeClientRequestId(clientRequestId)) {
        updateWorkspaceInCache({ id: workspaceId, title: workspaceTitle });
      }
    }

    function handleWorkspaceDeleted(
      workspaceId: number,
      clientRequestId: string,
    ) {
      if (!consumeClientRequestId(clientRequestId)) {
        removeWorkspaceFromCache(workspaceId);
      }
    }

    newSocket.on("connect", handleConnection);
    newSocket.on("disconnect", handleDisconnection);
    newSocket.on("connect_error", handleConnectionError);
    newSocket.on("workspace:created", handleWorkspaceCreated);
    newSocket.on("workspace:updated", handleWorkspaceUpdated);
    newSocket.on("workspace:deleted", handleWorkspaceDeleted);

    newSocket.connect();

    return () => {
      newSocket.off("connect", handleConnection);
      newSocket.off("disconnect", handleDisconnection);
      newSocket.off("connect_error", handleConnectionError);
      newSocket.off("workspace:created", handleWorkspaceCreated);
      newSocket.off("workspace:updated", handleWorkspaceUpdated);
      newSocket.off("workspace:deleted", handleWorkspaceDeleted);

      newSocket.disconnect();

      setSocket(null);
      setIsConnected(false);
    };
  }, [isLoggedIn, isCheckingToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
