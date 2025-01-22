import { uploadLogo } from "@/services/company.service";
import { Button } from "@heroui/react";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineAudio } from "react-icons/ai";

interface AudioRecorderProps {
  hasAnswered: boolean; // Track if the user has answered the current question
  setHasAnswered: React.Dispatch<React.SetStateAction<boolean>>; // Function to update the state in parent
  onNextQuestion: () => void; // Callback to move to the next question
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  hasAnswered,
  setHasAnswered,
  onNextQuestion,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (hasAnswered) {
      setIsRecording(false); // Ensure recording is stopped when the user answers
    }
  }, [hasAnswered]);

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        await uploadAudioAsync(file);
        setHasAnswered(true); // Mark question as answered
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setHasAnswered(true); // Ensure the "Next Question" button is shown after stopping
  };

  const uploadAudioAsync = async (file: File): Promise<void> => {
    setIsUploading(true);

    try {
      const response = await uploadLogo(file); // Use the provided service method
      console.log("Audio uploaded successfully:", response);
    } catch (error) {
      console.error("Failed to upload audio:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnswerClick = (): void => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleNextQuestion = (): void => {
    setHasAnswered(false); // Reset the answer state
    onNextQuestion(); // Move to the next question
  };

  return (
    <div>
      {!hasAnswered ? (
        <Button
          color="success"
          endContent={<AiOutlineAudio />}
          onPress={handleAnswerClick}
          disabled={isUploading}
        >
          {isRecording ? "Stop Recording" : "Answer"}
        </Button>
      ) : (
        <Button color="success" onPress={handleNextQuestion}>
          Next Question
        </Button>
      )}
    </div>
  );
};

export default AudioRecorder;
