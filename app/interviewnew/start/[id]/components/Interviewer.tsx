import { Avatar, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

const Interviewer: React.FC<any> = ({ data }) => {
  return (
    <Card className='py-4' shadow='sm'>
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
        <p className='text-tiny uppercase font-bold'>INTERVIEWER</p>
      </CardHeader>

      <CardHeader className='justify-between'>
        <div className='flex gap-5'>
          <Avatar isBordered radius='full' size='md' src={data?.photoUrl} />

          <div className='flex flex-col gap-1 items-start justify-center'>
            <h4 className='text-small font-semibold leading-none text-default-600'>{data?.name}</h4>
            <h5 className='text-small tracking-tight text-default-400'>{data?.jobTitle}</h5>
          </div>
        </div>
      </CardHeader>

      <CardBody className='px-3 py-0 text-small text-default-400'>
        <p>{data?.biography}</p>
      </CardBody>
    </Card>
  );
};

export default Interviewer;
