package com.quizzard.app.interceptor;

import com.quizzard.app.security.JwtAuthenticationProvider;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    @Autowired
    public WebSocketAuthInterceptor(JwtAuthenticationProvider jwtAuthenticationProvider) {
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }

    @Override
    public Message<?> preSend(@NotNull Message<?> message, @NotNull MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        System.out.println("STOMP command: " + accessor.getCommand());

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                UsernamePasswordAuthenticationToken authentication = getAuthenticationFromToken(token);
                System.out.println("Extracted authentication: " + authentication);
                if (authentication != null) {
                    accessor.setUser(authentication);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
                    System.out.println("Authentication set in SecurityContext.");
                } else {
                    System.out.println("Authentication is null after token validation.");
                }
            } else {
                System.out.println("No valid Authorization header found.");
            }
        } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            SecurityContextHolder.clearContext();
        }

        return message;
    }


    private UsernamePasswordAuthenticationToken getAuthenticationFromToken(String token) {
        return jwtAuthenticationProvider.authenticate(token);
    }
}
