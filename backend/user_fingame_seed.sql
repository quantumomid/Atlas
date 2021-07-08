INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES('quantumomid', 'quantumomid@msn.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES('quantumdavid', 'quantumdavid@msn.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES('quantummichael', 'quantummichael@msn.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES('quantumguy', 'quantumguy@msn.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, password_encrypted, created_at, updated_at) VALUES('quantumjoanna', 'quantumjoanna@msn.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());

INSERT INTO finished_games (username, score, created_at) VALUES ('quantumguy', 100, NOW());
INSERT INTO finished_games (username, score, created_at) VALUES ('quantumjoanna', 90, NOW());
INSERT INTO finished_games (username, score, created_at) VALUES ('quantumdavid', 120, NOW());

INSERT INTO current_games (username, score, played_countries, created_at, updated_at) VALUES ('quantumguy', 100, '["Egypt","France"]', NOW(), NOW());
INSERT INTO current_games (username, score, played_countries, created_at, updated_at) VALUES ('quantumjoanna', 100, '["Egypt","France"]',NOW(), NOW());
INSERT INTO current_games (username, score, played_countries, created_at, updated_at) VALUES ('quantumdavid', 100, '["Egypt","France"]',NOW(), NOW());_gam