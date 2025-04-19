import { Avatar } from "@heroui/react";
import React from "react";

const Interviewer: React.FC<any> = ({ data }) => {
  return (
    <div className='space-y-3'>
      <h3 className='font-medium text-sm'>REVIEWER </h3>
      <div className='flex items-center gap-3'>
        <Avatar isBordered radius='full' size='md' src={data?.photoUrl} />
        <div>
          <p className='font-medium'>{data?.name}</p>
          <p className='text-sm text-muted-foreground'>Senior Developer • BCS Technology</p>
          <p className='text-sm text-muted-foreground'>Bio: {data?.biography}</p>
        </div>
      </div>
    </div>
  );
};

export default Interviewer;
