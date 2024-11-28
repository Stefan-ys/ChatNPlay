package com.quizzard.app.service;

import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.quizzard.app.domain.dto.request.MyProfileRequestDTO;
import com.quizzard.app.domain.dto.response.UserLobbyResponseDTO;
import com.quizzard.app.domain.dto.response.UserResponseDTO;
import com.quizzard.app.domain.entity.Role;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.domain.enums.UserRoleEnum;
import com.quizzard.app.exception.InvalidFileTypeException;
import com.quizzard.app.exception.UserNotFoundException;
import com.quizzard.app.repository.RoleRepository;
import com.quizzard.app.repository.UserRepository;
import com.quizzard.app.util.FileValidationUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;
    private final FileValidationUtil fileValidationUtil;


    @Override
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO findByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return modelMapper.map(user.orElse(null), UserResponseDTO.class);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public String uploadAvatar(MultipartFile avatarFile) throws IOException {
        if (!fileValidationUtil.isValidImageFile(avatarFile)) {
            throw new InvalidFileTypeException("Invalid image file");
        }
        try {
            Bucket bucket = StorageClient.getInstance().bucket();
            String fileName = "avatars/" + UUID.randomUUID() + "_" + avatarFile.getOriginalFilename();
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8);
            return "https://firebasestorage.googleapis.com/v0/b/" + bucket.getName() + "/o/" + encodedFileName + "?alt=media";
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image file", e);
        }
    }

    @Override
    public UserResponseDTO updateProfile(Long userId, MyProfileRequestDTO myProfileRequestDTO) throws UserNotFoundException, IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        if (myProfileRequestDTO.getAvatar() != null && !myProfileRequestDTO.getAvatar().isEmpty()) {
            MultipartFile avatarFile = myProfileRequestDTO.getAvatar();
            String avatarUrl = uploadAvatar(avatarFile);
            user.setAvatarUrl(avatarUrl);
        }
        userRepository.save(user);
        return modelMapper.map(user, UserResponseDTO.class);
    }

    @Override
    public void addRole(Long userId, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        UserRoleEnum roleEnum = UserRoleEnum.valueOf(role.toUpperCase());
        Role roleToAdd = roleRepository.findByRole(roleEnum).orElseThrow(() -> new RuntimeException("Role not found!"));

        if (!user.getRoles().contains(roleToAdd)) {
            user.getRoles().add(roleToAdd);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User already has the role: " + role);
        }
    }

    @Override
    public void removeRole(Long userId, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        UserRoleEnum roleEnum = UserRoleEnum.valueOf(role.toUpperCase());
        Role roleToRemove = roleRepository.findByRole(roleEnum).orElseThrow(() -> new RuntimeException("Role not found!"));

        if (user.getRoles().contains(roleToRemove)) {
            user.getRoles().remove(roleToRemove);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User does not have the role: " + role);
        }
    }

    @Override
    public User findById(long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }
}
