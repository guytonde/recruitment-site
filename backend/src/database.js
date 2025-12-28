import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  statement_timeout: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        password_hash VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

      CREATE TABLE IF NOT EXISTS user_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR NOT NULL,
        team VARCHAR,
        system VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, role, team, system)
      );

      CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

      CREATE TABLE IF NOT EXISTS recruitment_cycles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phase INT DEFAULT 0,
        phase_started_at TIMESTAMP DEFAULT NOW(),
        phase_ends_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        cycle_id UUID REFERENCES recruitment_cycles(id),
        team VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        major VARCHAR,
        year INT,
        system_preferences JSONB,
        essay_response TEXT,
        resume_url VARCHAR,
        resume_key VARCHAR,
        status VARCHAR DEFAULT 'submitted',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
      CREATE INDEX IF NOT EXISTS idx_applications_team ON applications(team);
      CREATE INDEX IF NOT EXISTS idx_applications_cycle_id ON applications(cycle_id);

      CREATE TABLE IF NOT EXISTS application_decisions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        decided_by_user_id UUID REFERENCES users(id),
        system_id VARCHAR,
        decision VARCHAR,
        feedback TEXT,
        decided_at TIMESTAMP DEFAULT NOW(),
        phase_decided INT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_application_decisions_app_id ON application_decisions(application_id);
      CREATE INDEX IF NOT EXISTS idx_application_decisions_system_id ON application_decisions(system_id);

      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        action VARCHAR NOT NULL,
        resource_id VARCHAR,
        resource_type VARCHAR,
        details JSONB,
        ip_address VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

initDatabase();
