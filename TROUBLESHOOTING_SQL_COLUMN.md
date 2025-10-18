# Analytics 500 Error - SQL Column Name Mismatch

## The Real Problem Found! 🎯

The error is:
```
Unknown column 'order_date' in 'SELECT'
```

This means your `shop_orders` table either:
1. Doesn't exist in the database
2. Has different column names than expected

## Quick Diagnostic - Run This in MySQL:

```sql
-- Check if shop_orders table exists
SHOW TABLES LIKE 'shop_orders';

-- If it exists, show its structure
DESCRIBE shop_orders;

-- Show exact columns
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'shop_orders' 
AND TABLE_SCHEMA = 'artaura_db';
```

## Most Likely Fixes:

### Option 1: Table Doesn't Exist
Run this to create it:
```sql
source D:/Artaura/ArtAura/shop_orders_table.sql;
```

### Option 2: Column Name is Different

If the table EXISTS but the error says column not found, the column might be named differently.

**Common variations:**
- `order_date` → `created_at`
- `order_date` → `date_created`  
- `order_date` → `orderDate`

Run this to see what it's actually called:
```sql
DESCRIBE shop_orders;
```

Then tell me the output and I'll fix the Java code!

---

## What I Need From You:

**Run this ONE command in MySQL and copy the result:**

```sql
DESCRIBE shop_orders;
```

**Or if that fails (table doesn't exist):**

```sql
SHOW TABLES;
```

Send me the output and I'll fix it immediately!
