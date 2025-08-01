package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.BuyerChallengeDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class BuyerChallangeDAOImpl implements BuyerChallengeDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> findActiveChallenges() {
        String sql = "SELECT * FROM challenges WHERE status = ? ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql, "active");
    }

    @Override
    public Optional<Map<String, Object>> findById(Long id) {
        String sql = "SELECT * FROM challenges WHERE id = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, id);
        return result.stream().findFirst();
    }

    @Override
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM challenges ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> findByCategory(String category) {
        String sql = "SELECT * FROM challenges WHERE category = ? ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql, category);
    }

    @Override
    public List<Map<String, Object>> findByStatus(String status) {
        String sql = "SELECT * FROM challenges WHERE status = ? ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql, status);
    }
}
