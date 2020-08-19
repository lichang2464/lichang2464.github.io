<?php

//rtc
$appId = "**************"; // 修改为自己的appid 该方案仅为开发测试使用，正式上线需要使用服务端的AppServer
$appKey = "**************"; // 修改为自己的appkey 该方案仅为开发测试使用，正式上线需要使用服务端的AppServer

//oss
// 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
$accessKeyId = "**************";
$accessKeySecret = "**************";
// Endpoint以杭州为例，其它Region请按实际情况填写。
$endpoint = "**************";
// 设置存储空间名称。
$bucket = "**************";
// 设置文件名称。
$object = "**************";
// <yourLocalFile>由本地文件路径加文件名包括后缀组成，例如/users/local/myfile.txt。
$filePath = "**************";

//mongodb
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$db_name = 'bdb';
$db_document = 'bdb.a';

function FormitDollor($str)
{
    if (is_array($str)) {
        $str = implode(' ', $str);
    }
    if (is_object($str)) {
        $str = '\'' . $str . '\'';
    }
    $i = 0;
    while (strpos($str, '\$')) {
        $str = str_replace('\$', '$', $str);
        if ($i > 100) {
            return '';
            exit;
        }
        $i++;
    }
    return str_replace('$', '\$', $str);
    exit;
}
