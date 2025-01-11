const axios = require('axios');
const { Client } = require('pg');
const dotenv = require('dotenv');
const generateSlug = require('../utils/slug');
dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// 1 requests per second
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchMenus() {
  try {
    const response = await axios.get(process.env.API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching menus:', error.message);
    throw error;
  }
}

async function insertMenu(menu) {
  const menuValues = [
    menu.created_at || null,
    menu.description || null,
    menu.display_text,
    menu.image || null,
    menu.thumbnail || null,
    menu.is_vegan || 0, 
    menu.is_vegetarian || 0,
    menu.name, 
    menu.status || null,
    menu.price_per_person || 0, 
    menu.min_spend || 0,
    menu.is_seated || 0,
    menu.is_standing || 0,
    menu.is_canape || 0, 
    menu.is_mixed_dietary || 0, 
    menu.is_halal || 0,
    menu.is_kosher || 0, 
    menu.available || false, 
    menu.number_of_orders || 0,
    menu.is_meal_prep || 0,
  ];

  const menuExistsQuery = `SELECT id FROM menus WHERE name = $1`;
  const result = await client.query(menuExistsQuery, [menu.name]);

  if (result.rows.length > 0) {
    console.log(`Menu already exists: ${menu.name}`);
    return result.rows[0].id; // Return the existing menu ID
  }

  const menuInsertQuery = `
    INSERT INTO menus (
      created_at, description, display_text, image, thumbnail, 
      is_vegan, is_vegetarian, name, status, price_per_person, min_spend, 
      is_seated, is_standing, is_canape, is_mixed_dietary, is_halal, is_kosher, 
      available, number_of_orders, is_meal_prep
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, 
      $7, $8, $9, $10, $11, $12, 
      $13, $14, $15, $16, $17, $18, 
      $19, $20
    )
    RETURNING id;
  `;

  const insertResult = await client.query(menuInsertQuery, menuValues);
  return insertResult.rows[0].id;  // Return the newly inserted menu id
}

async function insertCuisines(menuId, cuisines) {
    for (const cuisine of cuisines) {
        const slug = generateSlug(cuisine.name); 

        const selectCuisineQuery = `SELECT id FROM cuisines WHERE slug = $1`;
        const cuisineResult = await client.query(selectCuisineQuery, [slug]);

        let cuisineId;
        if (cuisineResult.rows.length > 0) {
            cuisineId = cuisineResult.rows[0].id;
        } else {
            const insertCuisineQuery = `
                INSERT INTO cuisines (name, slug) 
                VALUES ($1, $2) 
                RETURNING id;
            `;
            const newCuisineResult = await client.query(insertCuisineQuery, [cuisine.name, slug]);
            cuisineId = newCuisineResult.rows[0].id;
        }

        const insertMenuCuisineQuery = `
            INSERT INTO menu_cuisines (menu_id, cuisine_id)
            SELECT $1, $2
            WHERE NOT EXISTS (
                SELECT 1 FROM menu_cuisines WHERE menu_id = $1 AND cuisine_id = $2
            );
        `;
        await client.query(insertMenuCuisineQuery, [menuId, cuisineId]);
    }
}

async function updateCuisineStats() {
  try {
    const updateStatsQuery = `
      UPDATE cuisines
      SET 
        number_of_orders = subquery.total_orders,
        set_menus_count = subquery.live_menus
      FROM (
        SELECT 
          c.id AS cuisine_id,
          SUM(m.number_of_orders) AS total_orders,
          COUNT(mc.menu_id) AS live_menus
        FROM cuisines c
        LEFT JOIN menu_cuisines mc ON c.id = mc.cuisine_id
        LEFT JOIN menus m ON mc.menu_id = m.id AND m.status = TRUE
        GROUP BY c.id
      ) AS subquery
      WHERE cuisines.id = subquery.cuisine_id;
    `;

    await client.query(updateStatsQuery);
    console.log('Cuisine statistics updated successfully.');
  } catch (error) {
    console.error('Error updating cuisine statistics:', error.message);
  }
}

async function getMenus() {
  try {
    console.log('Connecting to the database...');
    await client.connect();

    const menus = await fetchMenus();

    for (const menu of menus) {
      const menuId = await insertMenu(menu); 
      await insertCuisines(menuId, menu.cuisines);
      console.log(`Inserted menu: ${menu.name}`);

      // wait for 1 second before making next API call
      await delay(1000); 
    }
    
    await updateCuisineStats()

    console.log('All menus have been processed.');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    console.log('Closing the database connection...');
    await client.end();
  }
}

getMenus();
