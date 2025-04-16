// app/hooks/useResumeSocket.ts
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type UploadProgress = {
  file: string;
  progress: number;
};

type UploadComplete = {
  file: string;
};

export const useResumeSocket = (onProgress: (data: UploadProgress) => void, onComplete: (data: UploadComplete) => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Connected to socket:", socketInstance.id);
    });

    socketInstance.on("upload-progress", (data: UploadProgress) => {
      onProgress(data);
    });

    socketInstance.on("upload-complete", (data: UploadComplete) => {
      onComplete(data);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [onProgress, onComplete]);

  const waitForConnection = (): Promise<string> => {
    return new Promise((resolve) => {
      if (socket?.connected && socket.id) resolve(socket.id);
      else socket?.on("connect", () => resolve(socket.id!));
    });
  };

  return { socket, waitForConnection };
};
