import { addToast } from "@heroui/react";

export const showToast = {
  success: (message: string) => {
    addToast({
      description: message,
      color: "success",
    });
  },
  error: (message: string) => {
    addToast({
      description: message,
      color: "success",
    });
  },
};
