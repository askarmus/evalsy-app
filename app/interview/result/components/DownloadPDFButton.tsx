"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { AiOutlineDownload, AiOutlineSend } from "react-icons/ai";
import { sendResultEmail } from "@/services/interview.service";
import { showToast } from "@/app/utils/toastUtils";

const DownloadAndEmailPDF = ({ result: result }: { result: any }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [sending, setSending] = useState(false);
  const interviewResultId = result?.id;

  useEffect(() => {
    const fetchDownloadLink = async () => {
      if (result.resultDownloadLink) {
        setPdfUrl(result.resultDownloadLink);
      }
    };
    fetchDownloadLink();
  }, [interviewResultId]);

  const downloadResultPDF = async () => {
    setLoading(true);
    try {
      if (!pdfUrl) {
        const uploadedUrl = await sendResultEmail({
          interviewResultId,
          sendEmail,
          emails: null,
        });
        setPdfUrl(uploadedUrl);
      }

      // Create a hidden link element
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = pdfUrl || "";

      // Append to the DOM and trigger click
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) showToast.error("Please enter an email.");
    setSendEmail(true);
    if (!pdfUrl) {
      setLoading(true);
      await downloadResultPDF();
      setLoading(false);
    }

    setSending(true);
    try {
      const emails: string[] = [];
      emails.push(email);
      await sendResultEmail({
        interviewResultId,
        sendEmail,
        emails,
      });
      showToast.success("Email sent successfully!");
    } catch (error) {
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex flex-row gap-4'>
        <Button onPress={downloadResultPDF} color='primary' variant='solid' isLoading={loading}>
          <AiOutlineDownload />
        </Button>

        <Input type='email' placeholder='Enter email to send result' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full' />

        <Button isIconOnly={true} onPress={handleSendEmail} color='secondary' isDisabled={sending} isLoading={sending}>
          <AiOutlineSend />
        </Button>
      </div>
    </div>
  );
};

export default DownloadAndEmailPDF;
