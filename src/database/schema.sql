CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS locais (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    endereco TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    descricao TEXT,
    criador_id INTEGER REFERENCES usuarios(id),
    local_id INTEGER REFERENCES locais(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS participantes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    evento_id INTEGER REFERENCES eventos(id),
    status VARCHAR(20) CHECK (status IN ('CONFIRMADO', 'PENDENTE', 'RECUSADO')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, evento_id)
); 