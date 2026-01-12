import axios from 'axios';

// TypeScript Interfaces
export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description?: string;
  interviewSteps: InterviewStep[];
}

export interface PositionDetails {
  positionName: string;
  interviewFlow: InterviewFlow;
}

export interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  id: number;
  applicationId: number;
  currentStageId?: number;
}

export interface PositionCandidates {
  candidates: Candidate[];
}

// API Service Methods
const API_BASE_URL = 'http://localhost:3010';

export const getPositionInterviewFlow = async (positionId: number): Promise<PositionDetails> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/position/${positionId}/interviewflow`);
    return response.data;
  } catch (error) {
    console.error('Error fetching position interview flow:', error);
    throw new Error('Failed to fetch position details');
  }
};

export const getCandidatesByPosition = async (positionId: number): Promise<Candidate[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/position/${positionId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates by position:', error);
    throw new Error('Failed to fetch candidates');
  }
};

export const updateCandidateStage = async (
  candidateId: number,
  applicationId: number,
  currentInterviewStep: number
): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/candidates/${candidateId}/stage`, {
      applicationId: applicationId.toString(),
      currentInterviewStep: currentInterviewStep.toString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating candidate stage:', error);
    throw new Error('Failed to update candidate stage');
  }
};

export const getFullCandidateDetails = async (candidateId: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidates/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    throw new Error('Failed to fetch candidate details');
  }
};
