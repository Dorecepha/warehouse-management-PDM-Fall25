package org.pdm.backend.repository;

import org.pdm.backend.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    Long deleteById(Long id);
    User save(User user);
    User update(User user);
    boolean existsByEmail(String email);
}
