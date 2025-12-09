-- TABLA: forum_topics
-- Descripción: Temas principales del foro general.

DROP TABLE IF EXISTS forum_topics;

CREATE TABLE forum_topics (
    topic_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    title       VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    category    VARCHAR(100) DEFAULT 'General',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_forum_topics_user (user_id),
    INDEX idx_forum_topics_category (category),

    -- Relaciones al final
    CONSTRAINT fk_forum_topics_user 
        FOREIGN KEY (user_id) REFERENCES users (user_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;