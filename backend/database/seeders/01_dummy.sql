-- Insert dummy users
INSERT IGNORE INTO users (id, name, email, password, role) VALUES 
(1, 'Demo User', 'user@demo.com', 'password', 'user'),
(2, 'Admin Manager', 'admin@demo.com', 'admin_pass', 'admin');

-- Insert a dummy approved zine
INSERT IGNORE INTO zines (id, user_id, title, description, file_path, status) VALUES
(1, 1, 'My First Reflection', 'A short zine about dealing with overwhelming days.', '/uploads/demo-zine.pdf', 'approved');
