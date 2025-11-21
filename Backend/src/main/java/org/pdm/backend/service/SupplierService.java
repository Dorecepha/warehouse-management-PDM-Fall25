package org.pdm.backend.service;

import org.pdm.backend.model.Supplier; 
import org.pdm.backend.wrappers.Response;

public interface SupplierService {
    Response getAllSuppliers(String input);
    Response getSupplierById(Long id);
    Response createSupplier(Supplier supplier);
    Response updateSupplier(Long id, Supplier supplier);
    Response deleteSupplier(Long id);
}
