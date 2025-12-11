const nodemailer = require('nodemailer');

// Configuración (usar variables de entorno en producción)
const transporter = nodemailer.createTransport({
  service: 'gmail', // O tu proveedor SMTP
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación (App Password)
  }
});

async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: '"Travel App" <no-reply@travelapp.com>',
      to,
      subject,
      text
    });
    console.log("Email enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error enviando email:", error);
    // No lanzamos error para no detener el flujo principal de la app
  }
}

module.exports = { sendEmail };