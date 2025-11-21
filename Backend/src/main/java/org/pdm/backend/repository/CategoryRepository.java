package org.pdm.backend.repository;

import org.pdm.backend.model.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository {
    Category save(Category category);
    Optional<Category> findById(Long id);
    List<Category> findAll();
    void deleteById(Long id);
    Category findByName(String name);
    List<Category> findAllFilteredPaged(String filter, int page, int size);
    long countFiltered(String filter);
}