<?php
header('Content-Type: application/json; charset=UTF-8');

function respond($success, $message, $status = 200) {
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Неверный метод запроса.', 405);
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$comment = trim($_POST['comment'] ?? '');

if ($name === '' || $phone === '') {
    respond(false, 'Пожалуйста, заполните имя и телефон.', 422);
}

// Простая фильтрация
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$comment = htmlspecialchars($comment, ENT_QUOTES, 'UTF-8');

$to = 'info@yourdomain.ru';
$subject = 'Новая заявка с сайта BBQ-zone';
$message = "Новая заявка:\n\nИмя: {$name}\nТелефон: {$phone}\nКомментарий: {$comment}\n\nСайт: {$_SERVER['HTTP_HOST']}";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
$headers[] = 'Reply-To: no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

$mailSent = mail($to, $subject, $message, implode("\r\n", $headers));

if ($mailSent) {
    respond(true, 'Спасибо! Заявка отправлена. Скоро мы с вами свяжемся.');
}

respond(false, 'Не удалось отправить письмо. Проверьте настройки сервера.', 500);
