package com.quizzard.app.repository;

import com.quizzard.app.domain.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    boolean existsByTitle(String title);

    Optional<Topic> findTopicByTitle(String title);
}
