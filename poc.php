<?php

function decrypt($filename, $key, $email)
{
    $plaintext = shell_exec("sops --decrypt $filename");
    $plainvault = json_decode($plaintext, true);

    if (($plainvault["data"]["acl"][$email] ?? false) !== $email) {
        throw new \Exception("wrong email");
    }

    return $plainvault["data"]["secret"][$key]['value'];
}

function get_vaults()
{
    $vaults = [];
    $vault_files = array_filter(scandir("./data"), function ($x) {
        return $x == '.' || $x == '..' ? false : true;
    });

    foreach ($vault_files as $vault_file) {
        $vaults[] = json_decode(file_get_contents($vault_file), true);
    }
    return $vaults;
}

function format_vaults($vault) {
    $name = $vault["data"]["name_unencrypted"];
    $description = $vault["data"]["description_unencrypted"];
    $secrets = $vault["data"]["secret"];

    $buffer = "<div class=\"vault\">";
    $buffer .= "<div class=\"name\">$name</div><div class=\"description\">$description</div>";

    foreach ($secrets as $key => $value) {
        $buffer .= "<div class=\"item\">";
        $buffer .= "<div class=\"key\">$key</div><div class=\"description\">{$value["description_unencrypted"]}</div>";
        $buffer .= "<a href=\"#\" onClick=\"javascript:window.open('/get/secret?vault=$name&key=$key','secret','menubar=0,resizable=0,width=350,height=250')\">get password</a>";
        $buffer .= "</div>";
    }
    $buffer .= "</div>";
    return $buffer;
}

function print_header() {
    return <<<EOF
<html>
    <head>
    <style>
    .item { display: flex; justify-content: space-around; }
    .key { display: flex; }

    </style>
    </head>
    <body>
EOF;
}

function print_footer() {
    return <<<EOF
    </body>
</html>
EOF;
}

// $email = $_SERVER['HTTP_X_FORWARDED_EMAIL']??'';
$email = "root@example.com";

if ($_SERVER['REQUEST_METHOD'] == 'GET' && !empty($email)) {
    if ($_SERVER['REQUEST_URI'] == '/') {
        $vaults = get_vaults();
        echo print_header();
        foreach ($vaults as $vault) {
            echo format_vaults($vault);
        }
        echo print_footer();
    } else if (preg_match('|/get/secret\?|', $_SERVER['REQUEST_URI'])) {
        echo "<pre>";
        echo decrypt("./data/".$_GET['vault'], $_GET['key'], $email);
        echo "</pre>";
    } else {
        http_response_code(404);
    }
} else {
    http_response_code(403);
}
