import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

const VideoCard: React.FC = () => {
  return (
    <Card className="py-4" shadow="sm">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Video</p>
      </CardHeader>
      <CardBody>
        <div className="w-full aspect-video bg-black rounded-lg"></div>
      </CardBody>
    </Card>
  );
};

export default VideoCard;
