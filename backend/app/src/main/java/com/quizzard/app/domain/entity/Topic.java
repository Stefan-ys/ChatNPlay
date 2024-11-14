package com.quizzard.app.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "topics")
public class Topic extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String title;
    @Column
    private String imageUrl;
    @Column(columnDefinition = "LONGTEXT")
    private String description;
}
