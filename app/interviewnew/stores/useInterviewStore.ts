"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Phase = "preparing" | "not-started" | "welcome" | "in-progress" | "completed" | "time-up" | "expired";

interface Question {
  id: number;
  text: string;
  audio: string;
}

interface InterviewState {
  phase: Phase;
  questions: Question[];
  candidate: any;
  company: any;
  job: any;
  currentQuestion: number;
  duration: number;
  extraTime: number;
  timeLeft: number;
  extraTimeAdded: boolean;
  isAudioCompleted: boolean;
  isRecording: boolean;
  isCameraOn: boolean;
  screenshotInterval: number;
  isLoading: boolean;

  prepareInterview: () => void; // ✅ New function to move from 'preparing' to 'not-started'
  startInterview: (interviewId: string) => void;
  completeInterview: () => void;
  nextQuestion: () => void;
  stopRecordingAndNextQuestion: () => void;
  reset: () => void;
  setTimeLeft: (time: number) => void;
  setPhase: (phase: Phase) => void;
  setAudioCompleted: (status: boolean) => void;
  setRecording: (status: boolean) => void;
  toggleCamera: () => void;
  uploadScreenshot: (imageBlob: Blob, interviewId: string) => Promise<void>;
  endInterview: () => void;
}

const sampleData = {
  invitationId: "12345-abcde",
  company: {
    name: "Tech Solutions Inc.",
    logo: "/company-logo.png",
  },
  candidate: {
    candidateName: "John Doe",
    candidateEmail: "johndoe@example.com",
  },
  job: {
    jobTitle: "Software Engineer",
  },
  duration: 30, // Interview duration in minutes
  isLoading: false,
  questions: [
    { id: 1, text: "Tell us about yourself.", audio: "" },
    { id: 2, text: "What are your strengths and weaknesses?", audio: "" },
    { id: 3, text: "Describe a challenging project you worked on.", audio: "" },
  ],
};

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      phase: "preparing", // ✅ Initial phase before 'not-started'
      questions: sampleData.questions,
      currentQuestion: 0,
      duration: sampleData.duration * 60, // Convert minutes to seconds
      extraTime: 600,
      timeLeft: sampleData.duration * 60,
      extraTimeAdded: false,
      isAudioCompleted: false,
      isRecording: false,
      isCameraOn: true,
      screenshotInterval: 300000, // 5 minutes
      isLoading: false,
      company: sampleData.company,
      job: sampleData.job,
      candidate: sampleData.candidate,

      /** ✅ Move from 'preparing' to 'not-started' with initial data */
      prepareInterview: () => {
        set({
          phase: "not-started",
          questions: sampleData.questions,
          candidate: sampleData.candidate,
          company: sampleData.company,
          job: sampleData.job,
        });
      },

      startInterview: async (interviewId: string) => {
        try {
          set({ isLoading: true });

          const sampleQuestions = [
            { id: 1, text: "What is your name?", audio: "https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3" },
            { id: 2, text: "Where are you from?", audio: "https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3" },
            { id: 3, text: "What is your favorite programming language?", audio: "https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3" },
          ];

          set({
            phase: "welcome",
            questions: sampleQuestions,
            currentQuestion: 0,
            duration: 600,
            timeLeft: 600,
            extraTimeAdded: false,
            isAudioCompleted: false,
            isRecording: false,
            isLoading: false,
            company: sampleData.company,
            job: sampleData.job,
            candidate: sampleData.candidate,
          });
        } catch (error) {
          console.error("❌ Failed to fetch interview data:", error);
          alert("Failed to load interview. Please try again.");
          set({ isLoading: false });
        }
      },

      toggleCamera: () => set((state) => ({ isCameraOn: !state.isCameraOn })),

      uploadScreenshot: async (imageBlob, interviewId) => {
        try {
          console.log("Uploading screenshot...");
          const formData = new FormData();
          formData.append("file", imageBlob, `screenshot_${interviewId}_${Date.now()}.png`);

          const response = await fetch("https://your-backend-api.com/api/upload-screenshot", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload screenshot");
          }

          console.log("✅ Screenshot uploaded successfully!");
        } catch (error) {
          console.error("❌ Failed to upload screenshot:", error);
          alert("Screenshot upload failed. Please check your internet connection.");
        }
      },

      endInterview: () => {
        if (window.confirm("⚠️ Are you sure you want to end the interview?")) {
          set({ phase: "completed" });
          localStorage.removeItem("interview-storage");
        }
      },

      completeInterview: () => {
        localStorage.removeItem("interview-storage");
        set({ phase: "completed" });
      },

      nextQuestion: () => {
        const state = get();
        if (state.currentQuestion < state.questions.length - 1) {
          set({
            currentQuestion: state.currentQuestion + 1,
            isAudioCompleted: false,
            isRecording: false,
          });
        } else {
          set({ phase: "completed" });
        }
      },

      stopRecordingAndNextQuestion: () => {
        const state = get();
        if (state.currentQuestion < state.questions.length - 1) {
          set({
            currentQuestion: state.currentQuestion + 1,
            isAudioCompleted: false,
            isRecording: false,
          });
        } else {
          set({ phase: "completed" });
        }
      },

      reset: () =>
        set({
          phase: "preparing",
          questions: sampleData.questions,
          currentQuestion: 0,
          timeLeft: sampleData.duration * 60,
          extraTimeAdded: false,
          isAudioCompleted: false,
          isRecording: false,
          company: sampleData.company,
          job: sampleData.job,
          candidate: sampleData.candidate,
        }),

      setTimeLeft: (time) =>
        set((state) => {
          if (time <= 0) {
            return { phase: "time-up", timeLeft: 0 };
          }

          if (!state.extraTimeAdded && time <= state.duration * 0.2) {
            alert("⚠️ 80% of your interview time is completed! Extra time added.");
            return {
              timeLeft: time + state.extraTime,
              extraTimeAdded: true,
            };
          }

          return { timeLeft: time };
        }),

      setPhase: (phase) => set({ phase }),
      setAudioCompleted: (status) => set({ isAudioCompleted: status }),
      setRecording: (status) => {
        if (!status) {
          get().stopRecordingAndNextQuestion();
        }
        set({ isRecording: status });
      },
    }),
    {
      name: "interview-storage",
      partialize: (state) => ({
        phase: state.phase,
        questions: state.questions,
        candidate: state.candidate,
        company: state.company,
        job: state.job,
      }),
    }
  )
);
