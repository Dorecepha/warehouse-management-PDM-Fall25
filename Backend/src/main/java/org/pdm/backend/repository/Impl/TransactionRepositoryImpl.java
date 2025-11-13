package org.pdm.backend.repository.Impl;

import org.pdm.backend.enums.TransactionStatus;
import org.pdm.backend.enums.TransactionType;
import org.pdm.backend.model.Transaction;
import org.pdm.backend.repository.TransactionRepository;
import org.pdm.backend.security.DatabaseConfig;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class TransactionRepositoryImpl implements TransactionRepository {
    @Override
    public Transaction save(Transaction transaction) {
        String sql = "INSERT INTO transactions (total_products, total_price, transaction_type, status, description, note, product_id, user_id, supplier_id, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try(Connection conn= DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)){
            ps.setInt(1, transaction.getTotalProducts());
            ps.setBigDecimal(2, transaction.getTotalPrice());
            ps.setString(3, transaction.getTransactionType().name());
            ps.setString(4, transaction.getStatus().name());
            ps.setString(5, transaction.getDescription());
            ps.setString(6, transaction.getNote());
            ps.setLong(7, transaction.getProductID());
            ps.setLong(8, transaction.getUserID());
            ps.setLong(9, transaction.getSupplierID());
            LocalDateTime now = LocalDateTime.now();
            ps.setTimestamp(10, Timestamp.valueOf(now));
            ps.setTimestamp(11, Timestamp.valueOf(now));
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                ResultSet generatedKeys = ps.getGeneratedKeys();
                if (generatedKeys.next()) {
                    transaction.setId(generatedKeys.getLong(1));
                    transaction.setUpdateAt(now);
                    return transaction;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Transaction update(Transaction transaction) {
        String sql = "UPDATE transactions SET total_products = ?, total_price = ?, transaction_type = ?, status = ?, description = ?, note = ?, product_id = ?, user_id = ?, supplier_id = ?, update_at = ? WHERE id = ?";
        try(Connection conn= DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setInt(1, transaction.getTotalProducts());
            ps.setBigDecimal(2, transaction.getTotalPrice());
            ps.setString(3, transaction.getTransactionType().name());
            ps.setString(4, transaction.getStatus().name());
            ps.setString(5, transaction.getDescription());
            ps.setString(6, transaction.getNote());
            ps.setLong(7, transaction.getProductID());
            ps.setLong(8, transaction.getUserID());
            ps.setLong(9, transaction.getSupplierID());
            ps.setTimestamp(10, Timestamp.valueOf(LocalDateTime.now()));
            ps.setLong(11, transaction.getId());
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                return transaction;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        String sql = "SELECT * FROM transactions WHERE id = ?";
        try(Connection conn= DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()){
                return Optional.of(mapToTransaction(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public List<Transaction> searchTransactions( int page, int size, String searchText) {
        String sql = "SELECT * FROM transactions WHERE description LIKE ? OR note LIKE ? LIMIT ? OFFSET ?";
        List<Transaction> transactions = new java.util.ArrayList<>();
        try(Connection conn= DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            String likeSearchText = "%" + searchText + "%";
            ps.setString(1, likeSearchText);
            ps.setString(2, likeSearchText);
            ps.setInt(3, size);
            ps.setInt(4, page * size);
            ResultSet rs = ps.executeQuery();
            while (rs.next()){
                transactions.add(mapToTransaction(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return transactions;
    }

    @Override
    public List<Transaction> findAllByMonthAndYear(int month, int year) {
        String sql = "SELECT * FROM transactions WHERE MONTH(create_at) = ? AND YEAR(create_at) = ?";
        List<Transaction> transactions = new java.util.ArrayList<>();
        try(Connection conn= DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setInt(1, month);
            ps.setInt(2, year);
            ResultSet rs = ps.executeQuery();
            while (rs.next()){
                transactions.add(mapToTransaction(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return transactions;
    }



    private Transaction mapToTransaction(ResultSet rs) throws SQLException {
        Transaction transaction = new Transaction();
        transaction.setId(rs.getLong("id"));
        transaction.setTotalProducts(rs.getInt("total_products"));
        transaction.setTotalPrice(rs.getBigDecimal("total_price"));
        transaction.setTransactionType(TransactionType.valueOf(rs.getString("transaction_type")));
        transaction.setStatus(TransactionStatus.valueOf(rs.getString("status")));
        transaction.setDescription(rs.getString("description"));
        transaction.setNote(rs.getString("note"));
        transaction.setProductID(rs.getLong("product_id"));
        transaction.setUserID(rs.getLong("user_id"));
        transaction.setSupplierID(rs.getLong("supplier_id"));
        if(rs.getTimestamp("create_at")!=null){
            transaction.setCreatedAt(rs.getTimestamp("create_at").toLocalDateTime());
        }
        if(rs.getTimestamp("update_at")!=null){
            transaction.setUpdateAt(rs.getTimestamp("update_at").toLocalDateTime());
        }
        else transaction.setUpdateAt(LocalDateTime.now());
        return transaction;
    }

}
