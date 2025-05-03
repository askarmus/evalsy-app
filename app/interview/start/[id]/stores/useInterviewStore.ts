"use client";
import { showToast } from "@/app/utils/toastUtils";
import { upload } from "@/services/company.service";
import { endInterview, startInterview, updateQuestion, updateScreeshot } from "@/services/interview.service";
import { getInvitationDetails } from "@/services/invitation.service";
import { create } from "zustand";

type Phase = "init" | "not-started" | "welcome" | "in-progress" | "completed" | "time-up" | "expired" | "skeleton-loading";

interface Question {
  id: string;
  text: string;
  audioUrl: string;
  type: string;
  timelimit: number;
  lannguage: string;
  explanation: string;
  starterCode: string;
  uploadUrl: string;
  publicUrl: string;
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
  isSkeletonLoading: boolean;
  invitationId: string;

  startInterview: () => void;
  stopRecordingAndNextQuestion: () => void;
  setTimeLeft: (time: number) => void;
  setPhase: (phase: Phase) => void;
  setAudioCompleted: (status: boolean) => void;
  setRecording: (status: boolean) => void;
  toggleCamera: () => void;
  uploadScreenshot: (imageBlob: Blob, questionId: string) => Promise<void>;
  finalizeRecording: (publicUrl: string) => Promise<void>;
  updateCodeResult: (code: string, output: string) => Promise<void>;
  endInterview: () => void;
  setInvitationId: (id: string) => void;
  loadInterview: (interviewId: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>()((set, get) => ({
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
  screenshotInterval: 40000,
  isLoading: false,
  company: null,
  job: null,
  candidate: null,
  isSkeletonLoading: false,
  invitationId: "",

  loadInterview: async (id: string) => {
    try {
      set({ phase: "skeleton-loading" });

      const data = await getInvitationDetails(id as string);

      if (data?.status === "expired") {
        set({ phase: "expired", isLoading: false });
        return;
      }

      set({ invitationId: id });
      set({
        phase: data.phase,
        questions: data.questions,
        currentQuestion: data.currentQuestion,
        duration: data.duration * 60,
        timeLeft: data.timeLeft * 60,
        company: data.company || {},
        job: data.job || {},
        candidate: data.candidate || {},
      });
    } catch (error) {}
  },

  startInterview: async () => {
    try {
      const invitationId = get().invitationId;

      set({ isLoading: true });
      var resposne = await startInterview({ invitationId });
      set({ phase: "welcome", questions: resposne.questions });
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
      const recordedUrl = await upload(file, "image/png");

      await updateScreeshot({
        invitationId: invitationId,
        fileName: recordedUrl.url,
      });
    } catch (error) {}
  },

  finalizeRecording: async (publicUrl) => {
    try {
      const invitationId = get().invitationId;
      if (!invitationId) {
        throw new Error("Interview ID not found.");
      }

      const state = get();

      await updateQuestion({
        invitationId,
        questionId: state.questions[state.currentQuestion].id,
        recordedUrl: publicUrl,
      });

      set({
        isRecording: false,
        isAudioCompleted: true,
      });
    } catch (error) {
      console.error("Error finalizing recording:", error);
      showToast.error("Failed to update answer.");
    }
  },

  updateCodeResult: async (code, output) => {
    try {
      const invitationId = get().invitationId;
      if (!invitationId) {
        throw new Error("Interview ID not found.");
      }
      const state = get();

      await updateQuestion({
        recordedUrl: "",
        invitationId: invitationId,
        questionId: state.questions[state.currentQuestion].id,
        code: code,
        output: output,
      });

      set({
        currentQuestion: state.currentQuestion,
        isAudioCompleted: false,
        isRecording: false,
      });
    } catch (error) {}
  },

  endInterview: async () => {
    try {
      const invitationId = get().invitationId;
      set({ isLoading: true });
      await endInterview({ invitationId });
      set({ phase: "completed" });
    } catch (error) {
      showToast.error("Error ending the interview");
    } finally {
      set({
        isLoading: false,
      });

      setTimeout(() => {
        localStorage.removeItem("pageRefreshed");
      }, 100);
    }
  },

  stopRecordingAndNextQuestion: async () => {
    const state = get();
    if (state.currentQuestion < state.questions.length - 1) {
      set({
        currentQuestion: state.currentQuestion + 1,
        isAudioCompleted: false,
        isRecording: false,
      });
    } else {
      await state.endInterview();
      setTimeout(() => {
        localStorage.removeItem("pageRefreshed");
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
}));
