package com.quizzard.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quizzard.app.config.jwt.JwtUtil;
import com.quizzard.app.domain.dto.request.LoginRequestDTO;
import com.quizzard.app.domain.dto.request.RegisterRequestDTO;
import com.quizzard.app.domain.dto.response.UserResponseDTO;
import com.quizzard.app.security.CustomUserDetails;
import com.quizzard.app.security.CustomUserDetailsService;
import com.quizzard.app.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.security.test.context.support.WithMockUser;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequestDTO registerRequest;
    private LoginRequestDTO loginRequest;
    private UserResponseDTO userResponse;
    private CustomUserDetails userDetails;

    @BeforeEach
    void setup() {
        registerRequest = new RegisterRequestDTO();
        loginRequest = new LoginRequestDTO();
        userResponse = new UserResponseDTO();
        userDetails = new CustomUserDetails(1L, "username", "password", List.of());

        registerRequest.setUsername("testUser");
        registerRequest.setPassword("password123");

        loginRequest.setUsername("testUser");
        loginRequest.setPassword("password123");

        userResponse.setUsername("testUser");
    }

    @Test
    void register_whenValidationFails_thenReturnsBadRequest() throws Exception {
        BindingResult bindingResult = Mockito.mock(BindingResult.class);
        FieldError fieldError = new FieldError("registerRequestDTO", "username", "Invalid username");
        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$[0].message").value("Invalid username"));
    }

    @Test
    void register_whenValidRequest_thenReturnsUserResponse() throws Exception {
        when(authService.registerUser(any(RegisterRequestDTO.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testUser"));
    }

    @Test
    void login_whenValidCredentials_thenReturnsLoginResponseDTO() throws Exception {
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(userDetails)).thenReturn("testAccessToken");
        when(jwtUtil.generateRefreshToken(userDetails)).thenReturn("testRefreshToken");
        when(authService.loginUser(any(LoginRequestDTO.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("testAccessToken"))
                .andExpect(jsonPath("$.refreshToken").value("testRefreshToken"))
                .andExpect(jsonPath("$.user.username").value("testUser"));
    }

    @Test
    void login_whenInvalidCredentials_thenReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testUser\",\"password\":\"password123\"}")
                        .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logout_whenCalled_thenReturnsSuccessMessage() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .param("username", "testUser"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("User testUser successfully logged out!"));
    }

    @Test
    public void refreshToken_whenValidRefreshToken_thenReturnsNewTokens() throws Exception {
        Map<String, String> request = Map.of("requestRefreshToken", "valid-refresh-token");
        CustomUserDetails userDetails = new CustomUserDetails(1L, "testUser", "password123", List.of());

        when(jwtUtil.validateToken("valid-refresh-token")).thenReturn(true);
        when(jwtUtil.extractUsername("valid-refresh-token")).thenReturn("username");
        when(customUserDetailsService.loadUserByUsername("username")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("new-access-token");
        when(jwtUtil.generateRefreshToken(userDetails)).thenReturn("new-refresh-token");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.refreshToken").value("new-refresh-token"));
    }

    @Test
    void refreshToken_whenInvalidRefreshToken_thenReturnsUnauthorized() throws Exception {
        when(jwtUtil.validateToken("invalidRefreshToken")).thenReturn(false);

        mockMvc.perform(post("/api/auth/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("requestRefreshToken", "invalidRefreshToken"))))
                .andExpect(status().isUnauthorized())
                .andExpect(MockMvcResultMatchers.content().string("Invalid refresh token"));
    }

    @Test
    @WithMockUser(username = "username")
    public void logout_whenAuthenticated_thenReturnsOk() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(content().string("User username successfully logged out!"));
    }
}
