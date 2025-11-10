package org.pdm.backend.service;


import org.pdm.backend.model.User;
import org.pdm.backend.wrappers.LoginRequest;
import org.pdm.backend.wrappers.RegisterRequest;
import org.pdm.backend.wrappers.Response;

public interface UserService {
    Response registerUser(RegisterRequest registerRequest);

    Response loginUser(LoginRequest loginRequest);

    Response getAllUsers();

    User getCurrentLoggedInUser();

    Response getUserById(Long id);

    Response updateUser(Long id, User user);

    Response deleteUser(Long id);

    Response getUserTransactions(Long id);
}