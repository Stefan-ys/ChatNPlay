package com.quizzard.app.controller;

import com.quizzard.app.config.jwt.JwtUtil;
import com.quizzard.app.dto.response.LoginResponseDTO;
import com.quizzard.app.security.CustomUserDetails;
import com.quizzard.app.service.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.quizzard.app.dto.request.LoginRequestDTO;
import com.quizzard.app.dto.request.RegisterRequestDTO;
import com.quizzard.app.dto.response.UserResponseDTO;
import com.quizzard.app.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO registerRequestDTO) {
        if (!registerRequestDTO.getPassword().equals(registerRequestDTO.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords and Confirm Password do not match");
        }

        UserResponseDTO userResponseDTO = authService.registerUser(registerRequestDTO);
        return ResponseEntity.ok(userResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        UserResponseDTO userResponseDTO = authService.loginUser(loginRequestDTO);

        if (userResponseDTO == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(new LoginResponseDTO(accessToken, refreshToken, userResponseDTO));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            Long userId = userDetails.getId();
            authService.onlineStatus(userId, false);
        }
        assert authentication != null;
        return ResponseEntity.ok("User " + authentication.getName() + " successfully logged out!");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestRefreshToken = request.get("requestRefreshToken");

        System.out.println("REFRESH !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        if (requestRefreshToken != null && jwtUtil.validateToken(requestRefreshToken)) {
            String username = jwtUtil.extractUsername(requestRefreshToken);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            String newAccessToken = jwtUtil.generateToken(userDetails);
            // Optionally generate a new refresh token as well
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

            // Return both tokens
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", newRefreshToken);
            return ResponseEntity.ok(tokens);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }


}

