package org.pdm.backend.controller;

import jakarta.validation.Valid; 
import lombok.RequiredArgsConstructor;
import org.pdm.backend.model.Supplier; 
import org.pdm.backend.service.SupplierService; 
import org.pdm.backend.wrappers.Response; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    @GetMapping
    public ResponseEntity<Response> getAllSuppliers() {
        Response response = supplierService.getAllSuppliers();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Response> getSupplierById(@PathVariable Long id) {
        Response response = supplierService.getSupplierById(id);
        return ResponseEntity.ok(response);
    }
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<Response> createSupplier(@RequestBody @Valid Supplier supplier) {
        Response response = supplierService.createSupplier(supplier);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('MANAGER')")
    public ResponseEntity<Response> updateSupplier(@PathVariable Long id, @RequestBody @Valid Supplier supplier) {
        Response response = supplierService.updateSupplier(id, supplier);
        return ResponseEntity.ok(response);
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteSupplier(@PathVariable Long id) {
        Response response = supplierService.deleteSupplier(id);
        return ResponseEntity.ok(response);
    }
    }
}
