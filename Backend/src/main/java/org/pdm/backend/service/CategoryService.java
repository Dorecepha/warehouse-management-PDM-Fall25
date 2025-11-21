package org.pdm.backend.service;

import org.pdm.backend.model.Category;
import org.pdm.backend.wrappers.Response;

public interface CategoryService {

    Response createCategory(Category category);

    Response getAllCategories(int page, int limit, String search);

    Response getCategoryById(Long id);

    Response updateCategory(Long id, Category categoryDetails);

    Response deleteCategory(Long id);
}