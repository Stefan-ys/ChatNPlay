import { API_QUESTION_URL } from '../common/urls';
import { QuestionRequest, QuestionResponse } from '../types/question.type';
import axiosUtil from '../utils/axiosUtil';

/**
 * Creates a new question.
 * @param questionData The data for the new question.
 */
export const createQuestion = async (questionData: QuestionRequest): Promise<void> => {
	try {
		await axiosUtil.post(API_QUESTION_URL, questionData);
	} catch (error) {
		console.error('Error creating question:', error);
		throw error;
	}
};

/**
 * Retrieves a question by its ID.
 * @param questionId The ID of the question to fetch.
 * @returns A `QuestionResponse` object.
 */
export const getQuestionById = async (questionId: number): Promise<QuestionResponse> => {
	try {
		const response = await axiosUtil.get<QuestionResponse>(`${API_QUESTION_URL}/${questionId}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching question with ID ${questionId}:`, error);
		throw error;
	}
};

/**
 * Retrieves all questions associated with a specific topic ID.
 * @param topicId The ID of the topic.
 * @returns An array of `QuestionResponse` objects.
 */
export const getQuestionsByTopicId = async (topicId: number): Promise<QuestionResponse[]> => {
	try {
		const response = await axiosUtil.get<QuestionResponse[]>(`${API_QUESTION_URL}/topic/${topicId}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching questions for topic ID ${topicId}:`, error);
		throw error;
	}
};

/**
 * Updates an existing question by ID.
 * @param questionId The ID of the question to update.
 * @param questionData The new data for the question.
 */
export const updateQuestion = async (questionId: number, questionData: QuestionRequest): Promise<void> => {
	try {
		await axiosUtil.put(`${API_QUESTION_URL}/${questionId}`, questionData);
	} catch (error) {
		console.error(`Error updating question with ID ${questionId}:`, error);
		throw error;
	}
};

/**
 * Deletes a question by its ID.
 * @param questionId The ID of the question to delete.
 */
export const deleteQuestion = async (questionId: number): Promise<void> => {
	try {
		await axiosUtil.delete(`${API_QUESTION_URL}/${questionId}`);
	} catch (error) {
		console.error(`Error deleting question with ID ${questionId}:`, error);
		throw error;
	}
};

/**
 * Creates questions from text.
 * @param text String text that holds questions in specified text format.
 */
export const createQuestionFromText = async (text: string): Promise<void> => {
	try {
		await axiosUtil.post(`${API_QUESTION_URL}/from-text`, { text });
	} catch (error) {
		console.error('Error creating questions from text:', error);
		throw error;
	}
};
