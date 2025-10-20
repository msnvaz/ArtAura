# 🎯 Fixed Marks Scoring - Final Specification

## ✅ **SCORING RULE**

### **Formula:**
```
Score = MAX(0, (Total Likes × 10) - (Total Dislikes × 5))
```

### **Key Points:**
- ✅ Each Like adds **+10 marks**
- ✅ Each Dislike deducts **-5 marks**
- ⚠️ **Minimum score is 0** (no negative scores allowed)

---

## 📊 **Scoring Examples**

| Submission | Likes | Dislikes | Raw Calculation | Final Score | Note |
|-----------|-------|----------|-----------------|-------------|------|
| **Artwork A** | 50 | 10 | (50×10) - (10×5) = 450 | **450 marks** | ✓ Good ratio |
| **Artwork B** | 100 | 0 | (100×10) - (0×5) = 1000 | **1000 marks** | ✓ Perfect! |
| **Artwork C** | 30 | 5 | (30×10) - (5×5) = 275 | **275 marks** | ✓ Positive score |
| **Artwork D** | 20 | 50 | (20×10) - (50×5) = -50 | **0 marks** | ⚠️ Capped at 0 |
| **Artwork E** | 5 | 30 | (5×10) - (30×5) = -100 | **0 marks** | ⚠️ Capped at 0 |
| **Artwork F** | 0 | 100 | (0×10) - (100×5) = -500 | **0 marks** | ⚠️ Capped at 0 |
| **Artwork G** | 75 | 20 | (75×10) - (20×5) = 650 | **650 marks** | ✓ Great score |

---

## 🔧 **Backend Implementation**

### **Java Code:**

```java
public int calculateScore(Submission submission) {
    int likes = submission.getLikesCount();
    int dislikes = submission.getDislikesCount();
    
    // Calculate raw score
    int rawScore = (likes * 10) - (dislikes * 5);
    
    // Ensure minimum score is 0
    int finalScore = Math.max(0, rawScore);
    
    return finalScore;
}
```

### **Winner Selection:**

```java
public List<Submission> calculateWinners(Long challengeId) {
    List<Submission> submissions = submissionRepository.findByChallengeId(challengeId);
    
    for (Submission submission : submissions) {
        // Calculate score with minimum 0
        int rawScore = (submission.getLikesCount() * 10) - (submission.getDislikesCount() * 5);
        int score = Math.max(0, rawScore);
        submission.setScore(score);
    }
    
    // Sort by score descending (highest score first)
    submissions.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));
    
    // Return top 3 or all with score > 0
    return submissions.stream()
        .filter(s -> s.getScore() > 0)  // Optional: exclude 0-score submissions
        .limit(3)
        .collect(Collectors.toList());
}
```

---

## 💡 **Why Minimum Score = 0?**

### **Reasons:**

1. **User Experience:**
   - Negative scores feel discouraging to artists
   - 0 is psychologically better than -50 or -100

2. **Fair Competition:**
   - Even poorly-received artwork starts at 0
   - No penalty beyond "not winning"

3. **Ranking Clarity:**
   - Clear distinction between "no score" (0) and "good score" (>0)
   - Easier to identify winners vs non-winners

4. **Database Simplicity:**
   - Score column can use UNSIGNED INT
   - Simpler sorting and filtering

---

## 🎨 **UI Display**

### **Create Challenge Form:**
Shows this info box:

```
📊 Fixed Marks Scoring

Winners will be automatically calculated based on the following fixed scoring system:

┌─────────────────┬─────────────────┐
│ Each Like       │ Each Dislike    │
│ +10 marks       │ -5 marks        │
└─────────────────┴─────────────────┘

Formula: Score = MAX(0, (Total Likes × 10) - (Total Dislikes × 5))
⚠️ Note: Minimum score is 0 (no negative scores)
```

### **Challenge List:**
Each card shows:
- Like = +10 marks
- Dislike = -5 marks

---

## ✅ **Testing Scenarios**

### **Test Case 1: Normal Positive Score**
```
Input: 50 likes, 10 dislikes
Calculation: (50 * 10) - (10 * 5) = 500 - 50 = 450
Expected Output: 450 marks ✓
```

### **Test Case 2: Perfect Score**
```
Input: 100 likes, 0 dislikes
Calculation: (100 * 10) - (0 * 5) = 1000 - 0 = 1000
Expected Output: 1000 marks ✓
```

### **Test Case 3: Negative Calculation (Should Cap at 0)**
```
Input: 20 likes, 50 dislikes
Calculation: (20 * 10) - (50 * 5) = 200 - 250 = -50
Expected Output: 0 marks ✓ (capped from -50)
```

### **Test Case 4: Extreme Negative (Should Cap at 0)**
```
Input: 0 likes, 100 dislikes
Calculation: (0 * 10) - (100 * 5) = 0 - 500 = -500
Expected Output: 0 marks ✓ (capped from -500)
```

### **Test Case 5: Boundary Case**
```
Input: 5 likes, 10 dislikes
Calculation: (5 * 10) - (10 * 5) = 50 - 50 = 0
Expected Output: 0 marks ✓ (exactly 0)
```

---

## 🚀 **Deployment Checklist**

- [ ] SQL migration executed (remove weight columns)
- [ ] Backend scoring updated with `Math.max(0, rawScore)`
- [ ] Frontend UI shows "Minimum score is 0" note
- [ ] Documentation updated
- [ ] Test cases verified:
  - [ ] Positive scores work correctly
  - [ ] Negative raw scores are capped at 0
  - [ ] Winner selection sorts by score correctly
  - [ ] UI displays formula with MAX(0, ...) notation

---

## 📚 **Summary**

✅ **Simple Formula:** (Likes × 10) - (Dislikes × 5), minimum 0  
✅ **No Configuration:** Same for all challenges  
✅ **No Negative Scores:** Always ≥ 0  
✅ **Fair System:** Clear rules, easy to understand  
✅ **Winner Selection:** Highest score wins  

**The scoring system is now complete with the 0-minimum rule!** 🎉
