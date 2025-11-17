package org.pdm.backend.repository.Impl;

import lombok.RequiredArgsConstructor;
import org.pdm.backend.enums.TransactionStatus;
import org.pdm.backend.enums.TransactionType;
import org.pdm.backend.enums.UserRole;
import org.pdm.backend.model.Product;
import org.pdm.backend.model.Supplier;
import org.pdm.backend.model.Transaction;
import org.pdm.backend.model.User;
import org.pdm.backend.repository.ProductRepository;
import org.pdm.backend.repository.SupplierRepository;
import org.pdm.backend.repository.TransactionRepository;
import org.pdm.backend.repository.UserRepository;
import org.pdm.backend.security.DatabaseConfig;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class TransactionRepositoryImpl implements TransactionRepository {
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
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
            if (transaction.getProductId() != null) {
                ps.setLong(7, transaction.getProductId());
            } else {
                ps.setNull(7, java.sql.Types.BIGINT);
            }

            if (transaction.getUserId() != null) {
                ps.setLong(8, transaction.getUserId());
            } else {
                ps.setNull(8, java.sql.Types.BIGINT);
            }

            if (transaction.getSupplierId() != null) {
                ps.setLong(9, transaction.getSupplierId());
            } else {
                ps.setNull(9, java.sql.Types.BIGINT);
            }
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
            if (transaction.getProductId() != null) {
                ps.setLong(7, transaction.getProductId());
            } else {
                ps.setNull(7, java.sql.Types.BIGINT);
            }

            if (transaction.getUserId() != null) {
                ps.setLong(8, transaction.getUserId());
            } else {
                ps.setNull(8, java.sql.Types.BIGINT);
            }

            if (transaction.getSupplierId() != null) {
                ps.setLong(9, transaction.getSupplierId());
            } else {
                ps.setNull(9, java.sql.Types.BIGINT);
            }
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

        String sql = "select * from transactions where id = ?";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();

            if (!rs.next()) {
                return Optional.empty();
            }

            // --- Build Transaction ---
            Transaction transaction = mapToTransaction(rs);

            // --- Build Product ---
           transaction.setProduct(productRepository.findById(rs.getLong("product_id")).orElse(null));

            // --- Build Supplier ---
            transaction.setSupplier(supplierRepository.findById(rs.getLong("supplier_id")).orElse(null));


            // --- Build User ---
            transaction.setUser(userRepository.findById(rs.getLong("user_id")).orElse(null));

            return Optional.of(transaction);

        } catch (Exception e) {
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
        transaction.setProductId(rs.getLong("product_id"));
        transaction.setUserId(rs.getLong("user_id"));
        transaction.setSupplierId(rs.getLong("supplier_id"));
        if(rs.getTimestamp("created_at")!=null){
            transaction.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        }
        if(rs.getTimestamp("update_at")!=null){
            transaction.setUpdateAt(rs.getTimestamp("update_at").toLocalDateTime());
        }
        else transaction.setUpdateAt(LocalDateTime.now());
        return transaction;
    }

    public List<Transaction> findAllFilteredPaged(String filter, int page, int size) {

        boolean noFilter = (filter == null || filter.isBlank());
        List<Transaction> list = new ArrayList<>();

        String sql;

        if (noFilter) {
            sql = "SELECT * FROM transactions ORDER BY id DESC LIMIT ? OFFSET ?";
        } else {
            sql = "SELECT * FROM transactions " +
                    "WHERE description LIKE ? OR note LIKE ? " +
                    "ORDER BY id DESC LIMIT ? OFFSET ?";
        }

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            if (noFilter) {
                ps.setInt(1, size);
                ps.setInt(2, page * size);
            } else {
                String pattern = "%" + filter + "%";
                ps.setString(1, pattern);
                ps.setString(2, pattern);
                ps.setInt(3, size);
                ps.setInt(4, page * size);
            }

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapToTransaction(rs));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }


    @Override
    public long countFiltered(String filter) {

        boolean noFilter = (filter == null || filter.isBlank());
        String sql;

        if (noFilter) {
            sql = "SELECT COUNT(*) FROM transactions";
        } else {
            sql = "SELECT COUNT(*) FROM transactions " +
                    "WHERE description LIKE ? OR note LIKE ?";
        }

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            if (!noFilter) {
                String pattern = "%" + filter + "%";
                ps.setString(1, pattern);
                ps.setString(2, pattern);
            }

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getLong(1);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return 0;
    }

    @Override
    public Transaction updateStatus(Long id, TransactionStatus status) {
        String sql = "UPDATE transactions SET status = ? WHERE id = ?";
        try(Connection conn= DatabaseConfig.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setString(1, status.name());
            ps.setLong(2, id);
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                return findById(id).orElse(null);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }


}
