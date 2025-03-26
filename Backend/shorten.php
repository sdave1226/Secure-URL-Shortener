<?php
include 'config.php';
session_start();

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
$longUrl = $data['longUrl']; // Correct key

if (isset($longUrl) && filter_var($longUrl, FILTER_VALIDATE_URL)) {
    $short_code = substr(md5(uniqid()), 0, 6);
    $user_id = $_SESSION['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO urls (user_id, long_url, short_code, created_at) VALUES (?, ?, ?, NOW())");
    
    if ($stmt->execute([$user_id, $longUrl, $short_code])) {
        echo json_encode([
            "success" => true,
            "short_url" => "http://localhost/" . $short_code,
            "longUrl" => $longUrl
        ]);
    } else {
        echo json_encode(["error" => "URL shortening failed"]);
    }
} else {
    echo json_encode(["error" => "Invalid URL"]);
}
?>