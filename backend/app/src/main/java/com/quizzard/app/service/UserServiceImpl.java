package com.quizzard.app.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.quizzard.app.dto.UserProfileUpdateDTO;
import com.quizzard.app.dto.UserResponseDTO;
import com.quizzard.app.entity.User;
import com.quizzard.app.exception.InvalidFileTypeException;
import com.quizzard.app.exception.UserNotFoundException;
import com.quizzard.app.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;


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
        if (!isValidImageFile(avatarFile)) {
            throw new InvalidFileTypeException("Invalid image file");
        }

        Bucket bucket = StorageClient.getInstance().bucket();

        String fileName = UUID.randomUUID() + "_" + avatarFile.getOriginalFilename();

        Blob blob = bucket.create(fileName, avatarFile.getBytes(), avatarFile.getContentType());

        return blob.getMediaLink();
    }


    private boolean isValidImageFile(MultipartFile avatarFile) {
        String contentType = avatarFile.getContentType();
        assert contentType != null;
        return contentType.equals("image/jpeg") || contentType.equals("image/png");
    }

    @Override
    public void updateProfile(Long userId, UserProfileUpdateDTO userProfileUpdateDTO) throws UserNotFoundException, IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        if (userProfileUpdateDTO.getAvatar() != null && !userProfileUpdateDTO.getAvatar().isEmpty()) {
            MultipartFile avatarFile = userProfileUpdateDTO.getAvatar();
            String avatarUrl = uploadAvatar(avatarFile);
            user.setAvatarUrl(avatarUrl);
        }

        userRepository.save(user);
    }
}
