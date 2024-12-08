import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, Button, LinearProgress } from '@mui/material';
import { QuestionResponse } from '../types/question.type';

interface QuestionModalProps {
	open: boolean;
	question: QuestionResponse;
	onClose: () => void;
	timeLimit: number;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ open, question, onClose, timeLimit }) => {
	const [timeLeft, setTimeLeft] = useState(timeLimit);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [showFeedback, setShowFeedback] = useState(false);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

	useEffect(() => {
		if (open) {
			const options = [question.option1, question.option2, question.option3, question.option4];
			setShuffledOptions(options.sort(() => Math.random() - 0.5));
			setTimeLeft(timeLimit);
			setSelectedOption(null);
			setShowFeedback(false);
			setIsCorrect(null);
		}
	}, [open, question, timeLimit]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (open && timeLeft > 0) {
			timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
		} else if (timeLeft === 0) {
			handleSubmit();
		}
		return () => clearTimeout(timer);
	}, [open, timeLeft]);

	const handleOptionSelect = (option: string) => {
		if (!showFeedback) {
			setSelectedOption(option);
		}
	};

	const handleSubmit = () => {
		if (showFeedback) return;

		const correct = question.correctAnswer;
		const isAnswerCorrect = selectedOption === correct;

		setIsCorrect(isAnswerCorrect);
		setShowFeedback(true);

		setTimeout(() => {
			onClose();
		}, 3000);
	};

	const progress = (timeLeft / timeLimit) * 100;

	const getOptionStyles = (option: string) => {
		if (showFeedback) {
			if (option === question.correctAnswer) {
				return { border: '3px solid green' };
			} else if (option === selectedOption) {
				return {
					animation: 'flash-red 0.6s infinite',
				};
			}
		} else if (selectedOption === option) {
			return { border: '3px solid orange' };
		}
		return {};
	};

	const getFlashEffect = () => {
		if (!showFeedback || isCorrect === null) return {};
		return {
			animation: isCorrect ? 'flash-green 0.6s infinite' : '',
		};
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '400px',
					backgroundImage: `url(${question.topic.imageUrl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					borderRadius: '16px',
					boxShadow: 24,
					overflow: 'hidden',
					color: 'white',
					...getFlashEffect(),
				}}
			>
				{/* Time Limit Bar */}
				<Box sx={{ width: '100%', position: 'relative' }}>
					<LinearProgress
						variant='determinate'
						value={progress}
						sx={{
							'height': '8px',
							'backgroundColor': 'rgba(255, 255, 255, 0.2)',
							'& .MuiLinearProgress-bar': {
								backgroundColor: 'red',
								transformOrigin: 'center',
								transform: `scaleX(${progress / 100})`,
							},
						}}
					/>
				</Box>

				{/* Content Container */}
				<Box
					sx={{
						padding: '20px',
						backdropFilter: 'blur(8px)',
						backgroundColor: 'rgba(0, 0, 0, 0.6)',
					}}
				>
					<Typography variant='h6' sx={{ mb: 2 }}>
						{question.questionText}
					</Typography>

					{/* Options Grid */}
					<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
						{shuffledOptions.map((option, index) => (
							<Button
								key={index}
								variant='contained'
								color='secondary'
								onClick={() => handleOptionSelect(option)}
								sx={{
									height: '40px',
									...getOptionStyles(option),
								}}
							>
								{option}
							</Button>
						))}
					</Box>

					{/* Feedback Message */}
					{showFeedback && (
						<Typography
							variant='h6'
							sx={{
								mt: 2,
								textAlign: 'center',
								color: isCorrect ? 'green' : 'red',
							}}
						>
							{isCorrect ? 'CORRECT ANSWER!!!' : 'WRONG ANSWER'}
						</Typography>
					)}

					{/* Submit Button */}
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
						<Button variant='contained' color='primary' onClick={handleSubmit} disabled={!selectedOption || showFeedback}>
							Submit
						</Button>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default QuestionModal;
