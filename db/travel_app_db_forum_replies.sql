-- TABLA: forum_replies
-- Descripción: Respuestas de usuarios a los temas del foro.

DROP TABLE IF EXISTS forum_replies;

CREATE TABLE forum_replies (
    reply_id    INT AUTO_INCREMENT PRIMARY KEY,
    topic_id    INT NOT NULL,
    user_id     INT NOT NULL,
    reply_text  TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_forum_replies_topic (topic_id),
    INDEX idx_forum_replies_user (user_id),

    -- Relaciones al final
    CONSTRAINT fk_forum_replies_topic 
        FOREIGN KEY (topic_id) REFERENCES forum_topics (topic_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_forum_replies_user 
        FOREIGN KEY (user_id) REFERENCES users (user_id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;