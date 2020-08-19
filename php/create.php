<?php
header('Access-Control-Allow-Origin:*');
include 'config.php';

$a = $_GET["a"];
$b = $_GET["b"];

if (empty($a)) {
    exit;
} else if ($a == "test") {
    echo ("testing");
    exit;
}

$bulk = new MongoDB\Driver\BulkWrite;
$document = [
    '_id' => new MongoDB\BSON\ObjectID,
    'a' => $a,
    'b' => $b
];
$_id = $bulk->insert($document);
$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
$result = $manager->executeBulkWrite($db_name . '.' . $db_document, $bulk, $writeConcern);
if ($result) {
    echo $document["_id"];
    $redis->set("isBuckuped", false);
}
