package com.quizzard.app.repository;

import com.quizzard.app.entity.Lobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LobbyRepository extends JpaRepository<Lobby, Long> {
}
