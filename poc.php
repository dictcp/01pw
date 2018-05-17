<?php

function decrypt($filename, $key, $email) {
    $plaintext = shell_exec("sops --decrypt $filename");
    $plainvault = json_decode($plaintext, true);

    if (($plainvault["data"]["acl"][$email] ?? false) !== $email)
        throw new \Exception("wrong email");

    return $plainvault["data"]["secret"][$key]['value'];
}

$vault_files = array_filter(scandir("./data"), function($x) {
    return $x=='.'||$x=='..' ? false : true;
});

foreach ($vault_files as $vault_file) {
    $vault = json_decode(file_get_contents($vault_file), true);
    $description = $vault["data"]["description_unencrypted"];
    $secrets = $vault["data"]["secret"];

    echo "$description\n";
    echo "================\n";
    foreach ($secrets as $key => $value) {
        echo "- $key (";
        echo $value["description_unencrypted"];
        echo "): ";
        echo decrypt($vault_file, $key, 'root@example.com');
        echo "\n";
    }
}
