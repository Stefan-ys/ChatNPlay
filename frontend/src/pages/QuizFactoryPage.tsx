import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Grid, List, Typography, CircularProgress, MenuItem, Modal } from '@mui/material';
import { generateQuestions } from '../services/openai.service';
import { QuestionRequest } from '../types/question.type';
import { createQuestion } from '../services/question.service';
import { TopicRequest, TopicResponse } from '../types/topic.type';
import { createTopic, getTopics } from '../services/topic.service';
import QuestionListItem from '../components/QuestionListItem';
import { convertTextToQuestions } from '../assets/textToQuestionConverter';

const QuizFactoryPage: React.FC = () => {
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState(1);
	const [count, setCount] = useState(1);
	const [modalOpen, setModalOpen] = useState(false);
	const [textInput, setTextInput] = useState('');
	const [questions, setQuestions] = useState<QuestionRequest[]>([]);
	const [topics, setTopics] = useState<TopicResponse[]>([]);
	const [selectedTopicTitle, setSelectedTopicTitle] = useState<string>('');
	const [newTopic, setNewTopic] = useState<TopicRequest>({
		title: '',
		description: '',
	});
	const [tmpId, setTmpId] = useState<number>(-1);
	const [newQuestion, setNewQuestion] = useState<QuestionRequest>({
		id: -1,
		topicTitle: '',
		questionText: '',
		option1: '',
		option2: '',
		option3: '',
		option4: '',
		correctAnswer: '',
		saved: false,
	});

	const prompt = `
	Generate 10 questions based on the topic "${selectedTopicTitle || 'selected topic'}".
	Topic description: "${topics.find((t) => t.title === selectedTopicTitle)?.description || ''}"
	
	Format each question as follows, separated by a line containing only "---":
	
	- Topic Title: ${selectedTopicTitle || '<Topic Title>'}
	- Question Text: <Your Question>
	- Option1: <Option Text>
	- Option2: <Option Text>
	- Option3: <Option Text>
	- Option4: <Option Text>
	- Correct Answer: <Correct Option Text>
	
	Ensure the output is easy to copy, with consistent formatting and clean spacing.
	Use "---" to clearly separate each question.
	`;

	useEffect(() => {
		fetchTopics();
	}, []);

	const fetchTopics = async () => {
		try {
			const topicsList = await getTopics();
			setTopics(topicsList);
		} catch (error) {
			console.error('Error fetching topics:', error);
			setErrorMessage('Failed to load topics.');
		}
	};

	const handleCreateTopic = async () => {
		setLoading(true);
		try {
			await createTopic(newTopic);
			fetchTopics();
			setNewTopic({ title: '', description: '' });
			alert('Topic created successfully!');
		} catch (error) {
			console.error('Error creating topic:', error);
			alert('Failed to create topic.');
		} finally {
			setLoading(false);
		}
	};

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
		setErrorMessage('');
	};

	const handleGenerateQuestions = async () => {
		if (!selectedTopicTitle) {
			setErrorMessage('Please select a topic.');
			return;
		}
		setLoading(true);
		try {
			const generatedQuestions = await generateQuestions({ topicTitle: selectedTopicTitle, count });
			setQuestions([...questions, ...generatedQuestions]);
		} catch (error) {
			console.error('Error:', error);
			setErrorMessage('Failed to generate questions.');
		} finally {
			setLoading(false);
		}
	};

	const handleAddQuestion = () => {
		if (!newQuestion.questionText || !newQuestion.correctAnswer || !selectedTopicTitle) {
			setErrorMessage('All fields are required.');
			return;
		}
		setQuestions((prev) => [...prev, { ...newQuestion, id: tmpId + 1, topicTitle: selectedTopicTitle }]);
		setTmpId(tmpId + 1);
		setNewQuestion({
			id: -1,
			topicTitle: '',
			questionText: '',
			option1: '',
			option2: '',
			option3: '',
			option4: '',
			correctAnswer: '',
			saved: false,
		});
		setErrorMessage('');
	};

	const handleCreateFromText = async () => {
		if (!textInput.trim() || !selectedTopicTitle) {
			setErrorMessage('Text input and topic selection are required.');
			return;
		}
		setLoading(true);
		try {
			const newQuestions = convertTextToQuestions(textInput).map((question, index) => ({
				...question,
				id: tmpId + index + 1,
			}));

			setQuestions((prev) => [...prev, ...newQuestions]);
			setTmpId(tmpId + newQuestions.length);
			setTextInput('');
			alert('Questions created successfully!');
		} catch (error) {
			console.error('Error:', error);
			setErrorMessage('Failed to create questions.');
		} finally {
			setLoading(false);
		}
	};

	const handleSaveQuestion = async (id: number) => {
		const questionToSave = questions.find((q) => q.id === id);
		if (!questionToSave) {
			setErrorMessage('Question not found.');
			return;
		}
		setLoading(true);
		try {
			await createQuestion(questionToSave);
			setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, saved: true } : q)));
			alert('Question saved successfully!');
		} catch (error) {
			console.error('Error:', error);
			setErrorMessage('Failed to save question.');
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveQuestion = (id: number) => {
		setQuestions((prev) => prev.filter((q) => q.id !== id));
	};

	const handleCopyPrompt = () => {
		navigator.clipboard.writeText(prompt).then(() => {
			alert('Prompt copied to clipboard!');
		});
	};

	return (
		<Box sx={{ maxWidth: '800px', margin: 'auto', mt: 4 }}>
			{/* Horizontal Topic List */}
			<Box sx={{ display: 'flex', overflowX: 'auto', mb: 4, borderBottom: '1px solid #ccc' }}>
				{topics.map((topic) => (
					<Button
						key={topic.title}
						variant={selectedTopicTitle === topic.title ? 'contained' : 'text'}
						onClick={() => setSelectedTopicTitle(topic.title)}
						sx={{ minWidth: '150px' }}
					>
						{topic.title}
					</Button>
				))}
				<Button onClick={() => setModalOpen(true)}>+ New Topic</Button>
			</Box>

			{/* Tabs for Question Management */}
			<Tabs value={activeTab} onChange={handleTabChange} centered>
				<Tab label='Generate Questions' />
				<Tab label='Create Question Manually' />
				<Tab label='Create Questions From Text' />
			</Tabs>

			{/* Generate Questions */}
			{activeTab === 0 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant='h6'>Generate Questions Using OpenAI</Typography>
					<TextField
						select
						label='Select Topic'
						value={selectedTopicTitle || ''}
						onChange={(e) => setSelectedTopicTitle(e.target.value)}
						fullWidth
						sx={{ mb: 2 }}
					>
						{topics.map((topic) => (
							<MenuItem key={topic.id} value={topic.title}>
								{topic.title}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label='Number of Questions'
						type='number'
						value={count}
						onChange={(e) => setCount(Number(e.target.value))}
						fullWidth
						sx={{ mb: 2 }}
					/>
					<Button variant='contained' onClick={handleGenerateQuestions} disabled={loading}>
						{loading ? <CircularProgress size={20} /> : 'Generate Questions'}
					</Button>
				</Box>
			)}

			{/* Create Question Manually */}
			{activeTab === 1 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant='h6'>Create Question</Typography>
					<TextField
						select
						label='Select Topic'
						value={selectedTopicTitle || ''}
						onChange={(e) => setSelectedTopicTitle(e.target.value)}
						fullWidth
						sx={{ mb: 2 }}
					>
						{topics.map((topic) => (
							<MenuItem key={topic.id} value={topic.title}>
								{topic.title}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label='Question Text'
						value={newQuestion.questionText}
						onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
						fullWidth
						sx={{ mb: 2 }}
					/>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								label='Option 1'
								value={newQuestion.option1}
								onChange={(e) => setNewQuestion({ ...newQuestion, option1: e.target.value })}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label='Option 2'
								value={newQuestion.option2}
								onChange={(e) => setNewQuestion({ ...newQuestion, option2: e.target.value })}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label='Option 3'
								value={newQuestion.option3}
								onChange={(e) => setNewQuestion({ ...newQuestion, option3: e.target.value })}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label='Option 4'
								value={newQuestion.option4}
								onChange={(e) => setNewQuestion({ ...newQuestion, option4: e.target.value })}
								fullWidth
							/>
						</Grid>
					</Grid>
					<TextField
						label='Correct Answer'
						value={newQuestion.correctAnswer}
						onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
						fullWidth
						sx={{ my: 2 }}
					/>
					<Button variant='contained' onClick={handleAddQuestion}>
						Add Question
					</Button>
				</Box>
			)}
			{/* Create Question From Text */}
			{activeTab === 2 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant='h6'>Paste Text to Create Questions</Typography>
					<TextField
						select
						label='Select Topic'
						value={selectedTopicTitle || ''}
						onChange={(e) => setSelectedTopicTitle(e.target.value)}
						fullWidth
						sx={{ mb: 2 }}
					>
						{topics.map((topic) => (
							<MenuItem key={topic.id} value={topic.title}>
								{topic.title}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label='Paste Text'
						placeholder={`${prompt}`}
						value={textInput}
						onChange={(e) => setTextInput(e.target.value)}
						multiline
						rows={6}
						fullWidth
						sx={{ mb: 2 }}
					/>
					<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
						<Button variant='outlined' onClick={handleCopyPrompt} disabled={!selectedTopicTitle}>
							Copy Prompt
						</Button>
						<Button variant='contained' onClick={handleCreateFromText} disabled={!textInput.trim() || !selectedTopicTitle || loading}>
							{loading ? <CircularProgress size={20} /> : 'Create from Text'}
						</Button>
					</Box>
				</Box>
			)}

			{/* Question List */}
			<Box sx={{ mt: 3 }}>
				<Typography variant='h6'>Questions</Typography>
				<List>
					{questions.map((q) => (
						<QuestionListItem key={q.id} question={q} loading={loading} onSave={handleSaveQuestion} onRemove={handleRemoveQuestion} />
					))}
				</List>
			</Box>

			{/* New Topic Modal */}
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', mt: 10, maxWidth: 400 }}>
					<Typography variant='h6'>Create New Topic</Typography>
					<TextField
						label='Topic Title'
						value={newTopic.title}
						onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
						fullWidth
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Description'
						value={newTopic.description}
						onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
						fullWidth
						sx={{ mb: 2 }}
					/>
					<Button variant='contained' onClick={handleCreateTopic} disabled={loading}>
						{loading ? <CircularProgress size={20} /> : 'Create Topic'}
					</Button>
				</Box>
			</Modal>

			{errorMessage && <Typography color='error'>{errorMessage}</Typography>}
		</Box>
	);
};

export default QuizFactoryPage;
