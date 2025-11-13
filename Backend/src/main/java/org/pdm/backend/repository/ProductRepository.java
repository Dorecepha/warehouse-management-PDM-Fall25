package org.pdm.backend.repository;

import org.pdm.backend.model.Product;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository {
    Product save(Product productToSave); 
    Product update(Product productToUpdate);
    List<Product> findAll();
    Product findById(Long id);
    List<Product> findByNameContainingOrDescriptionContaining(String name, String description);
    Long deleteById(Long id);
}
