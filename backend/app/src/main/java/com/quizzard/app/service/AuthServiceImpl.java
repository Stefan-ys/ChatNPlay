package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.LoginRequestDTO;
import com.quizzard.app.domain.dto.request.RegisterRequestDTO;
import com.quizzard.app.domain.dto.response.UserResponseDTO;
import com.quizzard.app.domain.entity.Role;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.domain.enums.UserRoleEnum;
import com.quizzard.app.repository.RoleRepository;
import com.quizzard.app.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.HashSet;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;


    @Override
    public UserResponseDTO registerUser(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByUsername(registerRequestDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = modelMapper.map(registerRequestDTO, User.class);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = new HashSet<>();
        Optional<Role> userRole = roleRepository.findByRole(UserRoleEnum.USER);
        userRole.ifPresent(roles::add);

        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser, UserResponseDTO.class);
    }

    @Override
    public UserResponseDTO loginUser(LoginRequestDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if(!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return modelMapper.map(user, UserResponseDTO.class);
    }

}
