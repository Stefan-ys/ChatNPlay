import axiosUtil from '../utils/axiosUtil';
import { TopicRequest, TopicResponse } from '../types/topic.type';
import { API_TOPICS_URL } from '../common/urls';

/**
 * Retrieves all topics.
 * @returns An array of `TopicResponse` objects.
 */
export const getTopics = async (): Promise<TopicResponse[]> => {
	try {
		const response = await axiosUtil.get(API_TOPICS_URL);
		return response.data;
	} catch (error) {
		console.error('Error fetching topics:', error);
		throw error;
	}
};

/**
 * Creates a new topic.
 * @param topicData The data for the new topic.
 */
export const createTopic = async (topicData: TopicRequest): Promise<void> => {
	try {
		await axiosUtil.post(API_TOPICS_URL, topicData);
	} catch (error) {
		console.error('Error creating topic:', error);
		throw error;
	}
};
