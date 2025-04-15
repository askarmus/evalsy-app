import { addToast } from "@heroui/react";

export const showToast = {
  success: (message: string) => {
    addToast({
      title: "Success",
      description: message,
      color: "success",
    });
  },
  error: (message: string) => {
    addToast({
      title: "Error",
      description: message,
      color: "danger",
    });
  },
  warning: (message: string) => {
    addToast({
      description: message,
      color: "warning",
    });
  },
};
