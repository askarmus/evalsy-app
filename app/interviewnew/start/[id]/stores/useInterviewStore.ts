"use client";
import { showToast } from "@/app/utils/toastUtils";
import { upload } from "@/services/company.service";
import { startInterview, updateQuestion, updateScreeshot } from "@/services/interview.service";
import { getInvitationDetails } from "@/services/invitation.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Phase = "init" | "not-started" | "welcome" | "in-progress" | "completed" | "time-up" | "expired" | "skeleton-loading";

interface Question {
  id: string;
  text: string;
  audioUrl: string;
}

interface InterviewState {
  phase: Phase;
  questions: Question[];
  candidate: any;
  company: any;
  job: any;
  interviewer: any;
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
  isSkeletonLoading: boolean;
  invitationId: string;
  isLoaded: boolean;

  startInterview: () => void;
  completeInterview: () => void;
  stopRecordingAndNextQuestion: () => void;
  setTimeLeft: (time: number) => void;
  setPhase: (phase: Phase) => void;
  setAudioCompleted: (status: boolean) => void;
  setRecording: (status: boolean) => void;
  toggleCamera: () => void;
  uploadScreenshot: (imageBlob: Blob, questionId: string) => Promise<void>;
  uploadRecording: (audioBlob: Blob) => Promise<void>;
  endInterview: () => void;
  setInvitationId: (id: string) => void;
  loadInterview: (interviewId: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      phase: "init",
      questions: [],
      currentQuestion: 0,
      duration: 0,
      extraTime: 0,
      timeLeft: 0,
      extraTimeAdded: false,
      isAudioCompleted: false,
      isRecording: false,
      isCameraOn: true,
      screenshotInterval: 300000,
      isLoading: false,
      company: null,
      job: null,
      candidate: null,
      interviewer: null,
      isSkeletonLoading: false,
      invitationId: "",
      isLoaded: false,

      loadInterview: async (id: string) => {
        if (get().isLoaded || get().phase === "completed") return;

        try {
          set({ phase: "skeleton-loading", isLoaded: false }); // Set isLoaded before making API call

          const data = await getInvitationDetails(id as string);

          if (data?.status === "expired") {
            set({ phase: "expired", isLoading: false });
            return;
          }

          set({ invitationId: id });
          set({
            phase: "not-started",
            questions: data.job.questions || [],
            currentQuestion: 0,
            duration: data.duration * 60,
            timeLeft: data.duration * 60,
            company: data.company || {},
            job: data.job || {},
            candidate: data.candidate || {},
            interviewer: data.interviewer || {},
            isLoading: false,
          });
        } catch (error) {}
      },

      startInterview: async () => {
        try {
          const invitationId = get().invitationId;

          set({ isLoading: true });
          await startInterview({ invitationId });
          set({ phase: "welcome" });
        } catch (error) {
          showToast.error("Error starting the interview");
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      toggleCamera: () => set((state) => ({ isCameraOn: !state.isCameraOn })),

      uploadScreenshot: async (imageBlob, interviewId) => {
        try {
          const invitationId = get().invitationId;
          if (!invitationId) {
            throw new Error("Interview ID not found.");
          }
          const file = new File([imageBlob], `screenshot_${interviewId}_${Date.now()}.png`, { type: "image/png" });
          const recordedUrl = await upload(file);

          await updateScreeshot({
            invitationId: invitationId,
            fileName: recordedUrl.url,
          });
        } catch (error) {}
      },

      uploadRecording: async (audioBlob) => {
        try {
          const invitationId = get().invitationId;
          if (!invitationId) {
            throw new Error("Interview ID not found.");
          }
          const file = new File([audioBlob], `answer_audio${invitationId}_${Date.now()}.mp3`, { type: "image/png" });
          const recordedData = await upload(file);
          const state = get();

          await updateQuestion({
            invitationId: invitationId,
            questionId: state.questions[state.currentQuestion].id,
            recordedUrl: recordedData.url,
          });
        } catch (error) {}
      },

      endInterview: () => {
        if (window.confirm("Are you sure you want to end the interview?")) {
          set({ phase: "completed", isLoaded: false });
          setTimeout(() => {
            localStorage.removeItem("interview-storage");
            localStorage.removeItem("pageRefreshed");
            useInterviewStore.persist.clearStorage();
          }, 100);
        }
      },

      completeInterview: () => {
        set({ phase: "completed", isLoaded: false });
        setTimeout(() => {
          localStorage.removeItem("interview-storage");
          localStorage.removeItem("pageRefreshed");

          useInterviewStore.persist.clearStorage();
        }, 100);
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
          set({ phase: "completed", isLoaded: false });
          setTimeout(() => {
            localStorage.removeItem("interview-storage");
            localStorage.removeItem("pageRefreshed");

            useInterviewStore.persist.clearStorage();
          }, 100);
        }
      },
      setInvitationId: (id: string) => set({ invitationId: id }),

      setTimeLeft: (time) =>
        set((state) => {
          if (time <= 0) {
            return { phase: "time-up", timeLeft: 0 };
          }

          if (!state.extraTimeAdded && time <= state.duration * 0.2) {
            showToast.error("80% of your interview time is completed! Extra time added.");
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
        invitationId: state.invitationId,
        questions: state.questions,
        candidate: state.candidate,
        company: state.company,
        duration: state.duration,
        interviewer: state.interviewer,
        job: state.job,
        currentQuestion: state.currentQuestion,
        isLoaded: state.isLoaded,
      }),
    }
  )
);
