'use client';
import { showToast } from '@/app/utils/toastUtils';
import { createInterviewAssistant } from '@/lib/data/vapi.sdk';
import { upload } from '@/services/company.service';
import { endInterview, startInterview, updateScreeshot, updateVapiCallId } from '@/services/interview.service';
import { getInvitationDetails } from '@/services/invitation.service';
import { create } from 'zustand';

type Phase = 'init' | 'not-started' | 'in-progress' | 'completed' | 'time-up' | 'expired' | 'skeleton-loading';

export interface Question {
  id: string;
  text: string;
  audioUrl: string;
  uploadUrl: string;
  publicUrl: string;
}

interface InterviewState {
  phase: Phase;
  questions: Question[];
  candidate: any;
  company: any;
  job: any;
  duration: number;
  timeLeft: number;
  isCameraOn: boolean;
  screenshotInterval: number;
  isLoading: boolean;
  isSkeletonLoading: boolean;
  invitationId: string;
  micDeviceId: string; // ✅ NEW

  startInterview: () => void;
  setMicDeviceId: (id: string) => void;
  setTimeLeft: (time: number) => void;
  setPhase: (phase: Phase) => void;
  uploadScreenshot: (imageBlob: Blob, questionId: string) => Promise<void>;
  endInterview: () => void;
  setInvitationId: (id: string) => void;
  loadInterview: (interviewId: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>()((set, get) => ({
  phase: 'init',
  questions: [],
  currentQuestion: 0,
  duration: 0,
  timeLeft: 0,
  isCameraOn: true,
  screenshotInterval: 80000,
  isLoading: false,
  company: null,
  job: null,
  candidate: null,
  isSkeletonLoading: false,
  invitationId: '',
  micDeviceId: '',
  setMicDeviceId: (id: string) => set({ micDeviceId: id }),
  loadInterview: async (id: string) => {
    try {
      set({ phase: 'skeleton-loading' });

      const data = await getInvitationDetails(id as string);

      if (data?.status === 'expired') {
        set({ phase: 'expired', isLoading: false });
        return;
      }

      set({ invitationId: id });
      set({
        phase: data.phase,
        questions: data.questions,
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
      const { invitationId, candidate, job, questions } = get();

      set({ isLoading: true });
      var resposne = await startInterview({ invitationId });
      const baseInterviewData = {
        userName: candidate?.name,
        role: job?.jobTitle,
        level: job?.experienceLevel,
      };

      const call = await createInterviewAssistant({ ...baseInterviewData, questions });
      if (call?.id) {
        await updateVapiCallId({ invitationId, callId: call.id });
      } else {
        console.error('Call ID is undefined');
      }
      set({ phase: 'in-progress', questions: resposne.questions });
    } catch (error) {
      showToast.error('Error starting the interview');
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
        throw new Error('Interview ID not found.');
      }
      const file = new File([imageBlob], `screenshot_${interviewId}_${Date.now()}.png`, { type: 'image/png' });
      const recordedUrl = await upload(file, 'image/png');

      await updateScreeshot({
        invitationId: invitationId,
        fileName: recordedUrl.url,
      });
    } catch (error) {}
  },

  endInterview: async () => {
    try {
      const invitationId = get().invitationId;
      set({ isLoading: true });
      await endInterview({ invitationId });
      set({ phase: 'completed' });
    } catch (error) {
      showToast.error('Error ending the interview');
    } finally {
      set({
        isLoading: false,
      });

      setTimeout(() => {
        localStorage.removeItem('pageRefreshed');
      }, 100);
    }
  },

  setInvitationId: (id: string) => set({ invitationId: id }),

  setTimeLeft: (time) =>
    set((state) => {
      if (time <= 0) {
        return { phase: 'time-up', timeLeft: 0 };
      }

      return { timeLeft: time };
    }),

  setPhase: (phase) => set({ phase }),
}));
