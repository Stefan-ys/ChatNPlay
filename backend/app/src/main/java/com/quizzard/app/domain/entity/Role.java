package com.quizzard.app.domain.entity;

import com.quizzard.app.domain.enums.UserRoleEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "roles")
public class Role extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRoleEnum role;
}
