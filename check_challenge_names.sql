-- Query to check the exact challenge names and statuses in the database
SELECT 
    id,
    title,
    status,
    deadline_date_time as deadline,
    publish_date_time as published
FROM challenges
ORDER BY id;

-- Query to check only completed challenges
SELECT 
    id,
    title,
    status,
    deadline_date_time as deadline
FROM challenges
WHERE LOWER(status) IN ('completed', 'complete', 'finished', 'done')
ORDER BY deadline_date_time DESC;

-- Query to see all possible status values
SELECT DISTINCT status, COUNT(*) as count
FROM challenges
GROUP BY status;
