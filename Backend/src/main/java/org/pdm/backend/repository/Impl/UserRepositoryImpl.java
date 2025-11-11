package org.pdm.backend.repository.Impl;

import org.pdm.backend.enums.UserRole;
import org.pdm.backend.model.User;
import org.pdm.backend.repository.UserRepository;
import org.pdm.backend.security.DatabaseConfig;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    /**
     * Find a user by id.
     * @param userId - user id
     * {@code SELECT * FROM users WHERE id = ?} your query, in this case is to find a user by id, ? is a placeholder for the value to be inserted
     * {@code Connection conn = DatabaseConfig.getConnection();} get a live connection to database
     * {@code ps.setLong(1, userId);} set the value of the first ? placeholder to the value of userId
     *
     * @return convert the result set to a user object
     */
    @Override
    public Optional<User> findById(Long userId) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try(Connection conn= DatabaseConfig.getConnection();){
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                return Optional.of(mapRowToUsers(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try(Connection conn= DatabaseConfig.getConnection();){
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                return Optional.of(mapRowToUsers(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public List<User> findAll() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM users";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(mapRowToUsers(rs));
            } // khi nào vẫn còn row thì vẫn add vào list
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public Long deleteById(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
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

    @Override
    public User save(User userToSave) {
        String sql = "INSERT INTO users (name, email, password, phone_number, role,created_at) VALUES (?, ?, ?, ?, ?,?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, userToSave.getName());
            ps.setString(2, userToSave.getEmail());
            ps.setString(3, userToSave.getPassword());
            ps.setString(4, userToSave.getPhoneNumber());
            ps.setString(5, userToSave.getRole().toString());
            ps.setTimestamp(6, Timestamp.valueOf(userToSave.getCreatedAt()));
            int affectedRows= ps.executeUpdate();
            if(affectedRows == 0) throw new SQLException("Creating user failed, no rows affected.");
            ResultSet generatedKeys = ps.getGeneratedKeys();
            if (generatedKeys.next()) {
                userToSave.setId(generatedKeys.getLong(1));
                return userToSave;
            }
            else throw new SQLException("Creating user failed, no ID obtained.");
        }catch (SQLException e){
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public User update(User userToUpdate) {
        String sql = "UPDATE users SET name = ?, email = ?, password = ?, phone_number = ?, role = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, userToUpdate.getName());
            ps.setString(2, userToUpdate.getEmail());
            ps.setString(3, userToUpdate.getPassword());
            ps.setString(4, userToUpdate.getPhoneNumber());
            ps.setString(5, userToUpdate.getRole().toString());
            ps.setLong(6, userToUpdate.getId());
            ps.executeUpdate();
            return userToUpdate;



        }catch (SQLException e){
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        return false;
    }

    private User mapRowToUsers(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setRole(UserRole.valueOf(rs.getString("role")));
        user.setPhoneNumber(rs.getString("phone_number"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) user.setCreatedAt(ts.toLocalDateTime());
        return user;
    }
}
