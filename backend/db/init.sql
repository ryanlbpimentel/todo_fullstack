CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tarefas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_tarefas_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

CREATE INDEX index_tarefas_usuario_id
    ON tarefas(usuario_id);

CREATE FUNCTION set_atualizado_em()
RETURN TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW()
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_atualizados_em
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION set_atualizado_em();

CREATE TRIGGER trigger_tarefas_atualizados_em
BEFORE UPDATE ON tarefas
FOR EACH ROW
EXECUTE FUNCTION set_atualizado_em();