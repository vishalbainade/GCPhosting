const pool = require('../config/db');

const Event = {
    async create(eventData) {
        const { organizer_id, name, address, start_datetime, end_datetime, total_tickets, ticket_price, terms_and_conditions } = eventData;
        const result = await pool.query(
            `INSERT INTO events (organizer_id, name, address, start_datetime, end_datetime, total_tickets, ticket_price, terms_and_conditions)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [organizer_id, name, address, start_datetime, end_datetime, total_tickets, ticket_price, terms_and_conditions]
        );
        return result.rows[0];
    },

    async addImage(event_id, image_url) {
        const result = await pool.query(
            'INSERT INTO event_images (event_id, image_url) VALUES ($1, $2) RETURNING *',
            [event_id, image_url]
        );
        return result.rows[0];
    },

    async findByOrganizerId(organizer_id) {
        const result = await pool.query(
            `SELECT
                e.*,
                (e.total_tickets - e.tickets_sold) AS remaining_tickets,
                (e.tickets_sold * e.ticket_price) AS total_revenue,
                ARRAY_AGG(ei.image_url) AS images
            FROM events e
            LEFT JOIN event_images ei ON e.id = ei.event_id
            WHERE e.organizer_id = $1
            GROUP BY e.id
            ORDER BY e.created_at DESC`,
            [organizer_id]
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT
                e.*,
                (e.total_tickets - e.tickets_sold) AS remaining_tickets,
                (e.tickets_sold * e.ticket_price) AS total_revenue,
                ARRAY_AGG(ei.image_url) AS images
            FROM events e
            LEFT JOIN event_images ei ON e.id = ei.event_id
            WHERE e.id = $1
            GROUP BY e.id`,
            [id]
        );
        return result.rows[0];
    },

    async incrementTicketsSold(event_id, quantity = 1) {
        const result = await pool.query(
            `UPDATE events
             SET tickets_sold = tickets_sold + $2
             WHERE id = $1
             RETURNING *`,
            [event_id, quantity]
        );
        return result.rows[0];
    }
};

module.exports = Event;