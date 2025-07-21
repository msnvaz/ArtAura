package com.artaura.artaura.service;

import com.artaura.artaura.dto.achievement.AchievementCreateDTO;
import com.artaura.artaura.dto.achievement.AchievementResponseDTO;
import com.artaura.artaura.dto.achievement.AchievementUpdateDTO;
import java.util.List;

public interface AchievementService {

    void createAchievement(AchievementCreateDTO dto);

    void deleteAchievement(Long achievementId);

    void updateAchievement(AchievementUpdateDTO dto);

    List<AchievementResponseDTO> getAchievementsByArtist(Long artistId);

    AchievementResponseDTO getAchievementById(Long achievementId);
}