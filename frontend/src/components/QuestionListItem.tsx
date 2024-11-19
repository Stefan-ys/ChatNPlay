import React from 'react';
import { ListItem, ListItemText, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { QuestionResponse } from '../types/question.type';

interface QuestionListItemProps {
	question: QuestionResponse;
	loading: boolean;
	onSave: (id: number) => void;
	onRemove: (id: number) => void;
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({ question, loading, onSave, onRemove }) => (
	<ListItem>
		<ListItemText
			primary={question.questionText}
			secondary={
				<>
					<Typography variant='body2'>
						<strong>Topic:</strong> {question.topicTitle}
					</Typography>
					<Typography variant='body2'>
						Options: {question.option1}, {question.option2}, {question.option3}, {question.option4}
					</Typography>
					<Typography variant='body2'>
						<strong>Correct Answer:</strong> {question.correctAnswer}
					</Typography>
				</>
			}
		/>
		{question.saved ? (
			<Typography variant='body2' color='green'>
				Saved
			</Typography>
		) : (
			<>
				<IconButton onClick={() => onSave(question.id)} disabled={loading}>
					<SaveIcon />
				</IconButton>
				<IconButton onClick={() => onRemove(question.id)} disabled={loading}>
					<DeleteIcon />
				</IconButton>
			</>
		)}
	</ListItem>
);

export default QuestionListItem;
