package org.pdm.backend.service;

import org.pdm.backend.model.Product;
import org.pdm.backend.wrappers.Response;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    Response saveProduct(Product product, MultipartFile imagefile);
    Response updateProduct(Product product, MultipartFile imagefile);
    Response getAllProducts();
    Response getProductById(Long id);
    Response searchProducts(String input);
    Response deleteProduct(Long id);
}
