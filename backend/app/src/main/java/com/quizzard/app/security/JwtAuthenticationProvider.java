package com.quizzard.app.security;

import com.quizzard.app.config.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationProvider {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public UsernamePasswordAuthenticationToken authenticate(String token) {
        if (jwtUtil.validateToken(token)) {
            String username = jwtUtil.extractUsername(token);
            Long userId = jwtUtil.extractUserId(token);
            CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(username);

            if (userId.equals(userDetails.getId())) {
                return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            } else {
                throw new IllegalArgumentException("User ID in token does not match authenticated user ID");
            }
        }
        return null;
    }
}
