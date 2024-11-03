package com.quizzard.app.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;

@AllArgsConstructor
@Getter
public class CustomPrincipal implements Principal {

    private final String name;
    private final Long id;
}
