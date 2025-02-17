"use client";

import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import PDFReport from "./PDFReport";
import { upload } from "@/services/company.service";
import { Button, Card, CardBody, CardFooter, Input } from "@heroui/react";
import { AiOutlineDownload, AiOutlineSend } from "react-icons/ai";

const DownloadAndEmailPDF = ({ interviewerData }: { interviewerData: any }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const interviewResultId = interviewerData?.interviewResultId; // Unique interview ID

  const uniqueId = Date.now();
  const fileName = `${interviewerData.candidateName}-${interviewerData.jobTitle}-${uniqueId}.pdf`.replace(/ /g, "_");

  // 🔍 **Check if PDF already exists in the database**
  useEffect(() => {
    const fetchDownloadLink = async () => {
      if (interviewResultId) {
        const existingLink = ""; // await getDownloadLink(interviewResultId);
        if (existingLink) {
          setPdfUrl(existingLink);
        }
      }
    };
    fetchDownloadLink();
  }, [interviewResultId]);

  // 📄 **Upload PDF only if it doesn't exist**
  const generateAndUploadPDF = async () => {
    if (pdfUrl) {
      alert("PDF is already available. No need to upload.");
      return;
    }

    setLoading(true);
    try {
      // Generate PDF Blob
      const blob = await pdf(<PDFReport interviewerData={interviewerData} />).toBlob();

      // Convert Blob to File
      const file = new File([blob], fileName, { type: "application/pdf" });

      // Upload PDF file to the server & save in DB
      const uploadedUrl = await upload(file);
      setPdfUrl(uploadedUrl);
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📧 **Send email only after ensuring the PDF exists**
  const handleSendEmail = async () => {
    if (!email) return alert("Please enter an email.");

    if (!pdfUrl) {
      setLoading(true);
      await generateAndUploadPDF();
      setLoading(false);
    }

    setSending(true);
    try {
      // const response = await sendEmail({
      //   email,
      //   pdfUrl,
      //   candidateName: interviewerData.candidateName,
      //   jobTitle: interviewerData.jobTitle,
      // });

      if (true) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email.");
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
