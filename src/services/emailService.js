const brevo = require('@getbrevo/brevo');
const fs = require('fs');
const path = require('path');

const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

function parseEmailFrom(emailFrom) {
  const match = emailFrom.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].replace(/"/g, '').trim(), email: match[2].trim() };
  }
  return { email: emailFrom };
}

/**
 * Lee un template HTML y reemplaza las variables
 * @param {string} templateName - Nombre del template (sin extensión)
 * @param {object} variables - Objeto con las variables a reemplazar
 * @returns {string} HTML procesado
 */
function loadTemplate(templateName, variables) {
  try {
    const templatePath = path.join(
      __dirname,
      '../templates/emails',
      `${templateName}.html`
    );
    let html = fs.readFileSync(templatePath, 'utf8');

    // Reemplazar todas las variables del template
    Object.keys(variables).forEach((key) => {
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
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = parseEmailFrom(process.env.EMAIL_FROM || 'no-reply@travelapp.com');
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email enviado: %s', data.messageId);
    return { messageId: data.messageId };
  } catch (error) {
    console.error('Error enviando email:', error);
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
    const text = html.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n');

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = parseEmailFrom(process.env.EMAIL_FROM || 'no-reply@travelapp.com');
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email con template enviado: %s', data.messageId);
    return { messageId: data.messageId };
  } catch (error) {
    console.error('Error enviando email con template:', error);
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
async function sendConfirmationEmail(
  userEmail,
  userName,
  password,
  confirmationToken
) {
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
        confirmationUrl: confirmationUrl,
      }
    );
    console.log(`Email de confirmación enviado a ${userEmail}`);
  } catch (error) {
    console.error(
      `Error enviando email de confirmación a ${userEmail}:`,
      error
    );
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
        frontendUrl: frontendUrl,
      }
    );
    console.log(`Email de bienvenida (confirmado) enviado a ${userEmail}`);
  } catch (error) {
    console.error(
      `Error enviando email de bienvenida confirmado a ${userEmail}:`,
      error
    );
    // No lanzamos el error para no interrumpir la confirmación
  }
}

async function sendPasswordResetEmail(userEmail, userName, resetUrl) {
  try {
    await sendEmailWithTemplate(
      userEmail,
      'Restablece tu contraseña - Travel App',
      'password-reset-email',
      {
        userName: userName,
        resetUrl: resetUrl,
      }
    );
    console.log(`Email de reset de contraseña enviado a ${userEmail}`);
  } catch (error) {
    console.error(
      `Error enviando email de reset de contraseña a ${userEmail}:`,
      error
    );
    throw error;
  }
}

async function sendPasswordResetConfirmationEmail(
  userEmail,
  userName,
  email,
  password
) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

  try {
    await sendEmailWithTemplate(
      userEmail,
      'Contraseña restablecida exitosamente - Travel App',
      'password-reset-confirmation-email',
      {
        userName: userName,
        userEmail: email,
        userPassword: password,
        frontendUrl: frontendUrl,
      }
    );
    console.log(
      `Email de confirmación de reset de contraseña enviado a ${userEmail}`
    );
  } catch (error) {
    console.error(
      `Error enviando email de confirmación de reset a ${userEmail}:`,
      error
    );
    throw error;
  }
}

module.exports = {
  sendEmail,
  sendEmailWithTemplate,
  sendConfirmationEmail,
  sendWelcomeConfirmedEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
};
