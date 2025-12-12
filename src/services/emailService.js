const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configuración (usar variables de entorno en producción)
const transporter = nodemailer.createTransport({
  service: 'gmail', // O tu proveedor SMTP
  auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación (App Password)
  }
});

/**
 * Lee un template HTML y reemplaza las variables
 * @param {string} templateName - Nombre del template (sin extensión)
 * @param {object} variables - Objeto con las variables a reemplazar
 * @returns {string} HTML procesado
 */
function loadTemplate(templateName, variables) {
  try {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Reemplazar todas las variables del template
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, variables[key] || '');
    });
    
    return html;
  } catch (error) {
    console.error(`Error cargando template ${templateName}:`, error);
    throw error;
  }
}

/**
 * Envía un email simple (texto plano)
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del email
 * @param {string} text - Contenido del email (texto plano)
 */
async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Travel App" <no-reply@travelapp.com>',
      to,
      subject,
      text
    });
    console.log("Email enviado: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email:", error);
    // No lanzamos error para no detener el flujo principal de la app
    throw error;
  }
}

/**
 * Envía un email con template HTML
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del email
 * @param {string} templateName - Nombre del template (sin extensión .html)
 * @param {object} variables - Variables para reemplazar en el template
 */
async function sendEmailWithTemplate(to, subject, templateName, variables) {
  try {
    const html = loadTemplate(templateName, variables);
    
    // Generar versión texto plano básica
    const text = html.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n');
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Travel App" <no-reply@travelapp.com>',
      to,
      subject,
      text,
      html
    });
    
    console.log("Email con template enviado: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email con template:", error);
    throw error;
  }
}

/**
 * Envía email de confirmación de cuenta al usuario registrado
 * @param {string} userEmail - Email del usuario
 * @param {string} userName - Nombre completo del usuario
 * @param {string} password - Contraseña del usuario (en texto plano)
 * @param {string} confirmationToken - Token de confirmación
 */
async function sendConfirmationEmail(userEmail, userName, password, confirmationToken) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  const confirmationUrl = `${backendUrl}/api/auth/confirm/${confirmationToken}`;
  
  try {
    await sendEmailWithTemplate(
      userEmail,
      'Confirma tu cuenta - Travel App',
      'confirmation-email',
      {
        userName: userName,
        userEmail: userEmail,
        userPassword: password,
        confirmationUrl: confirmationUrl
      }
    );
    console.log(`Email de confirmación enviado a ${userEmail}`);
  } catch (error) {
    console.error(`Error enviando email de confirmación a ${userEmail}:`, error);
    // No lanzamos el error para no interrumpir el registro
  }
}

/**
 * Envía email de bienvenida después de confirmar la cuenta
 * @param {string} userEmail - Email del usuario
 * @param {string} userName - Nombre completo del usuario
 */
async function sendWelcomeConfirmedEmail(userEmail, userName) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  
  try {
    await sendEmailWithTemplate(
      userEmail,
      '¡Cuenta confirmada! Bienvenido a Travel App 🎉',
      'welcome-confirmed-email',
      {
        userName: userName,
        frontendUrl: frontendUrl
      }
    );
    console.log(`Email de bienvenida (confirmado) enviado a ${userEmail}`);
  } catch (error) {
    console.error(`Error enviando email de bienvenida confirmado a ${userEmail}:`, error);
    // No lanzamos el error para no interrumpir la confirmación
  }
}

module.exports = { 
  sendEmail, 
  sendEmailWithTemplate, 
  sendConfirmationEmail,
  sendWelcomeConfirmedEmail
};