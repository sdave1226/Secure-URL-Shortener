<?php
// api.php - API Support
include 'config.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['url']) && filter_var($data['url'], FILTER_VALIDATE_URL)) {
    $short_code = substr(md5(uniqid()), 0, 6);
    $stmt = $pdo->prepare("INSERT INTO urls (long_url, short_code, created_at) VALUES (?, ?, NOW())");
    if ($stmt->execute([$data['url'], $short_code])) {
        echo json_encode(["short_url" => "http://localhost/" . $short_code]);
    } else {
        echo json_encode(["error" => "Failed to shorten URL"]);
    }
}
?>