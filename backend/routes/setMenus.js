const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const { Client } = require('pg');
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
    });

    client.connect();

    const { cuisineSlug, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        // Fetch menus with their related cuisines
        const setMenusQuery = `
            SELECT 
                menus.id, 
                menus.name, 
                menus.description, 
                menus.image, 
                menus.price_per_person, 
                menus.number_of_orders,
                json_agg(
                    json_build_object(
                        'id', cuisines.id,
                        'name', cuisines.name,
                        'slug', cuisines.slug
                    )
                ) AS cuisines
            FROM menus
            LEFT JOIN menu_cuisines ON menus.id = menu_cuisines.menu_id
            LEFT JOIN cuisines ON cuisines.id = menu_cuisines.cuisine_id
            WHERE menus.status = TRUE
            AND ($1::TEXT IS NULL OR cuisines.slug = $1)
            GROUP BY menus.id
            ORDER BY menus.number_of_orders DESC
            LIMIT $2 OFFSET $3;
        `;

        const setMenusValues = [cuisineSlug || null, parseInt(limit), parseInt(offset)];
        const { rows: setMenus } = await client.query(setMenusQuery, setMenusValues);

        // Fetch all cuisines for the filters
        const cuisinesQuery = `
            SELECT 
                cuisines.id, 
                cuisines.name, 
                cuisines.slug, 
                cuisines.number_of_orders, 
                COUNT(menus.id) AS set_menus_count
            FROM cuisines
            LEFT JOIN menu_cuisines ON cuisines.id = menu_cuisines.cuisine_id
            LEFT JOIN menus ON menus.id = menu_cuisines.menu_id AND menus.status = TRUE
            GROUP BY cuisines.id
            ORDER BY cuisines.number_of_orders DESC;
        `;
        const { rows: cuisines } = await client.query(cuisinesQuery);

        // Fetch total count of menus
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM menus
            LEFT JOIN menu_cuisines ON menus.id = menu_cuisines.menu_id
            LEFT JOIN cuisines ON cuisines.id = menu_cuisines.cuisine_id
            WHERE menus.status = TRUE
            AND ($1::TEXT IS NULL OR cuisines.slug = $1);
        `;
        const { rows: countResult } = await client.query(countQuery, [cuisineSlug || null]);
        const total = parseInt(countResult[0].total);

        res.json({
            setMenus,
            cuisines,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
            }
        });
    } catch (error) {
        console.error('Error fetching set menus:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.end();
    }
});

module.exports = router;
