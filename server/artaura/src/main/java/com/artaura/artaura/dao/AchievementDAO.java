package com.artaura.artaura.dao;

import com.artaura.artaura.dto.achievement.AchievementCreateDTO;
import com.artaura.artaura.dto.achievement.AchievementResponseDTO;
import com.artaura.artaura.dto.achievement.AchievementUpdateDTO;
import java.util.List;

public interface AchievementDAO {

    void saveAchievement(AchievementCreateDTO dto);

    void deleteAchievementById(Long achievementId);

    void updateAchievement(AchievementUpdateDTO dto);

    List<AchievementResponseDTO> getAchievementsByArtist(Long artistId);

    AchievementResponseDTO getAchievementById(Long achievementId);
}
