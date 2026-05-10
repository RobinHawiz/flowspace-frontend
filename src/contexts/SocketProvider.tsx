import { Socket, io } from "socket.io-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuth } from "@contexts/AuthProvider";
import type {
  WorkspaceMembersResponse,
  WorkspaceResponse,
} from "@customTypes/workspace";
import { consumeClientRequestId } from "@utils/clientRequestTracker";
import {
  addWorkspaceMemberToCache,
  addWorkspaceToCache,
  removeWorkspaceFromCache,
  removeWorkspaceMemberFromCache,
  updateWorkspaceInCache,
} from "@cache/queryCache";

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
      workspaceId: string,
      workspaceTitle: string,
      clientRequestId: string,
    ) {
      if (!consumeClientRequestId(clientRequestId)) {
        updateWorkspaceInCache({ id: workspaceId, title: workspaceTitle });
      }
    }

    function handleWorkspaceDeleted(
      workspaceId: string,
      clientRequestId: string,
    ) {
      if (!consumeClientRequestId(clientRequestId)) {
        removeWorkspaceFromCache(workspaceId);
      }
    }

    function handleWorkspaceMemberAdded(
      workspaceId: string,
      addedMember: WorkspaceMembersResponse,
      clientRequestId: string,
    ) {
      if (!consumeClientRequestId(clientRequestId)) {
        addWorkspaceMemberToCache(addedMember, workspaceId);
      }
    }

    function handleWorkspaceMembershipAdded(workspace: WorkspaceResponse) {
      addWorkspaceToCache(workspace);
    }

    function handleWorkspaceMemberRemoved(
      workspaceId: string,
      removedMemberId: string,
      clientRequestId: string,
    ) {
      if (!consumeClientRequestId(clientRequestId)) {
        removeWorkspaceMemberFromCache(workspaceId, removedMemberId);
      }
    }

    function handleWorkspaceMembershipRemoved(workspaceId: string) {
      removeWorkspaceFromCache(workspaceId);
    }

    newSocket.on("connect", handleConnection);
    newSocket.on("disconnect", handleDisconnection);
    newSocket.on("connect_error", handleConnectionError);
    newSocket.on("workspace:created", handleWorkspaceCreated);
    newSocket.on("workspace:updated", handleWorkspaceUpdated);
    newSocket.on("workspace:deleted", handleWorkspaceDeleted);
    newSocket.on("workspace:memberAdded", handleWorkspaceMemberAdded);
    newSocket.on("workspace:membershipAdded", handleWorkspaceMembershipAdded);
    newSocket.on("workspace:memberRemoved", handleWorkspaceMemberRemoved);
    newSocket.on(
      "workspace:membershipRemoved",
      handleWorkspaceMembershipRemoved,
    );

    newSocket.connect();

    return () => {
      newSocket.off("connect", handleConnection);
      newSocket.off("disconnect", handleDisconnection);
      newSocket.off("connect_error", handleConnectionError);
      newSocket.off("workspace:created", handleWorkspaceCreated);
      newSocket.off("workspace:updated", handleWorkspaceUpdated);
      newSocket.off("workspace:deleted", handleWorkspaceDeleted);
      newSocket.off("workspace:memberAdded", handleWorkspaceMemberAdded);
      newSocket.off(
        "workspace:membershipAdded",
        handleWorkspaceMembershipAdded,
      );
      newSocket.off("workspace:memberRemoved", handleWorkspaceMemberRemoved);
      newSocket.off(
        "workspace:membershipRemoved",
        handleWorkspaceMembershipRemoved,
      );

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
