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

  const sendOrDownloadResultPDF = async () => {
    setLoading(true);
    try {
      const uploadedUrl = await sendResultEmail({
        interviewResultId,
        sendEmail,
        emails: null,
      });
      setPdfUrl(uploadedUrl);
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
      await sendOrDownloadResultPDF();
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
        {!pdfUrl && (
          <Button onPress={sendOrDownloadResultPDF} color='primary' variant='solid' isLoading={loading}>
            <AiOutlineDownload />
          </Button>
        )}

        {pdfUrl && (
          <a href={pdfUrl} target='_blank'>
            <Button color='success'>
              <AiOutlineDownload /> Download Result
            </Button>
          </a>
        )}

        <Input type='email' placeholder='Enter email to send result' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full' />

        <Button isIconOnly={true} onPress={handleSendEmail} color='secondary' isDisabled={sending} isLoading={sending}>
          <AiOutlineSend />
        </Button>
      </div>
    </div>
  );
};

export default DownloadAndEmailPDF;
