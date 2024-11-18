package com.quizzard.app.service;


import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.quizzard.app.domain.dto.request.QuestionRequestDTO;
import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import com.quizzard.app.domain.entity.Question;
import com.quizzard.app.domain.entity.Topic;
import com.quizzard.app.exception.InvalidFileTypeException;
import com.quizzard.app.repository.QuestionRepository;
import com.quizzard.app.repository.TopicRepository;
import com.quizzard.app.util.FileValidationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final ModelMapper modelMapper;
    private final FileValidationUtil fileValidationUtil;

    @Transactional
    @Override
    public void createQuestion(QuestionRequestDTO questionRequestDTO) throws IOException {
        Question question = modelMapper.map(questionRequestDTO, Question.class);
        Topic topic = topicRepository.findById(questionRequestDTO.getTopicId())
                .orElseThrow(() -> new IllegalArgumentException("No topic found with id:" + questionRequestDTO.getTopicId()));
        question.setTopic(topic);
        questionRepository.save(question);
    }

    @Transactional
    @Override
    public void createQuestionFromText(String text) {
        //TODO
    }

    @Override
    public QuestionResponseDTO getQuestionById(long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));
        return modelMapper.map(question, QuestionResponseDTO.class);
    }

    @Override
    public List<QuestionResponseDTO> getQuestionsByTopicId(long topicId) {
        List<Question> questions = questionRepository.findByTopicId(topicId);
        return questions.stream()
                .map(question -> modelMapper.map(question, QuestionResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void updateQuestion(Long questionId, QuestionRequestDTO questionRequestDTO) {
        Question existingQuestion = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));

        existingQuestion.setQuestionText(questionRequestDTO.getQuestionText());
        existingQuestion.setOption1(questionRequestDTO.getOption1());
        existingQuestion.setOption2(questionRequestDTO.getOption2());
        existingQuestion.setOption3(questionRequestDTO.getOption3());
        existingQuestion.setOption4(questionRequestDTO.getOption4());
        existingQuestion.setCorrectAnswer(questionRequestDTO.getCorrectAnswer());

        questionRepository.save(existingQuestion);
    }

    @Override
    public void deleteQuestion(long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));
        questionRepository.delete(question);
    }

    private String uploadImage(MultipartFile imageFile) throws IOException {
        if (!fileValidationUtil.isValidImageFile(imageFile)) {
            throw new InvalidFileTypeException("Invalid image file");
        }
        try {
            Bucket bucket = StorageClient.getInstance().bucket();
            String fileName = "questions/" + UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8);
            return "https://firebasestorage.googleapis.com/v0/b/" + bucket.getName() + "/o/" + encodedFileName + "?alt=media";
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image file", e);
        }
    }
}
