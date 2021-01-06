SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
FROM property_reviews
JOIN properties ON property_id = properties.id
JOIN reservations ON reservation_id = reservations.id
JOIN users ON property_reviews.guest_id = users.id
WHERE reservations.guest_id = 1 AND now()::date > reservations.end_date
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date ASC
LIMIT 10;