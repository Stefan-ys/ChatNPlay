import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Grid, List, ListItem, ListItemText, Typography, IconButton, CircularProgress, MenuItem, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { generateQuestions } from '../services/openai.service';
import { QuestionRequest, QuestionResponse } from '../types/question.type';
import { createQuestion, createQuestionFromText } from '../services/question.service';
import { TopicRequest, TopicResponse } from '../types/topic.type';
import { createTopic, getTopics } from '../services/topic.service';

const QuizzFactoryPage: React.FC = () => {
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [count, setCount] = useState(1);
	const [modalOpen, setModalOpen] = useState(false);
	const [textInput, setTextInput] = useState('');
	const [questions, setQuestions] = useState<QuestionResponse[]>([]);
	const [topics, setTopics] = useState<TopicResponse[]>([]);
	const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
	const [newTopic, setNewTopic] = useState<TopicRequest>({
		title: '',
		imageFile: new File([], ''),
		description: '',
	});
	const [newQuestion, setNewQuestion] = useState<QuestionRequest>({
		id: -1,
		topicId: 1,
		questionText: '',
		option1: '',
		option2: '',
		option3: '',
		option4: '',
		correctAnswer: '',
	});

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
			setNewTopic({ title: '', imageFile: new File([], ''), description: '' });
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
		if (!selectedTopicId) {
			setErrorMessage('Please select a topic.');
			return;
		}
		setLoading(true);
		try {
			const generatedQuestions = await generateQuestions({ topicId: selectedTopicId, count });
			setQuestions([...questions, ...generatedQuestions]);
		} catch (error) {
			console.error('Error:', error);
			setErrorMessage('Failed to generate questions.');
		} finally {
			setLoading(false);
		}
	};

	const handleAddQuestion = () => {
		if (!newQuestion.questionText || !newQuestion.correctAnswer || !selectedTopicId) {
			setErrorMessage('All fields are required.');
			return;
		}
		setQuestions((prev) => [...prev, { ...newQuestion, id: prev.length + 1, topicId: selectedTopicId }]);
		setNewQuestion({
			id: -1,
			topicId: selectedTopicId,
			questionText: '',
			option1: '',
			option2: '',
			option3: '',
			option4: '',
			correctAnswer: '',
		});
	};

	const handleCreateFromText = async () => {
		if (!textInput.trim() || !selectedTopicId) {
			setErrorMessage('Text input and topic selection are required.');
			return;
		}
		setLoading(true);
		try {
			await createQuestionFromText({ text: textInput, topicId: selectedTopicId });
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

	const QuestionListItem: React.FC<{ question: QuestionResponse }> = ({ question }) => (
		<ListItem>
			<ListItemText
				primary={question.questionText}
				secondary={
					<>
						Options: {question.option1}, {question.option2}, {question.option3}, {question.option4}
						<br />
						Correct Answer: {question.correctAnswer}
					</>
				}
			/>
			<IconButton onClick={() => handleSaveQuestion(question.id)} disabled={loading}>
				<SaveIcon />
			</IconButton>
			<IconButton onClick={() => handleRemoveQuestion(question.id)}>
				<DeleteIcon />
			</IconButton>
		</ListItem>
	);

	return (
		<Box sx={{ maxWidth: '800px', margin: 'auto', mt: 4 }}>
			{/* Horizontal Topic List */}
			<Box sx={{ display: 'flex', overflowX: 'auto', mb: 4, borderBottom: '1px solid #ccc' }}>
				{topics.map((topic) => (
					<Button key={topic.id} variant={selectedTopicId === topic.id ? 'contained' : 'text'} onClick={() => setSelectedTopicId(topic.id)} sx={{ minWidth: '150px' }}>
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
					<TextField select label='Select Topic' value={selectedTopicId || ''} onChange={(e) => setSelectedTopicId(Number(e.target.value))} fullWidth sx={{ mb: 2 }}>
						{topics.map((topic) => (
							<MenuItem key={topic.id} value={topic.id}>
								{topic.title}
							</MenuItem>
						))}
					</TextField>
					<TextField label='Number of Questions' type='number' value={count} onChange={(e) => setCount(Number(e.target.value))} fullWidth sx={{ mb: 2 }} />
					<Button variant='contained' onClick={handleGenerateQuestions} disabled={loading}>
						{loading ? <CircularProgress size={20} /> : 'Generate Questions'}
					</Button>
				</Box>
			)}

			{/* Create Question Manually */}
			{activeTab === 1 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant='h6'>Create Question</Typography>
					<TextField select label='Select Topic' value={selectedTopicId || ''} onChange={(e) => setSelectedTopicId(Number(e.target.value))} fullWidth sx={{ mb: 2 }}>
						{topics.map((topic) => (
							<MenuItem key={topic.id} value={topic.id}>
								{topic.title}
							</MenuItem>
						))}
					</TextField>
					<TextField label='Question Text' value={newQuestion.questionText} onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })} fullWidth sx={{ mb: 2 }} />
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField label='Option 1' value={newQuestion.option1} onChange={(e) => setNewQuestion({ ...newQuestion, option1: e.target.value })} fullWidth />
						</Grid>
						<Grid item xs={6}>
							<TextField label='Option 2' value={newQuestion.option2} onChange={(e) => setNewQuestion({ ...newQuestion, option2: e.target.value })} fullWidth />
						</Grid>
						<Grid item xs={6}>
							<TextField label='Option 3' value={newQuestion.option3} onChange={(e) => setNewQuestion({ ...newQuestion, option3: e.target.value })} fullWidth />
						</Grid>
						<Grid item xs={6}>
							<TextField label='Option 4' value={newQuestion.option4} onChange={(e) => setNewQuestion({ ...newQuestion, option4: e.target.value })} fullWidth />
						</Grid>
					</Grid>
					<TextField label='Correct Answer' value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} fullWidth sx={{ my: 2 }} />
					<Button variant='contained' onClick={handleAddQuestion}>
						Add Question
					</Button>
				</Box>
			)}

			{activeTab === 2 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant='h6'>Paste Text to Create Questions</Typography>
					<TextField select label='Select Topic' value={selectedTopicId || ''} onChange={(e) => setSelectedTopicId(Number(e.target.value))} fullWidth sx={{ mb: 2 }}>
						{topics.map((topic) => (
							<MenuItem key={topic.id} value={topic.id}>
								{topic.title}
							</MenuItem>
						))}
					</TextField>
					<TextField label='Paste Text' value={textInput} onChange={(e) => setTextInput(e.target.value)} multiline rows={4} fullWidth sx={{ mb: 2 }} />
					<Button variant='contained' onClick={handleCreateFromText} disabled={loading}>
						{loading ? <CircularProgress size={20} /> : 'Create from Text'}
					</Button>
				</Box>
			)}

			{/* Question List */}
			<Box sx={{ mt: 3 }}>
				<Typography variant='h6'>Questions</Typography>
				<List>
					{questions.map((q) => (
						<QuestionListItem key={q.id} question={q} />
					))}
				</List>
			</Box>

			{/* New Topic Modal */}
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', mt: 10, maxWidth: 400 }}>
					<Typography variant='h6'>Create New Topic</Typography>
					<TextField label='Topic Title' value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })} fullWidth sx={{ mb: 2 }} />
					<TextField label='Description' value={newTopic.description} onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })} fullWidth sx={{ mb: 2 }} />
					<Button variant='contained' component='label' sx={{ mb: 2 }}>
						Upload Image
						<input type='file' accept='image/*' hidden onChange={(e) => setNewTopic({ ...newTopic, imageFile: e.target.files?.[0] || new File([], '') })} />
					</Button>
					<Button variant='contained' onClick={handleCreateTopic} disabled={loading}>
						{loading ? <CircularProgress size={20} /> : 'Create Topic'}
					</Button>
				</Box>
			</Modal>

			{errorMessage && <Typography color='error'>{errorMessage}</Typography>}
		</Box>
	);
};

export default QuizzFactoryPage;
