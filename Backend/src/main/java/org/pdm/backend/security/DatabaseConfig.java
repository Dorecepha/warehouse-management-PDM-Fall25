package org.pdm.backend.security;

import com.zaxxer.hikari.HikariDataSource;
import lombok.Getter;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Getter
public class DatabaseConfig {
    private static final String URL = "jdbc:mysql://localhost:3306/inventory_db3";
    private static final String USER = "root";
    private static final String PASSWORD = "0000";

    /**
     * class exists to avoid rewriting connection setup in every repository
     * @return Connection object that represents a live link to the database.
     * @throws SQLException in case of connection failure.
     */
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found", e);
        }
    }

    private static  final HikariDataSource dataSource = new HikariDataSource();
    static {
        dataSource.setJdbcUrl(URL);
        dataSource.setUsername(USER);
        dataSource.setPassword(PASSWORD);
    }
    public static HikariDataSource getDataSource() {
        return dataSource;
    }

}