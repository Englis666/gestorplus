<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Service;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {
    public static function enviarCorreo($para, $asunto, $contenidoHtml): bool {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp-relay-offshore-southamerica-east-v2.sendinblue.com';
            $mail->SMTPAuth = true;                 
            $mail->Username = '8d5363001@smtp-brevo.com';  // Tu usuario SMTP (email)
            $mail->Password = 'JLANaUHRTcVs3b0t';            // La contraseña o token SMTP (nota la P mayúscula)
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom('scrimsdiscord2@gmail.com', 'GestorPlus');
            $mail->addAddress($para);

            $mail->isHTML(true);
            $mail->Subject = $asunto;
            $mail->Body    = $contenidoHtml;

            $mail->send();
            return true;

        }  catch (Exception $e) {
            throw new \Exception('Error al enviar correo: ' . $e->getMessage());
        }
    }
}
