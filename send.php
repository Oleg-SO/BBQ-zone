<?php
// send.php — отправка данных заявки в Google Sheets через Google Apps Script
// Замените этот URL на URL вашего опубликованного Apps Script
$googleScriptUrl = 'ВСТАВИТЬ_URL_СКРИПТА';

header('Content-Type: application/json; charset=UTF-8');

function respond($success, $message, $status = 200) {
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

function cleanValue($value) {
    return trim(htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8'));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Неверный метод запроса.', 405);
}

// Поля формы
$name = cleanValue($_POST['name'] ?? '');
$phone = cleanValue($_POST['phone'] ?? '');
$message = cleanValue($_POST['message'] ?? $_POST['comment'] ?? '');

if ($name === '' || $phone === '') {
    respond(false, 'Пожалуйста, заполните имя и телефон.', 422);
}

$postData = [
    'name' => $name,
    'phone' => $phone,
    'message' => $message,
    'date' => date('Y-m-d H:i:s'),
];

// Отправка данных через cURL
$ch = curl_init($googleScriptUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpCode < 200 || $httpCode >= 300 || trim($response) !== 'OK') {
    $errorText = $response ?: $curlError;
    respond(false, 'Ошибка отправки данных. Попробуйте позже. ' . $errorText, 500);
}

// Если пришёл AJAX-запрос, возвращаем JSON.
// Иначе — выполняем редирект на страницу благодарности.
$acceptHeader = $_SERVER['HTTP_ACCEPT'] ?? '';
if (stripos($acceptHeader, 'application/json') !== false ||
    (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest')) {
    respond(true, 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
}

header('Location: thanks.html');
exit;
