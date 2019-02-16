<?php


    ob_start();
    session_start();
    //  *************** For PostgreSQL
        $dsn = "pgsql:host=localhost;dbname=postgres;port=5432";
        $opt = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false
        ];
        $pdo = new PDO($dsn, 'postgres', 'pcsemarnat!', $opt);
    //  *************** For MySQL
    //    $dsn = "mysql:host=localhost;dbname=login_course;port=3306;charset=utf8";
    //    $opt = [
    //        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    //        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    //        PDO::ATTR_EMULATE_PREPARES   => false
    //    ];
    //    $pdo = new PDO($dsn, $user, $pass, $opt);

    include "php_functions.php";
    $adminarray=['forest.carter@gmail.com','jesus.castan@semarnat.gob.mx'];
    $root_directory = "testdir";
    

?>
