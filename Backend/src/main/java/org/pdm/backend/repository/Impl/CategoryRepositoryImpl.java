package org.pdm.backend.repository.Impl;

import org.pdm.backend.model.Category;
import org.pdm.backend.repository.CategoryRepository;
import org.pdm.backend.security.DatabaseConfig;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository {

    private final JdbcTemplate jdbcTemplate = new JdbcTemplate(DatabaseConfig.getDataSource());

    private final RowMapper<Category> mapRowToCategories = (rs, rowNum) -> {
        Category category = new Category();
        category.setId(rs.getLong("id"));
        category.setName(rs.getString("name"));
        return category;
    };

    @Override
    public Category save(Category category) {
        if (category.getId() == null) {
            String sql = "INSERT INTO categories (name) VALUES (?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, category.getName());
                return ps;
            }, keyHolder);
            Number key = keyHolder.getKey();
            if (key != null) {
                category.setId(key.longValue());
            }
            return category;
        } else {
            String sql = "UPDATE categories SET name = ? WHERE id = ?";
            jdbcTemplate.update(sql, category.getName(), category.getId());
            return category;
        }
    }

    @Override
    public Optional<Category> findById(Long id) {
        String sql = "SELECT id, name FROM categories WHERE id = ?";
        List<Category> results = jdbcTemplate.query(sql, mapRowToCategories, id);
        if (results.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(results.get(0));
    }

    @Override
    public List<Category> findAll() {
        String sql = "SELECT id, name FROM categories";
        return jdbcTemplate.query(sql, mapRowToCategories);
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM categories WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public Category findByName(String name) {
        String sql = "SELECT id, name FROM categories WHERE name = ?";
        List<Category> results = jdbcTemplate.query(sql, mapRowToCategories, name);
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public List<Category> findAllFilteredPaged(String filter, int page, int size) {
        boolean noFilter = (filter == null || filter.isBlank());
        String sql;

        if (noFilter) {
            sql = "SELECT id, name FROM categories ORDER BY id DESC LIMIT ? OFFSET ?";
            return jdbcTemplate.query(sql, mapRowToCategories, size, (page - 1) * size);
        } else {
            sql = "SELECT id, name FROM categories WHERE name LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?";
            String pattern = "%" + filter + "%";
            return jdbcTemplate.query(sql, mapRowToCategories, pattern, size, (page - 1) * size);
        }
    }

    @Override
    public long countFiltered(String filter) {
        boolean noFilter = (filter == null || filter.isBlank());
        String sql;

        if (noFilter) {
            sql = "SELECT COUNT(*) FROM categories";
            Long count = jdbcTemplate.queryForObject(sql, Long.class);
            return count != null ? count : 0;
        } else {
            sql = "SELECT COUNT(*) FROM categories WHERE name LIKE ?";
            String pattern = "%" + filter + "%";
            Long count = jdbcTemplate.queryForObject(sql, Long.class, pattern);
            return count != null ? count : 0;
        }
    }
    
}