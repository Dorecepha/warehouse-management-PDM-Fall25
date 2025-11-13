package org.pdm.backend.repository.Impl;

import java.util.List;
import java.sql.*;
import java.util.ArrayList;
import java.util.Optional;

import org.pdm.backend.security.DatabaseConfig;


import org.pdm.backend.model.Product;
import org.pdm.backend.repository.ProductRepository;

public class ProductRepositoryImpl implements ProductRepository {
    @Override
    public Product save(Product productToSave) {
        String sql = "INSERT INTO products (name, sku, price, stock_quantity, description, expiry_date, image_url, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, productToSave.getName());
            ps.setString(2, productToSave.getSku());
            ps.setBigDecimal(3, productToSave.getPrice());
            ps.setInt(4, productToSave.getStockQuantity());
            ps.setString(5, productToSave.getDescription());
            ps.setTimestamp(6, Timestamp.valueOf(productToSave.getExpiryDate()));
            ps.setString(7, productToSave.getImageUrl());
            ps.setLong(8, productToSave.getCategoryID());
            ps.setTimestamp(9, Timestamp.valueOf(productToSave.getCreatedAt()));
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                productToSave.setId(rs.getLong(1));
            }
            return productToSave;
        } catch (SQLException e) {
            e.printStackTrace();
    }
    return null;
}

    @Override
    public Product update(Product productToUpdate) {
        String sql = "UPDATE products SET name = ?, sku = ?, price = ?, stock_quantity = ?, description = ?, expiry_date = ?, image_url = ?, category_id = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, productToUpdate.getName());
            ps.setString(2, productToUpdate.getSku());
            ps.setBigDecimal(3, productToUpdate.getPrice());
            ps.setInt(4, productToUpdate.getStockQuantity());
            ps.setString(5, productToUpdate.getDescription());
            ps.setTimestamp(6, Timestamp.valueOf(productToUpdate.getExpiryDate()));
            ps.setString(7, productToUpdate.getImageUrl());
            ps.setLong(8, productToUpdate.getCategoryID());
            ps.setLong(9, productToUpdate.getId());
            ps.executeUpdate();
            return productToUpdate;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Product> findAll() {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM products";
        try(Connection conn= DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);){
            ResultSet rs = ps.executeQuery();
            while(rs.next()){
                Product product = mapRowToProduct(rs);
                list.add(product);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public Optional<Product> findById(Long id) {
        String sql = "SELECT * FROM products WHERE id = ?";
        try(Connection conn= DatabaseConfig.getConnection();){
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                return Optional.of(mapRowToProduct(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public List<Product> findByNameContainingOrDescriptionContaining(String name, String description) {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?";
        try(Connection conn= DatabaseConfig.getConnection();){
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, "%" + name + "%");
            ps.setString(2, "%" + description + "%");
            ResultSet rs = ps.executeQuery();
            while(rs.next()){
                Product product = mapRowToProduct(rs);
                list.add(product);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public Long deleteById(Long id) {
        String sql = "DELETE FROM products WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setLong(1, id);
            ps.executeUpdate();
            return 1L;
        }catch (SQLException e){
            e.printStackTrace();
        }
        return 0L;
    }
    

    private Product mapRowToProduct(ResultSet rs) throws SQLException {
        Product product = new Product();
        product.setId(rs.getLong("id"));
        product.setName(rs.getString("name"));
        product.setSku(rs.getString("sku"));
        product.setPrice(rs.getBigDecimal("price"));
        product.setStockQuantity(rs.getInt("stock_quantity"));
        product.setDescription(rs.getString("description"));
        product.setExpiryDate(rs.getTimestamp("expiry_date").toLocalDateTime());
        product.setImageUrl(rs.getString("image_url"));
        product.setCategoryID(rs.getLong("category_id"));
        product.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return product;
    }
}
