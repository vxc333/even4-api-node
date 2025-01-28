-- Limpando as tabelas existentes na ordem correta
TRUNCATE TABLE participantes, eventos, locais, usuarios RESTART IDENTITY CASCADE;

-- Removendo e recriando as chaves estrangeiras
ALTER TABLE eventos DROP CONSTRAINT IF EXISTS eventos_criador_id_fkey;
ALTER TABLE eventos DROP CONSTRAINT IF EXISTS eventos_local_id_fkey;
ALTER TABLE participantes DROP CONSTRAINT IF EXISTS participantes_usuario_id_fkey;
ALTER TABLE participantes DROP CONSTRAINT IF EXISTS participantes_evento_id_fkey;

-- Inserindo usuários (senha: 123456)
INSERT INTO usuarios (id, nome, email, senha, telefone) VALUES
(1, 'Gednilson Silva', 'gednilson@email.com', '$2b$10$5.9mVNqJU1wCvPQT8pxXvOtEE9sKR2GF1s9D5j3FgQK3ZyF0rDDFy', '11999887766'),
(2, 'Antonio Santos', 'antonio@email.com', '$2b$10$5.9mVNqJU1wCvPQT8pxXvOtEE9sKR2GF1s9D5j3FgQK3ZyF0rDDFy', '11988776655'),
(3, 'Matheus Oliveira', 'matheus@email.com', '$2b$10$5.9mVNqJU1wCvPQT8pxXvOtEE9sKR2GF1s9D5j3FgQK3ZyF0rDDFy', '11977665544');

-- Ajustando a sequência de usuários
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));

-- Inserindo locais
INSERT INTO locais (id, latitude, longitude, endereco) VALUES
(1, -23.550520, -46.633308, 'Praça da Sé, 68 - Sé, São Paulo - SP'),
(2, -23.561729, -46.655874, 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP'),
(3, -23.557687, -46.669787, 'Rua Augusta, 1000 - Consolação, São Paulo - SP');

-- Ajustando a sequência de locais
SELECT setval('locais_id_seq', (SELECT MAX(id) FROM locais));

-- Inserindo eventos
INSERT INTO eventos (id, nome, data, hora, descricao, criador_id, local_id) VALUES
(1, 'Workshop de Programação React', '2024-04-15', '14:00', 'Workshop prático sobre desenvolvimento web com React e TypeScript', 1, 1),
(2, 'Meetup de Tecnologia', '2024-04-20', '19:00', 'Encontro para discussão sobre novas tecnologias e networking', 2, 2),
(3, 'Hackathon Even4', '2024-05-01', '09:00', 'Maratona de programação com duração de 48h - Prêmios para os melhores projetos', 3, 3);

-- Ajustando a sequência de eventos
SELECT setval('eventos_id_seq', (SELECT MAX(id) FROM eventos));

-- Inserindo participantes
INSERT INTO participantes (usuario_id, evento_id, status) VALUES
(2, 1, 'CONFIRMADO'),  -- Antonio confirmado no Workshop
(3, 1, 'PENDENTE'),    -- Matheus pendente no Workshop
(1, 2, 'CONFIRMADO'),  -- Gednilson confirmado no Meetup
(3, 2, 'CONFIRMADO'),  -- Matheus confirmado no Meetup
(1, 3, 'CONFIRMADO'),  -- Gednilson confirmado no Hackathon
(2, 3, 'RECUSADO');    -- Antonio recusou o Hackathon

-- Ajustando a sequência de participantes
SELECT setval('participantes_id_seq', (SELECT MAX(id) FROM participantes));

-- Recriando as chaves estrangeiras
ALTER TABLE eventos 
    ADD CONSTRAINT eventos_criador_id_fkey 
    FOREIGN KEY (criador_id) REFERENCES usuarios(id);

ALTER TABLE eventos 
    ADD CONSTRAINT eventos_local_id_fkey 
    FOREIGN KEY (local_id) REFERENCES locais(id);

ALTER TABLE participantes 
    ADD CONSTRAINT participantes_usuario_id_fkey 
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id);

ALTER TABLE participantes 
    ADD CONSTRAINT participantes_evento_id_fkey 
    FOREIGN KEY (evento_id) REFERENCES eventos(id); 