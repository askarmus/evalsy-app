import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReport from "./PDFReport";

const DownloadPDFButton = ({ interviewerData }: { interviewerData: any }) => {
  return (
    <PDFDownloadLink document={<PDFReport interviewerData={interviewerData} />} fileName='interviewer_result.pdf'>
      {({ loading }) => (loading ? <button className='px-4 py-2 bg-gray-400 text-white rounded'>Generating PDF...</button> : <button className='px-4 py-2 bg-blue-500 text-white rounded'>Download PDF</button>)}
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton;
