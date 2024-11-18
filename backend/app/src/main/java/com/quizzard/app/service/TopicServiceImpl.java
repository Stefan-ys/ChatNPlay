package com.quizzard.app.service;

import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.quizzard.app.domain.dto.request.TopicRequestDTO;
import com.quizzard.app.domain.dto.response.TopicResponseDTO;
import com.quizzard.app.domain.entity.Topic;
import com.quizzard.app.exception.InvalidFileTypeException;
import com.quizzard.app.repository.TopicRepository;
import com.quizzard.app.util.FileValidationUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final ModelMapper modelMapper;
    private final FileValidationUtil fileValidationUtil;

    @Transactional
    @Override
    public void createTopic(TopicRequestDTO topicRequestDTO) throws IOException {
        Topic topic = modelMapper.map(topicRequestDTO, Topic.class);
        topic.setImageUrl(uploadImage(topicRequestDTO.getImageFile()));
        topicRepository.save(topic);
    }

    @Override
    public TopicResponseDTO getTopicById(long topicId) {
        Topic topic = topicRepository.findById(topicId).orElseThrow(
                () -> new IllegalArgumentException("Topic not found with id: " + topicId)
        );
        return modelMapper.map(topic, TopicResponseDTO.class);
    }

    @Transactional
    @Override
    public void updateTopic(long topicId, TopicRequestDTO topicRequestDTO) throws IOException {
        Topic topic = topicRepository.findById(topicId).orElseThrow(
                () -> new IllegalArgumentException("Topic not found with id: " + topicId)
        );

        topic.setTitle(topicRequestDTO.getTitle());
        topic.setDescription(topicRequestDTO.getDescription());
        if (topicRequestDTO.getImageFile() != null && !topicRequestDTO.getImageFile().isEmpty()) {
            topic.setImageUrl(uploadImage(topicRequestDTO.getImageFile()));
        }
    }

    @Override
    public void deleteTopic(long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found with id: " + topicId));
        topicRepository.delete(topic);
    }

    @Override
    public List<TopicResponseDTO> getAllTopics() {
        return topicRepository.findAll().stream()
                .map(topic -> modelMapper.map(topic, TopicResponseDTO.class))
                .collect(Collectors.toList());
    }

    private String uploadImage(MultipartFile imageFile) throws IOException {
        if (!fileValidationUtil.isValidImageFile(imageFile)) {
            throw new InvalidFileTypeException("Invalid image file");
        }
        try {
            Bucket bucket = StorageClient.getInstance().bucket();
            String fileName = "topics/" + UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8);
            return "https://firebasestorage.googleapis.com/v0/b/" + bucket.getName() + "/o/" + encodedFileName + "?alt=media";
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image file", e);
        }
    }
}
