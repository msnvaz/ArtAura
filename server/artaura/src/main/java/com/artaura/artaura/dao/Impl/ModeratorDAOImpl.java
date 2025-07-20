package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ModeratorDAO;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ModeratorDAOImpl implements ModeratorDAO {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public Optional<LoginUserDataDTO> findByEmail(String email) {
        try {
            String sql = "SELECT moderator_id, email, password FROM moderators WHERE email = ?";
            LoginUserDataDTO dto = jdbc.queryForObject(sql, (rs, rowNum) -> {
                LoginUserDataDTO login = new LoginUserDataDTO();
                login.setUserId(rs.getLong("moderator_id"));
                login.setEmail(rs.getString("email"));
                login.setPassword(rs.getString("password"));
                return login;
            }, email);
            return Optional.ofNullable(dto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public JdbcTemplate getJdbc() {
        return jdbc;
    }
}
