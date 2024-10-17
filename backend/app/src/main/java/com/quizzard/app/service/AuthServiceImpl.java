package com.quizzard.app.service;

import com.quizzard.app.dto.request.LoginRequestDTO;
import com.quizzard.app.dto.request.RegisterRequestDTO;
import com.quizzard.app.dto.response.UserResponseDTO;
import com.quizzard.app.entity.Role;
import com.quizzard.app.entity.User;
import com.quizzard.app.enums.UserRoleEnum;
import com.quizzard.app.exception.UserNotFoundException;
import com.quizzard.app.repository.RoleRepository;
import com.quizzard.app.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.HashSet;


@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;


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
