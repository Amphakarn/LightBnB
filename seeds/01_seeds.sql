INSERT INTO users (name, email, password)
VALUES ('Bee Pisuthigomol', 'bee@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Benjamin Lister', 'benj@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Pakorn Chan', 'pakorn@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, 
                        number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Cozy Hintonburg Crash Pad', 'description', 'https://images.fakesthumbnails.com/photos/12345/thumbnail-photo-12345.jpg', 'https://images.fakescoverphotos.com/photos/12345/cover-photo-12345.jpg', 
1500, 4, 3, 4, 'Canada', 'Sesame Street', 'Ottawa', 'Ontario', 'J8X 1E2', true),
(2, 'Beautiful apartment in heart of dt byward market', 'description', 'https://images.fakesthumbnails.com/photos/67890/thumbnail-photo-67890.jpg', 'https://images.fakescoverphotos.com/photos/67890/cover-photo-67890.jpg', 
3000, 2, 2, 2, 'Canada', 'Igloo Road', 'Ottawa', 'Ontario', 'D8T 1B2', true),
(3, 'Downtown studio with balcony', 'description', 'https://images.fakesthumbnails.com/photos/1478/thumbnail-photo-1478.jpg', 'https://images.fakescoverphotos.com/photos/67890/cover-photo-1478.jpg', 
1000, 1, 1, 1, 'Canada', 'Sushi Road', 'Ottawa', 'Ontario', 'S8R 1D2', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 2),
('2019-01-04', '2019-02-01', 2, 3),
('2021-10-01', '2021-10-14', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 5, 'messages'),
(3, 2, 2, 3, 'messages'),
(1, 3, 3, 1, 'messages');

