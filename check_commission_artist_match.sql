-- Check which artist owns the commission requests that have images
SELECT 
    cr.id as commission_id,
    cr.artist_id,
    CONCAT(a.first_name, ' ', a.last_name) as artist_name,
    cr.title,
    cr.status,
    COUNT(cri.id) as image_count
FROM 
    commission_requests cr
LEFT JOIN 
    artists a ON cr.artist_id = a.artist_id
LEFT JOIN 
    commission_reference_images cri ON cr.id = cri.commission_request_id
WHERE 
    cr.id IN (10, 11, 12, 14)
GROUP BY 
    cr.id, cr.artist_id, a.first_name, a.last_name, cr.title, cr.status
ORDER BY 
    cr.id;

-- If you're logged in as a different artist, you won't see these requests
-- Check all commission requests for artist_id 11 (common test artist)
SELECT 
    cr.id,
    cr.title,
    cr.status,
    COUNT(cri.id) as image_count
FROM 
    commission_requests cr
LEFT JOIN 
    commission_reference_images cri ON cr.id = cri.commission_request_id
WHERE 
    cr.artist_id = 11
GROUP BY 
    cr.id, cr.title, cr.status
ORDER BY 
    cr.id;
