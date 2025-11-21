package org.pdm.backend.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pdm.backend.exception.NotFoundException;
import org.pdm.backend.model.Category;
import org.pdm.backend.repository.CategoryRepository;
import org.pdm.backend.service.CategoryService;
import org.pdm.backend.wrappers.Response;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;



    @Override
    public Response createCategory(Category category) {
        categoryRepository.save(category);

        return Response.builder()
                .status(200)
                .message("Category Saved Successfully")
                .build();

    }

    @Override
    public Response getAllCategories(int page, int limit, String search) {
        // Fetch paginated + filtered categories
        List<Category> categoryList = categoryRepository.findAllFilteredPaged(search, page, limit);

        // Get count for pagination metadata
        long totalElements = categoryRepository.countFiltered(search);
        int totalPages = (int) Math.ceil((double) totalElements / limit);

        return Response.builder()
                .status(200)
                .message("success")
                .categories(categoryList)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();
    }

    @Override
    public Response getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));
        return Response.builder()
                .status(200)
                .message("success")
                .category(category)
                .build();
    }

    @Override
    public Response updateCategory(Long id, Category category) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        existingCategory.setName(category.getName());

        categoryRepository.save(existingCategory);

        return Response.builder()
                .status(200)
                .message("Category Was Successfully Updated")
                .build();

    }

    @Override
    public Response deleteCategory(Long id) {

        categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        categoryRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("Category Was Successfully Deleted")
                .build();
    }
}