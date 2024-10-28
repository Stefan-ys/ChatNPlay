package com.quizzard.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.HashSet;


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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "lobby_users",
            joinColumns = @JoinColumn(name = "lobby_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();
}
