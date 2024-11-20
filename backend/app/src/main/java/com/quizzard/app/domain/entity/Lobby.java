package com.quizzard.app.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lobbies")
public class Lobby extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @OneToOne()
    @JoinColumn(name = "chat_id")
    private Chat chat;
}
