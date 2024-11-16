import { OpenAIQuestionTopicRequest } from './../types/openai.type';
import { API_LOBBY_URL, API_URL } from "../common/urls";
import { QuestionResponse } from "../types/question.type";
import axiosUtil from "../utils/axiosUtil";


export const generateQuestions = async (requestData :OpenAIQuestionTopicRequest): Promise<QuestionResponse[]> => {
  try {
      const response = await axiosUtil.post(`${API_URL}/openai/generate`, requestData);
      return response.data;
  } catch (error) {
      console.error('Error fetching openAI generated questions:', error);
      throw error; 
  }
};
