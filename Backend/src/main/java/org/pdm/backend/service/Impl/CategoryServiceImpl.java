package org.pdm.backend.service.Impl;

import org.pdm.backend.model.Category;
import org.pdm.backend.repository.CategoryRepository;
import org.pdm.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired 
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id); 

        if (categoryDetails.getName() != null && !categoryDetails.getName().isEmpty()) {
            category.setName(categoryDetails.getName()); 
        }

        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        getCategoryById(id); // Ensure category exists, throws if not found
        categoryRepository.deleteById(id);
    }
}