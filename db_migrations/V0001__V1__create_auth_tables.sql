CREATE TABLE t_p78097975_messenger_customizat.users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(128) NOT NULL,
  avatar_color VARCHAR(16) DEFAULT '#3ecf8e',
  bio TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE t_p78097975_messenger_customizat.sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES t_p78097975_messenger_customizat.users(id),
  token VARCHAR(512) NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address VARCHAR(64),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE t_p78097975_messenger_customizat.otp_codes (
  id BIGSERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  code VARCHAR(8) NOT NULL,
  purpose VARCHAR(32) NOT NULL,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE t_p78097975_messenger_customizat.rate_limits (
  id BIGSERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  action VARCHAR(64) NOT NULL,
  attempts INT DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

CREATE TABLE t_p78097975_messenger_customizat.user_preferences (
  user_id BIGINT PRIMARY KEY REFERENCES t_p78097975_messenger_customizat.users(id),
  accent_color VARCHAR(16) DEFAULT '#3ecf8e',
  font_size VARCHAR(16) DEFAULT 'medium',
  bubble_style VARCHAR(16) DEFAULT 'rounded',
  app_icon VARCHAR(64) DEFAULT 'default',
  compact_mode BOOLEAN DEFAULT FALSE,
  animations_enabled BOOLEAN DEFAULT TRUE,
  theme VARCHAR(16) DEFAULT 'dark',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON t_p78097975_messenger_customizat.sessions(token);
CREATE INDEX idx_sessions_user_id ON t_p78097975_messenger_customizat.sessions(user_id);
CREATE INDEX idx_otp_identifier ON t_p78097975_messenger_customizat.otp_codes(identifier, purpose);
CREATE INDEX idx_rate_limits_identifier ON t_p78097975_messenger_customizat.rate_limits(identifier, action);
