package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ArtWorkDAO;
import com.artaura.artaura.dto.artwork.ArtWorkCreateDTO;
import com.artaura.artaura.dto.artwork.ArtWorkResponseDTO;
import com.artaura.artaura.dto.artwork.ArtWorkUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ArtWorkDAOImpl implements ArtWorkDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void saveArtWork(Long artistId, ArtWorkCreateDTO dto) {
        String sql = "INSERT INTO artworks (artist_id, title, medium, size, year, price, description, category, tags, status, image_url, likes_count, views_count, is_featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                artistId,
                dto.getTitle(),
                dto.getMedium(),
                dto.getSize(),
                dto.getYear(),
                dto.getPrice(),
                dto.getDescription(),
                dto.getCategory(),
                dto.getTags(),
                dto.getStatus(),
                dto.getImageUrl(),
                dto.getLikesCount(),
                dto.getViewsCount(),
                dto.isFeatured(),
                dto.getCreatedAt(),
                dto.getUpdatedAt()
        );
    }

    @Override
    public void deleteArtWorkById(Long artworkId) {
        try {
            // Check if artwork exists before attempting deletion
            String checkArtworkSQL = "SELECT COUNT(*) FROM artworks WHERE artwork_id = ?";
            Integer artworkCount = jdbcTemplate.queryForObject(checkArtworkSQL, Integer.class, artworkId);

            if (artworkCount == null || artworkCount == 0) {
                throw new RuntimeException("Artwork not found with id: " + artworkId);
            }

            // First, delete any order items that reference this artwork
            String deleteOrderItemsSQL = "DELETE FROM AW_order_items WHERE artwork_id = ?";
            int orderItemsDeleted = jdbcTemplate.update(deleteOrderItemsSQL, artworkId);

            if (orderItemsDeleted > 0) {
                System.out.println("Deleted " + orderItemsDeleted + " order item(s) referencing artwork " + artworkId);
            }

            // Now delete the artwork itself
            String deleteArtworkSQL = "DELETE FROM artworks WHERE artwork_id = ?";
            int rowsAffected = jdbcTemplate.update(deleteArtworkSQL, artworkId);

            if (rowsAffected == 0) {
                throw new RuntimeException("Failed to delete artwork with id: " + artworkId);
            }

            System.out.println("Successfully deleted artwork " + artworkId + " and " + orderItemsDeleted + " related order items");

        } catch (Exception e) {
            System.err.println("Error deleting artwork with id " + artworkId + ": " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateArtWork(ArtWorkUpdateDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE artworks SET ");
        List<Object> params = new ArrayList<>();
        boolean first = true;
        if (dto.getTitle() != null) {
            sql.append("title = ?");
            params.add(dto.getTitle());
            first = false;
        }
        if (dto.getDescription() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("description = ?");
            params.add(dto.getDescription());
            first = false;
        }
        if (dto.getImageUrl() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("image_url = ?");
            params.add(dto.getImageUrl());
            first = false;
        }
        if (dto.getMedium() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("medium = ?");
            params.add(dto.getMedium());
            first = false;
        }
        if (dto.getSize() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("size = ?");
            params.add(dto.getSize());
            first = false;
        }
        if (dto.getYear() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("year = ?");
            params.add(dto.getYear());
            first = false;
        }
        if (dto.getPrice() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("price = ?");
            params.add(dto.getPrice());
            first = false;
        }
        if (dto.getCategory() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("category = ?");
            params.add(dto.getCategory());
            first = false;
        }
        if (dto.getTags() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("tags = ?");
            params.add(dto.getTags());
            first = false;
        }
        if (dto.getStatus() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("status = ?");
            params.add(dto.getStatus());
            first = false;
        }
        if (dto.getLikesCount() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("likes_count = ?");
            params.add(dto.getLikesCount());
            first = false;
        }
        if (dto.getViewsCount() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("views_count = ?");
            params.add(dto.getViewsCount());
            first = false;
        }
        if (dto.getFeatured() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("is_featured = ?");
            params.add(dto.getFeatured());
            first = false;
        }
        if (dto.getUpdatedAt() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("updated_at = ?");
            params.add(dto.getUpdatedAt());
        }
        sql.append(" WHERE artwork_id = ?");
        params.add(dto.getArtworkId());
        jdbcTemplate.update(sql.toString(), params.toArray());
    }

    @Override
    public List<ArtWorkResponseDTO> getArtWorksByArtist(Long artistId) {
        String sql = "SELECT * FROM artworks WHERE artist_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new Object[]{artistId}, (rs, rowNum) -> {
            ArtWorkResponseDTO dto = new ArtWorkResponseDTO();
            dto.setArtworkId(rs.getLong("artwork_id"));
            dto.setTitle(rs.getString("title"));
            dto.setDescription(rs.getString("description"));
            dto.setImageUrl(rs.getString("image_url"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setLikesCount(rs.getInt("likes_count"));
            dto.setViewsCount(rs.getInt("views_count"));
            dto.setMedium(rs.getString("medium"));
            dto.setSize(rs.getString("size"));
            dto.setYear(rs.getString("year"));
            dto.setPrice(rs.getDouble("price"));
            dto.setCategory(rs.getString("category"));
            dto.setTags(rs.getString("tags"));
            dto.setStatus(rs.getString("status"));
            dto.setFeatured(rs.getBoolean("is_featured"));
            dto.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            dto.setArtistId(rs.getLong("artist_id"));
            return dto;
        });
    }

    @Override
    public ArtWorkResponseDTO getArtWorkById(Long artworkId) {
        String sql = "SELECT * FROM artworks WHERE artwork_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{artworkId}, (rs, rowNum) -> {
            ArtWorkResponseDTO dto = new ArtWorkResponseDTO();
            dto.setArtworkId(rs.getLong("artwork_id"));
            dto.setTitle(rs.getString("title"));
            dto.setDescription(rs.getString("description"));
            dto.setImageUrl(rs.getString("image_url"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            dto.setLikesCount(rs.getInt("likes_count"));
            dto.setViewsCount(rs.getInt("views_count"));
            dto.setMedium(rs.getString("medium"));
            dto.setSize(rs.getString("size"));
            dto.setYear(rs.getString("year"));
            dto.setPrice(rs.getDouble("price"));
            dto.setCategory(rs.getString("category"));
            dto.setTags(rs.getString("tags"));
            dto.setStatus(rs.getString("status"));
            dto.setFeatured(rs.getBoolean("is_featured"));
            dto.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            dto.setArtistId(rs.getLong("artist_id"));
            return dto;
        });
    }
}
