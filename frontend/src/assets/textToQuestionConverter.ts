import { QuestionRequest } from '../types/question.type';

export const convertTextToQuestions = (responseText: string): QuestionRequest[] => {
	const questions: QuestionRequest[] = [];

	const questionBlocks = responseText.split('---').filter(block => block.trim() !== '');

	questionBlocks.forEach((block) => {
		const lines = block.split('\n').map(line => line.trim()).filter(line => line !== '');
		const questionData: Record<string, string> = {};

		lines.forEach(line => {
			const [key, ...value] = line.split(':');
			if (key && value.length > 0) {
				const cleanedKey = key.replace(/^[^a-zA-Z]+/, '').trim();
				questionData[cleanedKey] = value.join(':').trim();
			}
		});

		if (
			questionData['Question Text'] &&
            questionData.Option1 &&
            questionData.Option2 &&
            questionData.Option3 &&
            questionData.Option4 &&
            questionData['Correct Answer']
		) {
			questions.push({
				id: -1,
				topicTitle: questionData['Topic Title'] || '',
				questionText: questionData['Question Text'],
				option1: questionData.Option1,
				option2: questionData.Option2,
				option3: questionData.Option3,
				option4: questionData.Option4,
				correctAnswer: questionData['Correct Answer'],
				saved: false,
			});
		}
	});

	return questions;
};
