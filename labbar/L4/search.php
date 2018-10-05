<?php

    //database information
    $server = "mysql-vt2018.csc.kth.se";
    $username = "rumman_admin";
    $password = "J5yULeh1FJl5";
    $dbname = "rumman";

    //Fetch all variables from Ajax post request
    $minPrice = $_REQUEST['minPrice'];
    $maxPrice = $_REQUEST['maxPrice'];
    $minArea = $_REQUEST['minArea'];
    $maxArea = $_REQUEST['maxArea'];
    $minRoom = $_REQUEST['minRooms'];
    $maxRoom = $_REQUEST['maxRooms'];
    $minFee = $_REQUEST['minFee'];
    $maxFee = $_REQUEST['maxFee'];
    $objectType = $_REQUEST['type'];
    $community = $_REQUEST['lan'];
    $col = $_REQUEST['col'];
    $direction = $_REQUEST['order'];

    //set cookie
    $sessionCookie = $minPrice.",".$maxPrice.",".$minArea.",".$maxArea.",".$minRoom.",".$maxRoom.",".$minFee.",".$maxFee.",".$community.",".$objectType;
    $expireTime = time() + 80; // just for a few sec for testing
    setcookie('session',$sessionCookie, $expireTime);

    try{
        //PHD dataObject with direct statements, utf capable
        $conn = new PDO("mysql:host=$server;dbname=$dbname;charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        //valid inputs for $col and $direction
        $valid_directions = array("ASC", "DESC");
        $valid_columns = array("area", "pris", "lan","rum", "avgift", "adress");

        //We need to manually check if the direction and col is valid, because prepared statements does not let use bind_param in an ORDER BY clause
        if(in_array($direction, $valid_directions) && in_array($col, $valid_columns)){

            $sql = "SELECT * FROM bostader WHERE pris >= :minPrice  AND pris <= :maxPrice AND area >= :minArea AND area <= :maxArea AND rum >= :minRoom AND rum <= :maxRoom AND avgift >= :minFee AND avgift <= :maxFee AND lan = :community AND objekttyp = :objectType ORDER BY " .$col. " " .$direction;

        }
        //if these values are not valid or null we sort by the deafault value which is by descending price
        else{

            $sql = "SELECT * FROM bostader WHERE pris >= :minPrice  AND pris <= :maxPrice AND area >= :minArea AND area <= :maxArea AND rum >= :minRoom AND rum <= :maxRoom AND avgift >= :minFee AND avgift <= :maxFee AND lan = :community AND objekttyp = :objectType ORDER BY pris DESC";

        }

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':minPrice', $minPrice, PDO::PARAM_INT);
        $stmt->bindParam(':maxPrice', $maxPrice, PDO::PARAM_INT);
        $stmt->bindParam(':minArea', $minArea, PDO::PARAM_INT);
        $stmt->bindParam(':maxArea', $maxArea, PDO::PARAM_INT);
        $stmt->bindParam(':minRoom', $minRoom, PDO::PARAM_INT);
        $stmt->bindParam(':maxRoom', $maxRoom, PDO::PARAM_INT);
        $stmt->bindParam(':minFee', $minFee, PDO::PARAM_INT);
        $stmt->bindParam(':maxFee', $maxFee, PDO::PARAM_INT);
        $stmt->bindParam(':community', $community, PDO::PARAM_STR);
        $stmt->bindParam(':objectType', $objectType, PDO::PARAM_STR);

        $stmt->execute();

        $stmt->setFetchMode(PDO::FETCH_ASSOC);

        while($row = $stmt->fetch()) {
            echo "<tr>";
              echo "<td>" . $row['lan'] . "</td> ";
              echo "<td>" . $row['objekttyp'] . "</td> ";
              echo "<td>" . $row['adress'] . "</td>  ";
              echo "<td>" . $row['rum'] . "</td> ";
              echo "<td>" . $row['area'] . "</td>  ";
              echo "<td>" . $row['avgift'] . "</td>";
              echo "<td>" . $row['pris'] . "</td>  ";
            echo "</tr>";
          }

    //error handling
    }
    catch(PDOException $e) {
      echo "Error: " . $e->getMessage();
    }
      
?>

  
