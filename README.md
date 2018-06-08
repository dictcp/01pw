01pw - n0t 1PassWord
========

It is a proof-of-concept on a simple secure password storage service.
Leveraging SOPS, we can potentially to keep a vault file with encrpyted password at GitHub, and deploying the Docker container via CI/CD as a web service, authorized by oauth2_proxy and authenticated according to vault file.

To test this proof-of-concept, you may try
```
$ sops --encrypt --pgp F9E9048752EB069F example.json.plaintext > example.json
$ yarn dev
```
then open the web http://127.0.0.1:3000/

![Image of PoC](https://rawgit.com/dictcp/01pw/master/poc.png)

