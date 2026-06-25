CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Dropar tabelas na ordem correta (por causa das foreign keys)
DROP TABLE IF EXISTS pedido_item CASCADE;
DROP TABLE IF EXISTS pedido CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS mesa CASCADE;
DROP TABLE IF EXISTS garcom CASCADE;
DROP TABLE IF EXISTS restaurante CASCADE;
DROP TABLE IF EXISTS administrador CASCADE;

-- Restaurante (sem FK para administrador, conforme repositório)
CREATE TABLE restaurante (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    endereco VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Administrador (com password_hash, restaurante_id e role)
CREATE TABLE administrador (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    restaurante_id VARCHAR(255) REFERENCES restaurante(id),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Garcom (com email ao invés de cpf, com role, sem senha)
CREATE TABLE garcom (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    restaurante_id VARCHAR(255) REFERENCES restaurante(id),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesa (com status)
CREATE TABLE mesa (
    id VARCHAR(255) PRIMARY KEY,
    numero INT NOT NULL,
    capacidade INT,
    status VARCHAR(50) DEFAULT 'LIVRE',
    restaurante_id VARCHAR(255) REFERENCES restaurante(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Item (com descricao e categoria)
CREATE TABLE item (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    restaurante_id VARCHAR(255) REFERENCES restaurante(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedido (com tempo_preparo e tempo_espera)
CREATE TABLE pedido (
    id VARCHAR(255) PRIMARY KEY,
    mesa_id VARCHAR(255) REFERENCES mesa(id),
    garcom_id VARCHAR(255) REFERENCES garcom(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
    valor_total DECIMAL(10,2) DEFAULT 0,
    tempo_preparo INT,
    tempo_espera INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedido Item
CREATE TABLE pedido_item (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pedido_id VARCHAR(255) REFERENCES pedido(id),
    item_id VARCHAR(255) REFERENCES item(id),
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL
);
