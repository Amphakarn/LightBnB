const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

console.log("connection establishing...");
// module.exports = pool;

pool.connect((err) => {
  if (err) return console.log(err); // Shows error if something happened
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE users.email = $1;`, [email])
    .then(res => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        console.log('USER EMAIL NOT EXIST!');
        return null;
      }
    })
    .catch(err => console.err('query error', err.stack));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE users.id = $1;`, [id])
    .then(res => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        console.log('USER ID NOT EXIST!');
        return null;
      }
    })
    .catch(err => console.err('query error', err.stack));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(err => console.err('query error', err.stack));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
  FROM property_reviews
  JOIN properties ON property_id = properties.id
  JOIN reservations ON reservation_id = reservations.id
  JOIN users ON property_reviews.guest_id = users.id
  WHERE reservations.guest_id = $1 AND now()::date > reservations.end_date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date ASC
  LIMIT $2;
  `, [guest_id, limit])
    .then(res => {
      if (res.rows[0]) {
        return res.rows;
      } else {
        console.log(`${guest_id} has no reservation.`);
        return null;
      }
    })
    .catch(err => console.err('query error', err.stack));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE TRUE 
  `;

  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length}`;
  }
  
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += ` AND cost_per_night > $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += ` AND cost_per_night < $${queryParams.length}`;
  }

  queryString += ` GROUP BY properties.id`;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `    
    HAVING avg(property_reviews.rating) >= $${queryParams.length}
    `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  
  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const values = [`${property.owner_id}`, `${property.title}`, `${property.description}`, `${property.thumbnail_photo_url}`,
                  `${property.cover_photo_url}`, `${property.cost_per_night}`, `${property.parking_spaces}`,
                   `${property.number_of_bathrooms}`, `${property.number_of_bedrooms}`, `${property.country}`,
                   `${property.street}`, `${property.city}`, `${property.province}`, `${property.post_code}`];
  const queryString = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, 
                            cover_photo_url, cost_per_night, parking_spaces, 
                            number_of_bathrooms, number_of_bedrooms, country, 
                            street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
    `;

  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack));
};
exports.addProperty = addProperty;
