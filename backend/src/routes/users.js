import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.email, users.first_name, users.last_name, users.eid, users.major, users.year,
              json_agg(
                json_build_object('role', user_roles.role, 'team', user_roles.team, 'system', user_roles.system)
              ) as roles
       FROM users
       LEFT JOIN user_roles ON users.id = user_roles.user_id
       WHERE users.id = $1
       GROUP BY users.id, users.email, users.first_name, users.last_name, users.eid, users.major, users.year`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'User not found'});
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      eid: user.eid,
      major: user.major,
      year: user.year,
      roles: user.roles
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Failed to fetch user'});
  }
});

export default router;
