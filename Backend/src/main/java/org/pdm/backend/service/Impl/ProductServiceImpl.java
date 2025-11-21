package org.pdm.backend.service.Impl;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.pdm.backend.exception.NotFoundException;
import org.pdm.backend.model.Category;
import org.pdm.backend.model.Product;
import org.pdm.backend.repository.CategoryRepository;
import org.pdm.backend.repository.ProductRepository;
import org.pdm.backend.service.ProductService;
import org.pdm.backend.wrappers.Response;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.nio.file.Paths;
import java.nio.file.Path;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
@RequiredArgsConstructor
@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;


    @Override
    public Response saveProduct(Product product, MultipartFile imageFile) {

        // validate category
        Category category = categoryRepository.findById(product.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));

        // create product object to save
        Product productToSave = new Product();
        productToSave.setName(product.getName());
        productToSave.setSku(product.getSku());
        productToSave.setPrice(product.getPrice());
        productToSave.setStockQuantity(product.getStockQuantity());
        productToSave.setDescription(product.getDescription());
        productToSave.setCategoryId(category.getId());

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            productToSave.setImageUrl(imagePath);
        }

        productRepository.save(productToSave);

        return Response.builder()
                .status(200)
                .message("Product was successfully saved")
                .build();
    }

    @Override
    public Response updateProduct(Product product, MultipartFile imageFile) {

        Product existingProduct = productRepository.findById(product.getId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        // update image
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            existingProduct.setImageUrl(imagePath);
        }

        // update category
        if (product.getCategoryId() != null && product.getCategoryId() > 0) {
            Category category = categoryRepository.findById(product.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            existingProduct.setCategoryId(category.getId());
        }

        // update fields
        if (product.getName() != null && !product.getName().isBlank()) {
            existingProduct.setName(product.getName());
        }
        if (product.getSku() != null && !product.getSku().isBlank()) {
            existingProduct.setSku(product.getSku());
        }
        if (product.getDescription() != null && !product.getDescription().isBlank()) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getPrice() != null && product.getPrice().compareTo(BigDecimal.ZERO) >= 0) {
            existingProduct.setPrice(product.getPrice());
        }
        if (product.getStockQuantity() != null && product.getStockQuantity() >= 0) {
            existingProduct.setStockQuantity(product.getStockQuantity());
        }

        productRepository.update(existingProduct);

        return Response.builder()
                .status(200)
                .message("Product was successfully updated")
                .build();
    }

    @Override
    public Response getAllProducts() {

        List<Product> products = productRepository.findAll();

        return Response.builder()
                .status(200)
                .message("success")
                .products(products)
                .build();
    }

    @Override
    public Response getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        return Response.builder()
                .status(200)
                .message("success")
                .product(product)
                .build();
    }

    @Override
    public Response deleteProduct(Long id) {

        productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        productRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("Product Deleted successfully")
                .build();
    }

    @Override
    public Response searchProducts(String input) {

        List<Product> products = productRepository.findByNameContainingOrDescriptionContaining(input, input);

        if (products.isEmpty()) {
            throw new NotFoundException("Product Not Found");
        }

        return Response.builder()
                .status(200)
                .message("success")
                .products(products)
                .build();
    }

    // Save image to folder
    private String saveImage(MultipartFile imageFile) {
        // Validate image
        if (!imageFile.getContentType().startsWith("image/") || imageFile.getSize() > 1024 * 1024 * 1024) {
            throw new IllegalArgumentException("Only image files under 1GB are allowed");
        }

        // 1. Get the current working directory (where the app is running)
        Path currentPath = Paths.get(System.getProperty("user.dir"));

        // 2. Check context: If we are running inside the 'backend' folder, go up one level.
        //    If we are in the project root (IMS-react), stay there.
        if (currentPath.endsWith("backend")) {
            currentPath = currentPath.getParent();
        }

        // 3. Construct the full path to frontend/public/products
        Path imageDir = currentPath.resolve("frontend").resolve("public").resolve("products");

        // 4. Create the directory if it doesn't exist
        File directory = imageDir.toFile();
        if (!directory.exists()) {
            boolean created = directory.mkdirs(); // mkdirs() creates parent folders too if missing
            if(created) log.info("Directory was created: " + directory.getAbsolutePath());
        }

        // 5. Generate unique file name
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

        // 6. Combine directory path and filename
        Path destinationPath = imageDir.resolve(uniqueFileName);

        try {
            // Transfer the file
            imageFile.transferTo(destinationPath.toFile());
        } catch (Exception e) {
            throw new IllegalArgumentException("Error saving Image: " + e.getMessage());
        }

        return "products/" + uniqueFileName;
    }
}
