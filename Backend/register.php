<?php

include 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

// Decode JSON input properly
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Debugging: Print the received data
if ($data === null) {
    echo json_encode(["error" => "Invalid JSON format", "raw_input" => $json]);
    exit;
}

// Ensure data is an array
if (!is_array($data)) {
    echo json_encode(["error" => "Expected JSON object but received something else", "raw_input" => $json]);
    exit;
}

// Ensure required fields are present
if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$name = $data['name'];
$email = $data['email'];
$hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$name, $email, $hashedPassword])) {
        echo json_encode(["success" => true, "message" => "Registration successful"]);
    } else {
        echo json_encode(["error" => "Registration failed"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?> 