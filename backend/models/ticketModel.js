const pool = require('../config/db');

const Ticket = {
    async create(event_id) {
        const result = await pool.query(
            'INSERT INTO tickets (event_id) VALUES ($1) RETURNING *',
            [event_id]
        );
        return result.rows[0];
    },

    async findById(id) {
        const result = await pool.query(
            'SELECT * FROM tickets WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    async updateStatus(id, status, scanned_at = null, scanned_by = null) {
        const result = await pool.query(
            `UPDATE tickets
             SET status = $2, scanned_at = $3, scanned_by = $4
             WHERE id = $1
             RETURNING *`,
            [id, status, scanned_at, scanned_by]
        );
        return result.rows[0];
    }
};

module.exports = Ticket;