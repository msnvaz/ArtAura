package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ProductDAO;
import com.artaura.artaura.dto.catalog.AddProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ProductDAOImpl implements ProductDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String getStatus(int stock) {
        if (stock == 0)
            return "out-of-stock";
        if (stock <= 10)
            return "low-stock";
        return "in-stock";
    }

    @Override
    public void save(AddProductDTO p) {
        System.out.println("💾 DAO Save Method Called");
        System.out.println("📝 Product Details:");
        System.out.println("   Shop ID: " + p.getShopId());
        System.out.println("   Name: " + p.getName());
        System.out.println("   SKU: " + p.getSku());
        System.out.println("   Category: " + p.getCategory());
        System.out.println("   Price: " + p.getPrice());
        System.out.println("   Stock: " + p.getStock());
        System.out.println("   Image: " + p.getImage());

        try {
            String sql = "INSERT INTO products (shop_id, name, sku, category, price, stock, status, image, rating, sales) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            System.out.println("🔍 Executing SQL: " + sql);

            int rowsAffected = jdbcTemplate.update(sql,
                    p.getShopId(),
                    p.getName(),
                    p.getSku(),
                    p.getCategory(),
                    p.getPrice(),
                    p.getStock(),
                    getStatus(p.getStock()),
                    (p.getImage() != null ? p.getImage() : "/assets/catalog.jpeg"),
                    (p.getRating() != null ? p.getRating() : 0.0),
                    (p.getSales() != null ? p.getSales() : 0));

            System.out.println("✅ Rows affected: " + rowsAffected);

            if (rowsAffected == 0) {
                System.err.println("⚠️ WARNING: No rows were inserted!");
                throw new RuntimeException("Failed to insert product - no rows affected");
            }

            // Verify insertion
            String verifySql = "SELECT * FROM products WHERE sku = ? ORDER BY id DESC LIMIT 1";
            List<AddProductDTO> inserted = jdbcTemplate.query(verifySql, new ProductRowMapper(), p.getSku());
            if (inserted.isEmpty()) {
                System.err.println("❌ ERROR: Product was not found after insertion!");
                throw new RuntimeException("Product insertion verification failed");
            } else {
                System.out.println("✅ Product verified in database with ID: " + inserted.get(0).getId());
            }

        } catch (Exception e) {
            System.err.println("❌ ERROR in save method: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save product: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AddProductDTO> findAll() {
        String sql = "SELECT * FROM products ORDER BY id DESC";
        return jdbcTemplate.query(sql, new ProductRowMapper());
    }

    @Override
    public List<AddProductDTO> findByShopId(Long shopId) {
        String sql = "SELECT * FROM products WHERE shop_id = ? ORDER BY id DESC";
        return jdbcTemplate.query(sql, new ProductRowMapper(), shopId);
    }

    @Override
    public void deleteById(Long id) {
        System.out.println("🗑️ ProductDAOImpl: Attempting to delete product with ID: " + id);

        try {
            // No need to check for orders anymore - the database has ON DELETE SET NULL
            // The product_id in shop_orders will automatically become NULL when product is
            // deleted

            String sql = "DELETE FROM products WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, id);

            if (rowsAffected == 0) {
                System.err.println("❌ Product not found with id: " + id);
                throw new RuntimeException("Product not found with id: " + id);
            }

            System.out.println(
                    "✅ Product " + id + " deleted successfully. Associated orders now have product_id = NULL.");

        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            System.err.println("❌ Database constraint violation: " + e.getMessage());
            throw new RuntimeException("Cannot delete product due to database constraint: " + e.getMessage());
        } catch (RuntimeException e) {
            // Re-throw our custom exceptions
            throw e;
        } catch (Exception e) {
            System.err.println("❌ Unexpected error during deletion: " + e.getMessage());
            throw new RuntimeException("Failed to delete product: " + e.getMessage());
        }
    }

    @Override
    public void updateById(Long id, AddProductDTO product) {
        String sql = "UPDATE products SET shop_id = ?, name = ?, sku = ?, category = ?, price = ?, stock = ?, " +
                "status = ?, image = ?, rating = ?, sales = ? WHERE id = ?";

        int rowsAffected = jdbcTemplate.update(sql,
                product.getShopId(),
                product.getName(),
                product.getSku(),
                product.getCategory(),
                product.getPrice(),
                product.getStock(),
                getStatus(product.getStock()),
                product.getImage(),
                (product.getRating() != null ? product.getRating() : 0.0),
                (product.getSales() != null ? product.getSales() : 0),
                id);

        if (rowsAffected == 0) {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    public AddProductDTO findById(Long id) {
        String sql = "SELECT * FROM products WHERE id = ?";
        List<AddProductDTO> products = jdbcTemplate.query(sql, new ProductRowMapper(), id);

        if (products.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        return products.get(0);
    }

    private static class ProductRowMapper implements RowMapper<AddProductDTO> {
        @Override
        public AddProductDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            AddProductDTO product = new AddProductDTO();
            product.setId(rs.getLong("id"));
            product.setShopId(rs.getLong("shop_id"));
            product.setName(rs.getString("name"));
            product.setSku(rs.getString("sku"));
            product.setCategory(rs.getString("category"));
            product.setPrice(rs.getDouble("price"));
            product.setStock(rs.getInt("stock"));
            product.setStatus(rs.getString("status"));
            product.setImage(rs.getString("image"));
            product.setRating(rs.getDouble("rating"));
            product.setSales(rs.getInt("sales"));
            return product;
        }
    }
}