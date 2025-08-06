const pool = require('../config/db');

const Scanner = {
    async create(organizer_id, event_id, name, username, password_hash, valid_until) {
        const result = await pool.query(
            `INSERT INTO scanners (organizer_id, event_id, name, username, password_hash, valid_until)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [organizer_id, event_id, name, username, password_hash, valid_until]
        );
        return result.rows[0];
    },

    async findByOrganizerId(organizer_id) {
        const result = await pool.query(
            'SELECT id, name, event_id, valid_until FROM scanners WHERE organizer_id = $1 ORDER BY created_at DESC',
            [organizer_id]
        );
        return result.rows;
    },

    async findByUsername(username) {
        const result = await pool.query(
            'SELECT * FROM scanners WHERE username = $1',
            [username]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await pool.query(
            'DELETE FROM scanners WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = Scanner;