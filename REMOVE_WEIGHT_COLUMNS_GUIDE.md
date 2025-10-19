# 🗑️ Remove Weight Columns - Quick Guide

## ✅ SQL Queries to Execute

### **Single Command (All at once):**
```sql
ALTER TABLE `challenges` 
DROP COLUMN `likes_weight`,
DROP COLUMN `comments_weight`,
DROP COLUMN `share_weight`;
```

### **Individual Commands (One by one):**
```sql
-- Remove likes_weight
ALTER TABLE `challenges` DROP COLUMN `likes_weight`;

-- Remove comments_weight
ALTER TABLE `challenges` DROP COLUMN `comments_weight`;

-- Remove share_weight
ALTER TABLE `challenges` DROP COLUMN `share_weight`;
```

---

## 🔧 How to Execute

### **Option 1: phpMyAdmin**
1. Open phpMyAdmin at `mysql-artaura.alwaysdata.net`
2. Select database `artaura_db`
3. Click on **SQL** tab
4. Paste the SQL commands
5. Click **Go**

### **Option 2: MySQL Command Line**
```bash
mysql -h mysql-artaura.alwaysdata.net -u artaura_admin -p artaura_db
```

Then paste the SQL commands.

### **Option 3: Run SQL File**
```bash
mysql -h mysql-artaura.alwaysdata.net -u artaura_admin -p artaura_db < remove_weight_columns.sql
```

---

## ✅ Verify Changes

After execution, run this to verify:

```sql
DESCRIBE challenges;
```

**Expected Result:** Columns `likes_weight`, `comments_weight`, and `share_weight` should **NOT** appear in the output.

---

## 📊 Before vs After

### **Before (Current Structure):**
```
- id
- title
- category
- publish_date_time
- deadline_date_time
- description
- max_participants
- rewards
- request_sponsorship
- status
- moderator_id
- created_at
- likes_weight ❌ (TO BE REMOVED)
- comments_weight ❌ (TO BE REMOVED)
- share_weight ❌ (TO BE REMOVED)
```

### **After (New Structure):**
```
- id
- title
- category
- publish_date_time
- deadline_date_time
- description
- max_participants
- rewards
- request_sponsorship
- status
- moderator_id
- created_at
✅ (Clean! No weight columns)
```

---

## 🎯 Why Remove These Columns?

We're using **Fixed Marks Scoring** now:
- **Each Like = +10 marks** (hardcoded, no database column needed)
- **Each Dislike = -5 marks** (hardcoded, no database column needed)
- **Minimum score = 0** (no negative scores)

No need to store weights in the database anymore!

---

## ⚠️ Important Notes

1. **Backup First:** Always backup your database before running ALTER TABLE commands
2. **All Data Safe:** Removing these columns won't affect existing challenge data (title, description, etc.)
3. **No Rollback:** Once dropped, you cannot undo (unless you restore from backup)
4. **Affects All Records:** All 10 existing challenges will lose their weight columns

---

## 🚀 Quick Start

**Copy and paste this into phpMyAdmin SQL tab:**

```sql
-- Remove all weight columns
ALTER TABLE `challenges` 
DROP COLUMN `likes_weight`,
DROP COLUMN `comments_weight`,
DROP COLUMN `share_weight`;

-- Verify
DESCRIBE challenges;
```

**Done!** ✅

---

## 📁 Files Available

- `remove_weight_columns.sql` - SQL commands to execute
- `FIXED_MARKS_SCORING_SYSTEM.md` - Full documentation
- `SCORING_SPECIFICATION_FINAL.md` - Complete specification

**Ready to execute!** 🎉
