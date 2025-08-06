const pool = require('../config/db');

const Organizer = {
    async create(name, email, password_hash) {
        const result = await pool.query(
            'INSERT INTO organizers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password_hash]
        );
        return result.rows[0];
    },

    async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM organizers WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },

    async findById(id) {
        const result = await pool.query(
            'SELECT * FROM organizers WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = Organizer;