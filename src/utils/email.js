const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS  // tu contraseña o app password
    }
});

const sendVerificationEmail = async (to, link) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Correo</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                color: #f57c00; /* Naranja */
                font-size: 32px;
                margin: 0;
            }
            .content {
                text-align: center;
                padding: 20px;
                background-color: #ffecb3; /* Fondo naranja claro */
                border-radius: 8px;
            }
            .content p {
                font-size: 18px;
                margin: 0;
                color: #333;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #f57c00; /* Naranja */
                color: #ffffff;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #e65100; /* Naranja oscuro */
            }
            .footer {
                text-align: center;
                font-size: 14px;
                margin-top: 20px;
                color: #888;
            }
        </style>
    </head>
    <body>

        <div class="container">
            <div class="header">
                <h1>¡Bienvenido a Task Manager!</h1>
            </div>

            <div class="content">
                <p>¡Hola! Gracias por registrarte en nuestra aplicación. Para completar tu registro, por favor haz clic en el siguiente enlace para verificar tu correo electrónico.</p>
                <a href="${link}" class="button">Verificar mi correo</a>
            </div>

            <div class="footer">
                <p>Si no solicitaste este registro, por favor ignora este mensaje.</p>
            </div>
        </div>

    </body>
    </html>
    `;

    await transporter.sendMail({
        from: '"Task Manager" <tuapp@gmail.com>',
        to,
        subject: 'Verifica tu correo',
        html: htmlContent
    });
};

// Función para enviar correo sobre tarea compartida
const sendSharedTaskEmail = async (to, taskTitle, taskDescription, link) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tarea Compartida</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                color: #f57c00; /* Naranja */
                font-size: 32px;
                margin: 0;
            }
            .content {
                text-align: center;
                padding: 20px;
                background-color: #ffecb3; /* Fondo naranja claro */
                border-radius: 8px;
            }
            .content p {
                font-size: 18px;
                margin: 0;
                color: #333;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #f57c00; /* Naranja */
                color: #ffffff;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #e65100; /* Naranja oscuro */
            }
            .footer {
                text-align: center;
                font-size: 14px;
                margin-top: 20px;
                color: #888;
            }
        </style>
    </head>
    <body>

        <div class="container">
            <div class="header">
                <h1>Tarea Compartida</h1>
            </div>

            <div class="content">
                <p>¡Hola! Se te ha asignado una nueva tarea. Los detalles son los siguientes:</p>
                <p><strong>Título de la tarea:</strong> ${taskTitle}</p>
                <p><strong>Descripción:</strong> ${taskDescription}</p>
                <p>Para ver más detalles y empezar a trabajar en ella, por favor haz clic en el siguiente enlace:</p>
                <a href="${link}" class="button">Ver Tarea</a>
            </div>

            <div class="footer">
                <p>Si tienes alguna duda o problema, contacta con el administrador.</p>
            </div>
        </div>

    </body>
    </html>
    `;

    await transporter.sendMail({
        from: '"Task Manager" <tuapp@gmail.com>',
        to,
        subject: 'Tarea compartida contigo',
        html: htmlContent
    });
};

module.exports = { sendVerificationEmail, sendSharedTaskEmail };
