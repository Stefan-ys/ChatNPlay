package com.quizzard.app.repository;

import com.quizzard.app.domain.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByTopicId(long topicId);

    @Query(value = "SELECT * FROM questions LIMIT 1 OFFSET :offset", nativeQuery = true)
    Optional<Question> findRandomQuestion(long randomOffset);
}
