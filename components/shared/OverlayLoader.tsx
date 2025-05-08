import { Spinner } from "@heroui/react";
import { FC } from "react";

const OverlayLoader: FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <Spinner 
       size="lg"
        className="text-white"
        style={{ width: "50px", height: "50px" }} />
    </div>
  );
};

export default OverlayLoader;
