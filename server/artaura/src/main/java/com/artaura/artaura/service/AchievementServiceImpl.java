package com.artaura.artaura.service;

import com.artaura.artaura.dao.AchievementDAO;
import com.artaura.artaura.dto.achievement.AchievementCreateDTO;
import com.artaura.artaura.dto.achievement.AchievementResponseDTO;
import com.artaura.artaura.dto.achievement.AchievementUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementServiceImpl implements AchievementService {

    @Autowired
    private AchievementDAO achievementDAO;

    @Override
    public void createAchievement(AchievementCreateDTO dto) {
        achievementDAO.saveAchievement(dto);
    }

    @Override
    public void deleteAchievement(Long achievementId) {
        achievementDAO.deleteAchievementById(achievementId);
    }

    @Override
    public void updateAchievement(AchievementUpdateDTO dto) {
        achievementDAO.updateAchievement(dto);
    }

    @Override
    public List<AchievementResponseDTO> getAchievementsByArtist(Long artistId) {
        return achievementDAO.getAchievementsByArtist(artistId);
    }

    @Override
    public AchievementResponseDTO getAchievementById(Long achievementId) {
        return achievementDAO.getAchievementById(achievementId);
    }
}