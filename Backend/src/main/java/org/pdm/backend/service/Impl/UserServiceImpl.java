package org.pdm.backend.service.Impl;

import lombok.RequiredArgsConstructor;
import org.pdm.backend.enums.UserRole;
import org.pdm.backend.exception.InvalidCredentialsException;
import org.pdm.backend.exception.NotFoundException;
import org.pdm.backend.model.User;
import org.pdm.backend.repository.UserRepository;
import org.pdm.backend.security.JwtUtils;
import org.pdm.backend.service.UserService;
import org.pdm.backend.wrappers.LoginRequest;
import org.pdm.backend.wrappers.RegisterRequest;
import org.pdm.backend.wrappers.Response;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public Response registerUser(RegisterRequest registerRequest) {

        UserRole role = registerRequest.getRole() != null
                ? registerRequest.getRole()
                : UserRole.STAFF;

        User userToSave = new User();
        userToSave.setName(registerRequest.getName());
        userToSave.setEmail(registerRequest.getEmail());
        userToSave.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userToSave.setPhoneNumber(registerRequest.getPhoneNumber());
        userToSave.setRole(role);
        userToSave.setCreatedAt(LocalDateTime.now());

        userRepository.save(userToSave);

        return Response.builder()
                .status(200)
                .message("User was successfully registered")
                .user(userToSave)
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email Not Found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password Does Not Match");
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return Response.builder()
                .status(200)
                .message("User Logged in Successfully")
                .role(user.getRole())
                .token(token)
                .expirationTime("6 months")
                .user(user)
                .build();
    }

    @Override
    public Response getAllUsers() {

        List<User> users = userRepository.findAll();

        return Response.builder()
                .status(200)
                .message("Success")
                .users(users)
                .build();
    }

    @Override
    public User getCurrentLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User Not Found"));
    }

    @Override
    public Response getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        return Response.builder()
                .status(200)
                .message("Success")
                .user(user)
                .build();
    }

    @Override
    public Response updateUser(Long id, User userRequest) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        if (userRequest.getEmail() != null) existingUser.setEmail(userRequest.getEmail());
        if (userRequest.getPhoneNumber() != null) existingUser.setPhoneNumber(userRequest.getPhoneNumber());
        if (userRequest.getName() != null) existingUser.setName(userRequest.getName());
        if (userRequest.getRole() != null) existingUser.setRole(userRequest.getRole());

        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }

        userRepository.update(existingUser);

        return Response.builder()
                .status(200)
                .message("User successfully updated")
                .user(existingUser)
                .build();
    }

    @Override
    public Response deleteUser(Long id) {

        userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        userRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("User successfully deleted")
                .build();
    }

    @Override
    public Response getUserTransactions(Long id) {
        // assume a join or separate query in repository for this
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User Not Found"));

        // transactions fetched manually or left null for now
        return Response.builder()
                .status(200)
                .message("Success")
                .user(user)
                .build();
    }
}
