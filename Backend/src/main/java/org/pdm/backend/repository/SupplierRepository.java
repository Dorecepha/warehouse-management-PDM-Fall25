package org.pdm.backend.repository;

import org.pdm.backend.model.Supplier;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface SupplierRepository {
    Optional<Supplier> findById(Long id);
    List<Supplier> findAll();
    Supplier save(Supplier supplierToSave);
    Supplier update(Supplier supplierToUpdate);
    Long deleteById(Long id);
    List<Supplier> searchSupplierByAnything(String input);
}

