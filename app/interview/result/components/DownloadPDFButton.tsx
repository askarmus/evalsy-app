"use client";

import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import PDFReport from "./PDFReport";
import { Button, Input } from "@heroui/react";
import { AiOutlineDownload, AiOutlineSend } from "react-icons/ai";
import { sendResultEmail } from "@/services/interview.service";
import { showToast } from "@/app/utils/toastUtils";

const DownloadAndEmailPDF = ({ interviewerData }: { interviewerData: any }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSendEamil, setIsSendEamil] = useState(false);
  const [sending, setSending] = useState(false);
  const interviewResultId = interviewerData?.id; // Unique interview ID

  const uniqueId = Date.now();
  const fileName = `${interviewerData.name}-${interviewerData.jobTitle}-${uniqueId}.pdf`.replace(/ /g, "_");

  // 🔍 **Check if PDF already exists in the database**
  useEffect(() => {
    const fetchDownloadLink = async () => {
      if (interviewerData.resultDownloadLink) {
        setPdfUrl(interviewerData.resultDownloadLink);
      }
    };
    fetchDownloadLink();
  }, [interviewResultId]);

  const generateAndUploadPDF = async () => {
    if (pdfUrl) {
      alert("PDF is already available. No need to upload.");
      return;
    }

    setLoading(true);
    try {
      const blob = await pdf(<PDFReport interviewerData={interviewerData} />).toBlob();
      const file = new File([blob], fileName, { type: "application/pdf" });
      const uploadedUrl = await sendResultEmail(file, interviewResultId, isSendEamil, null);
      setPdfUrl(uploadedUrl);
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) showToast.error("Please enter an email.");
    setIsSendEamil(true);
    if (!pdfUrl) {
      setLoading(true);
      await generateAndUploadPDF();
      setLoading(false);
    }

    setSending(true);
    try {
      const emails: string[] = [];
      emails.push(email);
      await sendResultEmail(null, interviewResultId, true, emails);
      showToast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      showToast.success("Error sending email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex flex-row gap-4'>
        {/* Generate & Upload PDF Button (Only If No Link Exists) */}
        {!pdfUrl && (
          <Button onPress={generateAndUploadPDF} color='primary' variant='solid' isLoading={loading}>
            <AiOutlineDownload />
          </Button>
        )}

        {/* Download PDF Button (If Link Exists) */}
        {pdfUrl && (
          <a href={pdfUrl} download={fileName}>
            <Button color='success' isIconOnly={true}>
              <AiOutlineDownload />
            </Button>
          </a>
        )}

        {/* Email Input Field */}
        <Input type='email' placeholder='Enter recipient email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full' />

        {/* Send Email Button (Uploads PDF if needed before sending) */}
        <Button isIconOnly={true} onPress={handleSendEmail} color='secondary' isDisabled={sending} isLoading={sending}>
          <AiOutlineSend />
        </Button>
      </div>
    </div>
  );
};

export default DownloadAndEmailPDF;
