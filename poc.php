<?php

class AuthException extends \Exception {}

function decrypt($filename, $key, $email)
{
    exec("sops --decrypt $filename", $output, $return_var);

    if ($return_var != 0) {
        throw new \Exception();
    }

    $plaintext = implode("\n", $output);
    $plainvault = json_decode($plaintext, true);

    if (($plainvault["data"]["acl"][$email] ?? false) !== $email) {
        throw new AuthException();
    }

    return $plainvault["data"]["secret"][$key]['value'];
}

function get_vaults($email)
{
    $vaults = [];
    $vault_files = array_filter(scandir("./vault"), function ($x) {
        return $x == '.' || $x == '..' ? false : true;
    });

    foreach ($vault_files as $vault_file) {
        $decoded_vault = json_decode(file_get_contents("./vault/" . $vault_file), true);
        if (in_array($email, array_keys($decoded_vault['data']['acl']))) {
            $vaults[$vault_file] = $decoded_vault;
        }
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

function print_header($email) {
    return <<<EOF
<html>
    <head>
    <style>
    .item { display: flex; justify-content: space-around; }
    .key { display: flex; }

    </style>
    </head>
    <body>
    <div style="width: 600px; margin: 0 auto;">
    <div>Welcome $email</div>
EOF;
}

function print_footer() {
    return <<<EOF
    <div>
    </body>
</html>
EOF;
}

$email = $_SERVER['HTTP_X_FORWARDED_EMAIL'] ?? '';

if ($_SERVER['REQUEST_METHOD'] == 'GET' && !empty($email)) {
    if ($_SERVER['REQUEST_URI'] == '/') {
        $vaults = get_vaults($email);
        echo print_header($email);

        if (empty($vaults)) { echo "<div>There is no accessible vault for you</div>";}
        foreach ($vaults as $vault) {
            echo format_vaults($vault);
        }
        echo print_footer();
    } else if (preg_match('|/get/secret\?|', $_SERVER['REQUEST_URI'])) {
        try {
            $secret = htmlspecialchars(decrypt("./vault/".$_GET['vault'], $_GET['key'], $email));
            echo "<pre>$secret</pre>";
        } catch (AuthException $ex) {
            http_response_code(403); 
        } catch (\Exception $ex) {
            http_response_code(500); 
        }
    } else {
        http_response_code(404);
    }
} else {
    http_response_code(403);
}
