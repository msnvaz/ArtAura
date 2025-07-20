package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ProductDAO;
import com.artaura.artaura.dto.catalog.AddProductDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ProductDAOImpl implements ProductDAO {

    private final JdbcTemplate jdbcTemplate;

    public ProductDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private String getStatus(int stock) {
        if (stock == 0) return "out-of-stock";
        if (stock <= 10) return "low-stock";
        return "in-stock";
    }

    @Override
    public void save(AddProductDTO p) {
        String sql = "INSERT INTO products (name, sku, category, price, stock, status, image, rating, sales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                p.getName(),
                p.getSku(),
                p.getCategory(),
                p.getPrice(),
                p.getStock(),
                getStatus(p.getStock()),
                (p.getImage() != null ? p.getImage() : "/assets/catalog.jpeg"),
                p.getRating(),
                p.getSales());
    }

    @Override
    public List<AddProductDTO> findAll() {
        return jdbcTemplate.query("SELECT * FROM products", new RowMapper<AddProductDTO>() {
            @Override
            public AddProductDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
                AddProductDTO p = new AddProductDTO();
                p.setId(rs.getLong("id"));
                p.setName(rs.getString("name"));
                p.setSku(rs.getString("sku"));
                p.setCategory(rs.getString("category"));
                p.setPrice(rs.getDouble("price"));
                p.setStock(rs.getInt("stock"));
                p.setStatus(rs.getString("status"));
                p.setImage(rs.getString("image"));
                p.setRating(rs.getDouble("rating"));
                p.setSales(rs.getInt("sales"));
                return p;
            }
        });
    }
}
