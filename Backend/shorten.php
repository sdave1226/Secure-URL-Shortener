<?php
include 'config.php';
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow specific request methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow necessary headers

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['url']) && filter_var($data['url'], FILTER_VALIDATE_URL)) {
    $short_code = substr(md5(uniqid()), 0, 6);
    $stmt = $pdo->prepare("INSERT INTO urls (user_id, long_url, short_code, created_at) VALUES (?, ?, ?, NOW())");
    
    if ($stmt->execute([$_SESSION['user_id'], $data['url'], $short_code])) {
        echo json_encode(["short_url" => "http://localhost/" . $short_code]);
    } else {
        echo json_encode(["error" => "URL shortening failed"]);
    }
} else {
    echo json_encode(["error" => "Invalid URL"]);
}
?>
