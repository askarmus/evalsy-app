import { Image } from "@heroui/react";
import { Divider } from "@heroui/divider";
import { ToastContainer } from "react-toastify";

interface Props {
  children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex-col flex items-center justify-center p-6">
        {children}
      </div>
      <ToastContainer />
    </div>
  );
};
