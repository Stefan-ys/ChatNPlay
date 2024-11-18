package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.TopicRequestDTO;
import com.quizzard.app.domain.dto.response.TopicResponseDTO;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

public interface TopicService {
    @Transactional
    void createTopic(TopicRequestDTO topicRequestDTO) throws IOException;

    TopicResponseDTO getTopicById(long topicId);

    @Transactional
    void updateTopic(long topicId, TopicRequestDTO topicRequestDTO) throws IOException;

    void deleteTopic(long topicId);

    List<TopicResponseDTO> getAllTopics();
}
