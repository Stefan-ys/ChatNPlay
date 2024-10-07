package com.quizzard.app.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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

    @OneToOne
    private Chat chat;

    @OneToMany(mappedBy = "lobby")
    private Set<User> users = new HashSet<>();
}
