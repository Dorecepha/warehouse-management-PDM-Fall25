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

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> addSupplier(@RequestBody @Valid Supplier supplier) {
        return ResponseEntity.ok(supplierService.createSupplier(supplier));
    }


    @GetMapping("/all")
    public ResponseEntity<Response> getAllSuppliers(@RequestParam(required = false) String input) {
        return ResponseEntity.ok(supplierService.getAllSuppliers(input));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateSupplier(@PathVariable Long id, @RequestBody @Valid Supplier supplier) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteSupplier(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.deleteSupplier(id));
    }
}