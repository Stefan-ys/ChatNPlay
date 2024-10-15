package com.quizzard.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lobbies")
public class Lobby extends BaseEntity {

    @Column()
    private String name;

    @OneToOne
    private Chat chat;

    @OneToMany(mappedBy = "lobby", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users = new ArrayList<>();
}
