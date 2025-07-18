package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AdminArtworkDAO;
import com.artaura.artaura.dto.admin.AdminArtworkDTO;
import com.artaura.artaura.dto.admin.AdminArtworkFilterDTO;
import com.artaura.artaura.dto.admin.AdminArtworkResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository("adminArtworkDAOImpl")
public class AdminArtworkDAOImpl implements AdminArtworkDAO {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public AdminArtworkResponseDTO getAllArtworks(AdminArtworkFilterDTO filter) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, ");
        sql.append("a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, ");
        sql.append("a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, ");
        sql.append("a.created_at, a.updated_at ");
        sql.append("FROM artworks a ");
        sql.append("LEFT JOIN artists ar ON a.artist_id = ar.artist_id ");
        sql.append("WHERE 1=1 ");

        List<Object> params = new ArrayList<>();

        // Apply filters
        if (filter.getCategory() != null && !filter.getCategory().isEmpty()) {
            sql.append("AND a.category = ? ");
            params.add(filter.getCategory());
        }

        if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
            sql.append("AND a.status = ? ");
            params.add(filter.getStatus());
        }

        if (filter.getArtistName() != null && !filter.getArtistName().isEmpty()) {
            sql.append("AND (ar.first_name LIKE ? OR ar.last_name LIKE ? OR CONCAT(ar.first_name, ' ', ar.last_name) LIKE ?) ");
            String searchPattern = "%" + filter.getArtistName() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        if (filter.getMinPrice() != null) {
            sql.append("AND a.price >= ? ");
            params.add(filter.getMinPrice());
        }

        if (filter.getMaxPrice() != null) {
            sql.append("AND a.price <= ? ");
            params.add(filter.getMaxPrice());
        }

        if (filter.getMinYear() != null) {
            sql.append("AND a.year >= ? ");
            params.add(filter.getMinYear());
        }

        if (filter.getMaxYear() != null) {
            sql.append("AND a.year <= ? ");
            params.add(filter.getMaxYear());
        }

        if (filter.getMedium() != null && !filter.getMedium().isEmpty()) {
            sql.append("AND a.medium = ? ");
            params.add(filter.getMedium());
        }

        if (filter.getIsFeatured() != null) {
            sql.append("AND a.is_featured = ? ");
            params.add(filter.getIsFeatured());
        }

        // Get total count before pagination
        String countSql = sql.toString().replace(
            "SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, " +
            "a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, " +
            "a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, " +
            "a.created_at, a.updated_at ",
            "SELECT COUNT(*) "
        );

        Long totalElements = jdbc.queryForObject(countSql, Long.class, params.toArray());

        // Apply sorting
        if (filter.getSortBy() != null && !filter.getSortBy().isEmpty()) {
            sql.append("ORDER BY ");
            switch (filter.getSortBy().toLowerCase()) {
                case "title":
                    sql.append("a.title ");
                    break;
                case "price":
                    sql.append("a.price ");
                    break;
                case "year":
                    sql.append("a.year ");
                    break;
                case "created_at":
                    sql.append("a.created_at ");
                    break;
                case "views_count":
                    sql.append("a.views_count ");
                    break;
                case "likes_count":
                    sql.append("a.likes_count ");
                    break;
                default:
                    sql.append("a.created_at ");
            }
            
            if (filter.getSortOrder() != null && filter.getSortOrder().equalsIgnoreCase("ASC")) {
                sql.append("ASC ");
            } else {
                sql.append("DESC ");
            }
        } else {
            sql.append("ORDER BY a.created_at DESC ");
        }

        // Apply pagination
        int page = filter.getPage() != null ? filter.getPage() : 0;
        int size = filter.getSize() != null ? filter.getSize() : 10;
        
        sql.append("LIMIT ? OFFSET ? ");
        params.add(size);
        params.add(page * size);

        List<AdminArtworkDTO> artworks = jdbc.query(sql.toString(), params.toArray(), (rs, rowNum) -> {
            return new AdminArtworkDTO(
                rs.getLong("artwork_id"),
                rs.getLong("artist_id"),
                rs.getString("artist_name"),
                rs.getString("title"),
                rs.getString("medium"),
                rs.getString("size"),
                rs.getInt("year"),
                rs.getDouble("price"),
                rs.getString("description"),
                rs.getString("category"),
                rs.getString("tags"),
                rs.getString("status"),
                rs.getString("image_url"),
                rs.getInt("likes_count"),
                rs.getInt("views_count"),
                rs.getBoolean("is_featured"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("updated_at").toLocalDateTime()
            );
        });

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return new AdminArtworkResponseDTO(artworks, page, totalPages, totalElements, size);
    }

    @Override
    public Optional<AdminArtworkDTO> getArtworkById(Long artworkId) {
        try {
            String sql = "SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, " +
                        "a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, " +
                        "a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, " +
                        "a.created_at, a.updated_at " +
                        "FROM artworks a " +
                        "LEFT JOIN artists ar ON a.artist_id = ar.artist_id " +
                        "WHERE a.artwork_id = ?";

            AdminArtworkDTO artwork = jdbc.queryForObject(sql, (rs, rowNum) -> {
                return new AdminArtworkDTO(
                    rs.getLong("artwork_id"),
                    rs.getLong("artist_id"),
                    rs.getString("artist_name"),
                    rs.getString("title"),
                    rs.getString("medium"),
                    rs.getString("size"),
                    rs.getInt("year"),
                    rs.getDouble("price"),
                    rs.getString("description"),
                    rs.getString("category"),
                    rs.getString("tags"),
                    rs.getString("status"),
                    rs.getString("image_url"),
                    rs.getInt("likes_count"),
                    rs.getInt("views_count"),
                    rs.getBoolean("is_featured"),
                    rs.getTimestamp("created_at").toLocalDateTime(),
                    rs.getTimestamp("updated_at").toLocalDateTime()
                );
            }, artworkId);

            return Optional.ofNullable(artwork);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<AdminArtworkDTO> getArtworksByArtistId(Long artistId) {
        String sql = "SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, " +
                    "a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, " +
                    "a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, " +
                    "a.created_at, a.updated_at " +
                    "FROM artworks a " +
                    "LEFT JOIN artists ar ON a.artist_id = ar.artist_id " +
                    "WHERE a.artist_id = ? " +
                    "ORDER BY a.created_at DESC";

        return jdbc.query(sql, (rs, rowNum) -> {
            return new AdminArtworkDTO(
                rs.getLong("artwork_id"),
                rs.getLong("artist_id"),
                rs.getString("artist_name"),
                rs.getString("title"),
                rs.getString("medium"),
                rs.getString("size"),
                rs.getInt("year"),
                rs.getDouble("price"),
                rs.getString("description"),
                rs.getString("category"),
                rs.getString("tags"),
                rs.getString("status"),
                rs.getString("image_url"),
                rs.getInt("likes_count"),
                rs.getInt("views_count"),
                rs.getBoolean("is_featured"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("updated_at").toLocalDateTime()
            );
        }, artistId);
    }

    @Override
    public List<AdminArtworkDTO> getArtworksByCategory(String category) {
        String sql = "SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, " +
                    "a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, " +
                    "a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, " +
                    "a.created_at, a.updated_at " +
                    "FROM artworks a " +
                    "LEFT JOIN artists ar ON a.artist_id = ar.artist_id " +
                    "WHERE a.category = ? " +
                    "ORDER BY a.created_at DESC";

        return jdbc.query(sql, (rs, rowNum) -> {
            return new AdminArtworkDTO(
                rs.getLong("artwork_id"),
                rs.getLong("artist_id"),
                rs.getString("artist_name"),
                rs.getString("title"),
                rs.getString("medium"),
                rs.getString("size"),
                rs.getInt("year"),
                rs.getDouble("price"),
                rs.getString("description"),
                rs.getString("category"),
                rs.getString("tags"),
                rs.getString("status"),
                rs.getString("image_url"),
                rs.getInt("likes_count"),
                rs.getInt("views_count"),
                rs.getBoolean("is_featured"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("updated_at").toLocalDateTime()
            );
        }, category);
    }

    @Override
    public List<AdminArtworkDTO> getArtworksByStatus(String status) {
        String sql = "SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, " +
                    "a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, " +
                    "a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, " +
                    "a.created_at, a.updated_at " +
                    "FROM artworks a " +
                    "LEFT JOIN artists ar ON a.artist_id = ar.artist_id " +
                    "WHERE a.status = ? " +
                    "ORDER BY a.created_at DESC";

        return jdbc.query(sql, (rs, rowNum) -> {
            return new AdminArtworkDTO(
                rs.getLong("artwork_id"),
                rs.getLong("artist_id"),
                rs.getString("artist_name"),
                rs.getString("title"),
                rs.getString("medium"),
                rs.getString("size"),
                rs.getInt("year"),
                rs.getDouble("price"),
                rs.getString("description"),
                rs.getString("category"),
                rs.getString("tags"),
                rs.getString("status"),
                rs.getString("image_url"),
                rs.getInt("likes_count"),
                rs.getInt("views_count"),
                rs.getBoolean("is_featured"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("updated_at").toLocalDateTime()
            );
        }, status);
    }

    @Override
    public List<AdminArtworkDTO> getFeaturedArtworks() {
        String sql = "SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, " +
                    "a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, " +
                    "a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, " +
                    "a.created_at, a.updated_at " +
                    "FROM artworks a " +
                    "LEFT JOIN artists ar ON a.artist_id = ar.artist_id " +
                    "WHERE a.is_featured = true " +
                    "ORDER BY a.created_at DESC";

        return jdbc.query(sql, (rs, rowNum) -> {
            return new AdminArtworkDTO(
                rs.getLong("artwork_id"),
                rs.getLong("artist_id"),
                rs.getString("artist_name"),
                rs.getString("title"),
                rs.getString("medium"),
                rs.getString("size"),
                rs.getInt("year"),
                rs.getDouble("price"),
                rs.getString("description"),
                rs.getString("category"),
                rs.getString("tags"),
                rs.getString("status"),
                rs.getString("image_url"),
                rs.getInt("likes_count"),
                rs.getInt("views_count"),
                rs.getBoolean("is_featured"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("updated_at").toLocalDateTime()
            );
        });
    }

    @Override
    public List<AdminArtworkDTO> searchArtworks(String searchTerm) {
        String sql = "SELECT a.artwork_id, a.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) as artist_name, " +
                    "a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, " +
                    "a.status, a.image_url, a.likes_count, a.views_count, a.is_featured, " +
                    "a.created_at, a.updated_at " +
                    "FROM artworks a " +
                    "LEFT JOIN artists ar ON a.artist_id = ar.artist_id " +
                    "WHERE a.title LIKE ? OR a.description LIKE ? OR a.tags LIKE ? " +
                    "ORDER BY a.created_at DESC";

        String searchPattern = "%" + searchTerm + "%";
        return jdbc.query(sql, (rs, rowNum) -> {
            return new AdminArtworkDTO(
                rs.getLong("artwork_id"),
                rs.getLong("artist_id"),
                rs.getString("artist_name"),
                rs.getString("title"),
                rs.getString("medium"),
                rs.getString("size"),
                rs.getInt("year"),
                rs.getDouble("price"),
                rs.getString("description"),
                rs.getString("category"),
                rs.getString("tags"),
                rs.getString("status"),
                rs.getString("image_url"),
                rs.getInt("likes_count"),
                rs.getInt("views_count"),
                rs.getBoolean("is_featured"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getTimestamp("updated_at").toLocalDateTime()
            );
        }, searchPattern, searchPattern, searchPattern);
    }

    @Override
    public Long getTotalArtworksCount() {
        String sql = "SELECT COUNT(*) FROM artworks";
        return jdbc.queryForObject(sql, Long.class);
    }

    @Override
    public Long getArtworksCountByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM artworks WHERE status = ?";
        return jdbc.queryForObject(sql, Long.class, status);
    }

    @Override
    public Long getArtworksCountByCategory(String category) {
        String sql = "SELECT COUNT(*) FROM artworks WHERE category = ?";
        return jdbc.queryForObject(sql, Long.class, category);
    }

    @Override
    public boolean updateArtworkStatus(Long artworkId, String status) {
        try {
            String sql = "UPDATE artworks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE artwork_id = ?";
            int rowsAffected = jdbc.update(sql, status, artworkId);
            return rowsAffected > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateArtworkFeaturedStatus(Long artworkId, Boolean isFeatured) {
        try {
            String sql = "UPDATE artworks SET is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE artwork_id = ?";
            int rowsAffected = jdbc.update(sql, isFeatured, artworkId);
            return rowsAffected > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<String> getDistinctCategories() {
        String sql = "SELECT DISTINCT category FROM artworks WHERE category IS NOT NULL ORDER BY category";
        return jdbc.queryForList(sql, String.class);
    }

    @Override
    public List<String> getDistinctMediums() {
        String sql = "SELECT DISTINCT medium FROM artworks WHERE medium IS NOT NULL ORDER BY medium";
        return jdbc.queryForList(sql, String.class);
    }

    @Override
    public List<String> getDistinctStatuses() {
        String sql = "SELECT DISTINCT status FROM artworks WHERE status IS NOT NULL ORDER BY status";
        return jdbc.queryForList(sql, String.class);
    }
}
