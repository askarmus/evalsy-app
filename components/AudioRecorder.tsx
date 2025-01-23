import { uploadLogo } from "@/services/company.service";
import { updateQuestion } from "@/services/interview.service"; // Import the API call
import { Button } from "@heroui/react";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineAudio } from "react-icons/ai";

interface AudioRecorderProps {
  hasAnswered: boolean; // Track if the user has answered the current question
  setHasAnswered: React.Dispatch<React.SetStateAction<boolean>>; // Function to update the state in parent
  onNextQuestion: () => void; // Callback to move to the next question
  currentQuestion: any;
  invitationId: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  hasAnswered,
  setHasAnswered,
  onNextQuestion,
  currentQuestion,
  invitationId,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date()); // Track recording start time
  const [endTime, setEndTime] = useState<Date>(new Date()); // Track recording end time

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

        setEndTime(new Date());

        await uploadAudioAsync(file);

        setHasAnswered(true);
      };

      mediaRecorderRef.current.start();
      setStartTime(new Date());
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
  };

  const uploadAudioAsync = async (file: File): Promise<void> => {
    setIsUploading(true);

    try {
      const response = await uploadLogo(file);
      const recordedUrl = response.data?.url;

      console.log("Audio uploaded successfully:", recordedUrl);

      console.log("currentQuestion", currentQuestion);
      await updateQuestion({
        invitationId,
        questionId: currentQuestion.id,
        recordedUrl,
        startTime,
        endTime,
      });
      console.log("Interview question updated successfully");
    } catch (error) {
      console.error("Failed to upload audio or update question:", error);
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
