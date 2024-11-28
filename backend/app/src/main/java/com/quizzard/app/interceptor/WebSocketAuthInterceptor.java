package com.quizzard.app.interceptor;

import com.quizzard.app.security.CustomPrincipal;
import com.quizzard.app.security.JwtAuthenticationProvider;
import com.quizzard.app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    @Override
    public Message<?> preSend(@NotNull Message<?> message, @NotNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);

                UsernamePasswordAuthenticationToken authentication = jwtAuthenticationProvider.authenticate(token);
                if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {

                    CustomPrincipal customPrincipal = new CustomPrincipal(userDetails.getUsername(), userDetails.getId());

                    UsernamePasswordAuthenticationToken authWithPrincipal =
                            new UsernamePasswordAuthenticationToken(customPrincipal, null, userDetails.getAuthorities());

                    accessor.setUser(customPrincipal);
                    SecurityContextHolder.getContext().setAuthentication(authWithPrincipal);
                }
            }
        } else {
            assert accessor != null;
            if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                SecurityContextHolder.clearContext();
            }
        }

        return message;
    }
}
