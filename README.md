# qrcode-scanner

[DEMO](https://hk1229.cn/demo/qrcode-scanner/)

Works on Chrome 53+ & FF 38+ theoretically.

------------

HTTPS is required to call WebRTC APIs. Run the following commands to generate certifications and then put them into ./config folder.

```bash
openssl genrsa -out privatekey.pem 1024
openssl req -new -key privatekey.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

