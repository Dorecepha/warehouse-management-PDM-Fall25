package org.pdm.backend.repository.Impl;

import org.pdm.backend.model.User;
import org.pdm.backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

public class UserRepositoryImpl implements UserRepository {

    @Override
    public Optional<User> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public List<User> findAll() {
        return List.of();
    }

    @Override
    public Long deleteById(Long id) {
        return 0L;
    }

    @Override
    public User save(User user) {
        return null;
    }

    @Override
    public boolean existsByEmail(String email) {
        return false;
    }
}
