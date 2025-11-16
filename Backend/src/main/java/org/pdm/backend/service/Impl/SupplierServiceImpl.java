package org.pdm.backend.service.Impl;

import lombok.RequiredArgsConstructor;

import org.pdm.backend.exception.NameValueRequiredException; 
import org.pdm.backend.exception.NotFoundException; 
import org.pdm.backend.model.Supplier;
import org.pdm.backend.repository.SupplierRepository;
import org.pdm.backend.service.SupplierService; 
import org.pdm.backend.wrappers.Response; 
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;

    @Override
    public Response getAllSuppliers(){
        List<Supplier> suppliers = supplierRepository.findAll();
        return Response.builder()
                .status(200) 
                .message("Success")
                .suppliers(suppliers) 
                .build();
    }
    @Override
    public Response getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("SUPPLIER NOT FOUND WITH ID: " + id));
        return Response.builder()
                .status(200)
                .message("Success")
                .supplier(supplier) 
                .build();

    }
    @Override
    public Response createSupplier(Supplier savedSupplier){
        if (savedSupplier.getName() == null || savedSupplier.getName().isBlank()){
            throw new NameValueRequiredException("Supplier name is required");
        }
        return Response.builder()
                .status(200)
                .message("SUCCESSED!")
                .supplier(savedSupplier)
                .build();
    }
    @Override
    public Response updateSupplier(Long id, Supplier supplierRequest) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("SUPPLIER NOT FOUND WITH ID: " + id));
        if(supplierRequest.getName() != null){
            existingSupplier.setName(supplierRequest.getName());
        }
        if (supplierRequest.getContactInfo() != null) {
            existingSupplier.setContactInfo(supplierRequest.getContactInfo());
        }
        if (supplierRequest.getAddress() != null) {
            existingSupplier.setAddress(supplierRequest.getAddress());
        }
        Supplier updatedSupplier = supplierRepository.update(existingSupplier);

        return Response.builder()
                .status(200)
                .message("Supplier updated successfully")
                .supplier(updatedSupplier)
                .build();
    }
    @Override
    public Response deleteSupplier(Long id) {
        supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + id));
        supplierRepository.deleteById(id);
        return Response.builder()
                .status(200)
                .message("Supplier deleted successfully")
                .build();
    }
}
