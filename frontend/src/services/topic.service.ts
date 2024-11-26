import axiosUtil from '../utils/axiosUtil';
import { TopicRequest, TopicResponse } from '../types/topic.type';
import { API_TOPICS_URL } from '../common/urls';

export const getTopics = async (): Promise<TopicResponse[]> => {
	const response = await axiosUtil.get(API_TOPICS_URL);
	return response.data;
};

export const createTopic = async (topicData: TopicRequest): Promise<void> => {
	await axiosUtil.post(API_TOPICS_URL, topicData);
};
