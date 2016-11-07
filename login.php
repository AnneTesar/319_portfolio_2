<?php 
$dbservername = "mysql.cs.iastate.edu";
$dbusername = "dbu319t36";
$dbpassword = "5as-Azut";
$dbname = "db319t36";

$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
	echo "connection failed\n";
}

$sql = "SELECT * FROM shelves;";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$data[] = array("lat"=>$row["shelfId"], "lon"=>$row["shelfName"]);
	}
}

$conn->close();

echo json_encode($data);
?>
