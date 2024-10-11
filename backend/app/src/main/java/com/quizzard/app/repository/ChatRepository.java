package com.quizzard.app.repository;

import com.quizzard.app.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    Chat getChatsById(Long chatId);
}
