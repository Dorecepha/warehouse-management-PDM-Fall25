package org.pdm.backend.service.Impl;

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
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;

    private static final String IMAGE_DIRECTORY = System.getProperty("user.dir") + "/product-images/";

    public ProductServiceImpl(ProductRepository productRepository, ModelMapper modelMapper, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Response saveProduct(Product product, MultipartFile imagefile) {
        Category category = categoryRepository.findById(product.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found "));

        //map product entity
        Product productToSave = Product.builder()
                .name(product.getName())
                .sku(product.getSku())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .description(product.getDescription())
                .category(category)
                .build();
        if(imagefile != null && !imagefile.isEmpty()) {
            log.info("Image not exist");
            String imagePath = saveImage(imagefile);
            System.out.println("IMAGE URL IS: " + imagePath);
            productToSave.setImageUrl(imagePath);
        }

        productRepository.save(productToSave);
        return Response.builder()
                .status(200)
                .message("Product was successfully saved")
                .build();
    }

    @Override
    public Response updateProduct(Product product, MultipartFile imagefile) {
        //check if product exists
        Product existingProduct = productRepository.findById(product.getId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        //check product's image
        if(imagefile != null && !imagefile.isEmpty()) {
            String imagePath = saveImage(imagefile);
            System.out.println("IMAGE URL IS: " + imagePath);
            existingProduct.setImageUrl(imagePath);
        }

        //check category to be changed for the products
        if(product.getCategoryId() != null && product.getCategoryId() > 0){
            Category category = categoryRepository.findById(product.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found "));
            existingProduct.setCategory(category);
        }

        //check if product field changed
        if(product.getName() != null && !product.getName().isBlank()){
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

        //update product
        productRepository.update(existingProduct);
        return Response.builder()
                .status(200)
                .message("Product was successfully updated")
                .build();
    }

    @Override
    public Response getAllProducts() {

        List<Product> productList = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        List<Product> productList = modelMapper.map(productList, new TypeToken<List<Product>>() {
        }.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .products(productList)
                .build();
    }


    @Override
    public Response getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        return Response.builder()
                .status(200)
                .message("success")
                .product(modelMapper.map(product, Product.class))
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

        List<Product> productList = modelMapper.map(products, new TypeToken<List<Product>>() {
        }.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .products(productList)
                .build();
    }

    //this save to the root of your project
    private String saveImage(MultipartFile imageFile) {
        //validate image and check if it is greater than 1GIB
        if (!imageFile.getContentType().startsWith("image/") || imageFile.getSize() > 1024 * 1024 * 1024) {
            throw new IllegalArgumentException("Only image files under 1GIG is allowed");
        }

        //create the directory if it doesn't exist
        File directory = new File(IMAGE_DIRECTORY);

        if (!directory.exists()) {
            directory.mkdir();
            log.info("Directory was created");
        }
        //generate unique file name for the image
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

        //Get the absolute path of the image
        String imagePath = IMAGE_DIRECTORY + uniqueFileName;

        try {
            File destinationFile = new File(imagePath);
            imageFile.transferTo(destinationFile); //we are writing the image to this folder
        } catch (Exception e) {
            throw new IllegalArgumentException("Error saving Image: " + e.getMessage());
        }
        return imagePath;
    }
}
