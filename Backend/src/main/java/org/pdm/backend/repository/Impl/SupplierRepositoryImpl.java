package org.pdm.backend.repository.Impl;

import org.pdm.backend.model.Supplier;
import org.pdm.backend.repository.SupplierRepository; 
import org.pdm.backend.security.DatabaseConfig;
import org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository

public class SupplierRepositoryImpl implements SupplierRepository {
    @Override
    public Optional<Supplier> findById(Long id){
        String sql = "SELECT * FROM suppliers WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()){
                return Optional.of(mapRowToSupplier(rs));
            }
        }
        catch (SQLException e){
            e.printStackTrace();
        }
        return Optional.empty();
    }
    @Override
    public List<Supplier> findAll(){
        List<Supplier> list = new ArrayList();
        String sql = "SELECT * FROM suppliers";

        try (Connection conn = DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery()) {
            while (rs.next()){
                list.add(mapRowToSupplier(rs));
            }
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
    @Override
    public Supplier save (Supplier supplierToSave){
        String sql = "INSERT INTO suppliers (name, contact_info, address) VALUES (?,?,?)";
        
        try(Connection conn = DatabaseConfig.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1,supplierToSave.getName());
            ps.setString(2,supplierToSave.getContactInfo());
            ps.setString(3,supplierToSave.getAddress());
            int affectedRows = ps. executeUpdate();
            if (affectedRows ==0){
                throw new SQLException("FAILED, THE ROWS REMAIN!");
            }
            ResultSet generateKeys = ps.getGeneratedKeys();
            if (generateKeys.next()){
                supplierToSave.setId(generateKeys.getLong(1));
                return supplierToSave;
            }
            else {
                throw new SQLException("FAILED, ID CAN NOT BE TAKEN!");
            }}
            catch (SQLException e){
                e.printStackTrace();
                throw new RuntimeException(e);
            }
        }
        @Override
        public Supplier update(Supplier supplierToUpdate){
            String sql = "UPDATE suppliers SET name = ?, contact_info = ?, address = ? WHERE id = ?";
            try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)){
                    ps.setString(1, supplierToUpdate.getName());
                    ps.setString(2, supplierToUpdate.getContactInfo());
                    ps.setString(3, supplierToUpdate.getAddress());
                    ps.setLong(4, supplierToUpdate.getId());

                    ps.executeUpdate();
                    return supplierToUpdate;
            }
            catch (SQLException e){
                e.printStackTrace();
                throw new RuntimeException(e);
            }
        } 
        @Override public Long deleteById(Long id) {
            String sql = "DELETE FROM suppliers WHERE id = ?";
            try (Connection conn = DatabaseConfig.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)){
                    ps.setLong(1,id);
                    int affectedRows = ps.executeUpdate();
                    return (long) affectedRows;
                }
            catch (SQLException e){
                e.printStackTrace();
            }
            return 0L;
        }
        /// tui đang đọc giải thích của gemeni mà tui ch hiểu khúc này@@
        private Supplier mapRowToSupplier(ResultSet rs) throws SQLException{
            return Supplier.builder()
                            .id(rs.getLong("id"))
                            .name(rs.getString("name"))
                            .contactInfo(rs.getString("contact_ìnfo"))
                            .address(rs.getString("address"))
                            .build();
        }
    }
