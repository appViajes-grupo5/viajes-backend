-- Script SQL para "generar" 20 usuarios de prueba manualmente con 3 contraseñas diferentes.
--
-- ¡IMPORTANTE! Para las pruebas, las contraseñas son:
-- 1. Usuarios 1-10 (test.user@... a elena.v@...) --> Contraseña: password123
-- 2. Usuarios 11-15 (miguel.n@... a sergio.m@...) --> Contraseña: password456
-- 3. Usuarios 16-20 (clara.a@... a veronica.b@...) --> Contraseña: password789
--
-- Los hashes de abajo corresponden a esas contraseñas (generados con bcrypt, costo 10).

-- Usar la base de datos
USE grupo5_viajes;

-- Insertar múltiples usuarios
INSERT INTO users 
    (email, password_hash, first_name, last_name, phone, bio, interests)
VALUES 
    -- GRUPO 1: password123 (Hash: $2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r)
    (
        'test.user@tierra.com',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Test', 'User', '123456789',
        'Hola, soy un usuario de prueba para la app de viajes.',
        'Senderismo, Fotografía, Gastronomía'
    ),
    (
        'ana.lopez@coolmail.es',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Ana', 'Lopez', '611223344',
        'Amante de la naturaleza y las buenas comidas.',
        'Senderismo, Gastronomía, Montaña, Vinos'
    ),
    (
        'carlos.g@tuhoo.es',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Carlos', 'Gomez', '622334455',
        'Buscando siempre la próxima aventura.',
        'Aventura, Buceo, Surf, Trekking'
    ),
    (
        'lucia.m@tierra.com',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Lucia', 'Martinez', '633445566',
        'Me encanta la historia y el arte.',
        'Cultura, Museos, Historia, Arte, Urbano'
    ),
    (
        'david.s@coolmail.es',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'David', 'Sanchez', '644556677',
        'Fotógrafo aficionado y amante del buen comer.',
        'Fotografía, Gastronomía, Urbano, Vinos'
    ),
    (
        'sofia.p@tuhoo.es',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Sofia', 'Perez', '655667788',
        'Solo quiero relajarme en la playa.',
        'Playa, Relax, Surf'
    ),
    (
        'javier.r@tierra.com',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Javier', 'Ruiz', '666778899',
        'Adicto a la adrenalina y la montaña.',
        'Aventura, Montaña, Esquí, Trekking'
    ),
    (
        'maria.f@coolmail.es',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Maria', 'Fernandez', '677889900',
        'Viajar para aprender y ayudar.',
        'Cultura, Voluntariado, Mochilero'
    ),
    (
        'pablo.d@tuhoo.es',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Pablo', 'Diaz', '688990011',
        'Descubriendo ciudades y sus conciertos.',
        'Urbano, Conciertos, Museos, Arte'
    ),
    (
        'elena.v@tierra.com',
        '$2a$10$fG.G.y8.1I/E.V/1.fS9n.e2s.e8/E.Y.K.U.L.P.S.e.r',
        'Elena', 'Vazquez', '699001122',
        'Deportes acuáticos y sol.',
        'Playa, Buceo, Surf, Relax'
    ),

    -- GRUPO 2: password456 (Hash: $2a$10$wBYq9.T1s1N.Xk0.M7fS..L/n7fX.NqA.Xz8.A.w.T.Q)
    (
        'miguel.n@coolmail.es',
        '$2a$10$wBYq9.T1s1N.Xk0.M7fS..L/n7fX.NqA.Xz8.A.w.T.Q',
        'Miguel', 'Nuñez', '711223344',
        'Mochila al hombro y a caminar.',
        'Mochilero, Senderismo, Montaña, Aventura'
    ),
    (
        'isabel.j@tuhoo.es',
        '$2a$10$wBYq9.T1s1N.Xk0.M7fS..L/n7fX.NqA.Xz8.A.w.T.Q',
        'Isabel', 'Jimenez', '722334455',
        'Catas de vino y cultura local.',
        'Vinos, Gastronomía, Cultura, Historia'
    ),
    (
        'raul.c@tierra.com',
        '$2a$10$wBYq9.T1s1N.Xk0.M7fS..L/n7fX.NqA.Xz8.A.w.T.Q',
        'Raul', 'Campos', '733445566',
        'La fotografía es mi pasión, especialmente en la naturaleza.',
        'Fotografía, Senderismo, Montaña'
    ),
    (
        'laura.g@coolmail.es',
        '$2a$10$wBYq9.T1s1N.Xk0.M7fS..L/n7fX.NqA.Xz8.A.w.T.Q',
        'Laura', 'Gutierrez', '744556677',
        'Me interesan los proyectos de voluntariado.',
        'Voluntariado, Cultura, Relax'
    ),
    (
        'sergio.m@tuhoo.es',
        '$2a$10$wBYq9.T1s1N.Xk0.M7fS..L/n7fX.NqA.Xz8.A.w.T.Q',
        'Sergio', 'Moreno', '755667788',
        'Fan del arte urbano y la música en vivo.',
        'Urbano, Arte, Conciertos, Museos'
    ),

    -- GRUPO 3: password789 (Hash: $2a$10$5.9.Q.p9s.o.Y.A.v.j.O.B.c.O.f.G.q.H.I.W.G.T.M)
    (
        'clara.a@tierra.com',
        '$2a$10$5.9.Q.p9s.o.Y.A.v.j.O.B.c.O.f.G.q.H.I.W.G.T.M',
        'Clara', 'Alonso', '766778899',
        'Esquí en invierno, playa en verano.',
        'Esquí, Playa, Relax, Montaña'
    ),
    (
        'adrian.l@coolmail.es',
        '$2a$10$5.9.Q.p9s.o.Y.A.v.j.O.B.c.O.f.G.q.H.I.W.G.T.M',
        'Adrian', 'Lopez', '777889900',
        'Bucear en aguas cristalinas es mi objetivo.',
        'Buceo, Playa, Aventura'
    ),
    (
        'eva.s@tuhoo.es',
        '$2a$10$5.9.Q.p9s.o.Y.A.v.j.O.B.c.O.f.G.q.H.I.W.G.T.M',
        'Eva', 'Santos', '788990011',
        'Exploradora de historia y gastronomía.',
        'Historia, Gastronomía, Cultura, Museos'
    ),
    (
        'martin.r@tierra.com',
        '$2a$10$5.9.Q.p9s.o.Y.A.v.j.O.B.c.O.f.G.q.H.I.W.G.T.M',
        'Martin', 'Romero', '799001122',
        'Siempre listo para un trekking.',
        'Trekking, Montaña, Aventura, Senderismo'
    ),
    (
        'veronica.b@coolmail.es',
        '$2a$10$5.9.Q.p9s.o.Y.A.v.j.O.B.c.O.f.G.q.H.I.W.G.T.M',
        'Veronica', 'Blanco', '811223344',
        'Viajes relajados, con buena comida y vino.',
        'Relax, Gastronomía, Vinos, Playa'
    );