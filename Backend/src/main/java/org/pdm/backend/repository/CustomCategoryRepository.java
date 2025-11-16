package org.pdm.backend.repository;

import java.util.List;

import org.pdm.backend.model.Category;

public interface CustomCategoryRepository {

    List<Category> findCategoriesWithManyProducts(int minProducts);

}
 