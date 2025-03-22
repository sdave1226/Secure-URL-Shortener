<?php
include 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

$stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
if ($stmt->execute([$data['username'], $hashedPassword])) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Registration failed"]);
}
?>