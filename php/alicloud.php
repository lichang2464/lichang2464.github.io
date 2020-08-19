<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

$channelId = trim((string) $_GET["channelId"]);
$userId = trim((string) $_GET["userId"]);
$nonce = trim((string) $_GET["nonce"]);
$timestamp = trim((string) $_GET["timestamp"]);

if ($channelId  == null)
    die;
if ($userId  == null)
    die;
if ($nonce  == null)
    die;
if ($timestamp  == null)
    die;

try {
    $token = hash("sha256", $appId . $appKey . $channelId . $userId . $nonce . $timestamp);
    echo $token;
    exit;
} catch (Exception $e) {
    echo $e->getMessage(), "\n";
    exit;
}