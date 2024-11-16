import React, { useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import { generateQuestions } from '../services/openAi.service';
import { QuestionResponse } from '../types/question.type';

const QuizzFactoryPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [topic, setTopic] = useState('');
	const [count, setCount] = useState(1);
	const [questions, setQuestions] = useState<QuestionResponse[]>([]);
	const [newQuestion, setNewQuestion] = useState<QuestionResponse>({
		id: -1,
		topic: '',
		questionText: '',
		imageUrl: '',
		option1: '',
		option2: '',
		option3: '',
		option4: '',
		correctAnswer: '',
	});

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	const handleGenerateQuestions = async () => {
		try {
			const generatedQuestions = await generateQuestions({topic, count});
			setQuestions([...questions, ...generatedQuestions]);
		} catch (error) {
			console.error('Error generating questions:', error);
		}
	};

	const handleAddQuestion = () => {
		setQuestions((prev) => [...prev, { ...newQuestion, id: prev.length + 1 }]);
		setNewQuestion({
			id: -1,
			topic: '',
			questionText: '',
			imageUrl: '',
			option1: '',
			option2: '',
			option3: '',
			option4: '',
			correctAnswer: '',
		});
	};

	return (
		<Box sx={{ maxWidth: '800px', margin: 'auto', mt: 4 }}>
			<Tabs value={activeTab} onChange={handleTabChange} centered>
				<Tab label='Generate Questions (OpenAI)' />
				<Tab label='Create Question Manually' />
			</Tabs>
			{activeTab === 0 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant='h6'>Generate Questions</Typography>
					<TextField label='Topic' value={topic} onChange={(e) => setTopic(e.target.value)} fullWidth sx={{ mb: 2 }} />
					<TextField label='Number of Questions' type='number' value={count} onChange={(e) => setCount(Number(e.target.value))} fullWidth sx={{ mb: 2 }} />
					<Button variant='contained' color='primary' onClick={handleGenerateQuestions}>
						Generate Questions
					</Button>
					<List sx={{ mt: 3 }}>
						{questions.map((q, index) => (
							<ListItem key={index}>
								<ListItemText primary={q.questionText} secondary={`Options: ${q.option1}, ${q.option2}, ${q.option3}, ${q.option4}`} />
							</ListItem>
						))}
					</List>
				</Box>
			)}
			{activeTab === 1 && (
				<Box sx={{ mt: 3 }}>
					<Typography variant='h6'>Create Question Manually</Typography>
					<TextField
						label='Question Text'
						value={newQuestion.questionText}
						onChange={(e) =>
							setNewQuestion({
								...newQuestion,
								questionText: e.target.value,
							})
						}
						fullWidth
						sx={{ mb: 2 }}
					/>
					<TextField
						label='Image URL'
						value={newQuestion.imageUrl}
						onChange={(e) =>
							setNewQuestion({
								...newQuestion,
								imageUrl: e.target.value,
							})
						}
						fullWidth
						sx={{ mb: 2 }}
					/>
					<Grid container spacing={2}>
						{['option1', 'option2', 'option3', 'option4'].map((option, idx) => (
							<Grid item xs={6} key={option}>
								<TextField
									label={`Option ${idx + 1}`}
									value={newQuestion[option as keyof QuestionResponse] as string}
									onChange={(e) =>
										setNewQuestion({
											...newQuestion,
											[option]: e.target.value,
										})
									}
									fullWidth
								/>
							</Grid>
						))}
					</Grid>
					<TextField
						label='Correct Answer'
						value={newQuestion.correctAnswer}
						onChange={(e) =>
							setNewQuestion({
								...newQuestion,
								correctAnswer: e.target.value,
							})
						}
						fullWidth
						sx={{ my: 2 }}
					/>
					<Button variant='contained' color='primary' onClick={handleAddQuestion}>
						Add Question
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default QuizzFactoryPage;
