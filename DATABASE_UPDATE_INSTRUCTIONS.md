**Database Schema Update Required**

To complete the commission request enhancement feature, please run the following SQL commands in your MySQL database (artaura_db):

```sql
-- Add columns for artist's deadline and rejection reason to commission_requests table
ALTER TABLE commission_requests 
ADD COLUMN artist_deadline DATE DEFAULT NULL COMMENT 'Artist proposed deadline for the commission',
ADD COLUMN rejection_reason TEXT DEFAULT NULL COMMENT 'Reason provided by artist for rejecting the commission',
ADD COLUMN response_date DATETIME DEFAULT NULL COMMENT 'Date when artist responded to the commission request';
```

**How to apply:**
1. Open MySQL Workbench, phpMyAdmin, or any MySQL client
2. Connect to your database
3. Select the `artaura_db` database
4. Run the above SQL commands

**Alternative using XAMPP phpMyAdmin:**
1. Open http://localhost/phpmyadmin
2. Select `artaura_db` database
3. Go to SQL tab
4. Paste and execute the above SQL commands

After applying these changes, the commission request enhancement feature will be fully functional!
