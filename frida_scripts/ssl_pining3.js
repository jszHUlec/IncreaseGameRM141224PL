// Prosty SSL Pinning Bypass dla Frida
Java.perform(function() {
    console.log('[+] SSL Pinning Bypass started');

    // Hook HttpsURLConnection
    try {
        var HttpsURLConnection = Java.use('javax.net.ssl.HttpsURLConnection');
        HttpsURLConnection.setDefaultHostnameVerifier.implementation = function(hostnameVerifier) {
            console.log('[+] Bypassing HttpsURLConnection hostname verification');
        };
    } catch (e) {}

    // Hook SSLContext
    try {
        var SSLContext = Java.use('javax.net.ssl.SSLContext');
        var TrustManager = Java.use('javax.net.ssl.TrustManager');
        var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');

        var TrustManagerImpl = Java.registerClass({
            name: 'org.example.TrustManagerImpl',
            implements: [X509TrustManager],
            methods: {
                checkClientTrusted: function(chain, authType) {},
                checkServerTrusted: function(chain, authType) {},
                getAcceptedIssuers: function() {
                    return Java.array('java.security.cert.X509Certificate', []);
                }
            }
        });

        SSLContext.init.overload('[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom').implementation = function(keyManager, trustManager, secureRandom) {
            console.log('[+] Bypassing SSL pinning in SSLContext');
            var customTrustManager = TrustManagerImpl.$new();
            this.init(keyManager, Java.array('javax.net.ssl.TrustManager', [customTrustManager]), secureRandom);
        };
    } catch (e) {}

    // Hook OkHttp (v2) CertificatePinner
    try {
        var CertificatePinner2 = Java.use('com.squareup.okhttp.CertificatePinner');
        CertificatePinner2.check.overload('java.lang.String', 'java.security.cert.Certificate').implementation = function(hostname, peerCertificate) {
            console.log('[+] Bypassing OkHttp v2 CertificatePinner');
        };
    } catch (e) {}

    // Hook Network Security Config (Android 7+)
    try {
        var NetworkSecurityConfig = Java.use('android.security.net.config.NetworkSecurityConfig');
        var PinSet = Java.use('android.security.net.config.PinSet');

        NetworkSecurityConfig.$init.overload('boolean', 'boolean', 'android.security.net.config.PinSet', 'android.security.net.config.PinSet').implementation = function(cleartextPermitted, hstsEnforced, pins, certificateTransparencyPolicy) {
            console.log('[+] Bypassing Network Security Config');
            this.$init(cleartextPermitted, hstsEnforced, PinSet.EMPTY_PINSET.value, certificateTransparencyPolicy);
        };
    } catch (e) {}

    console.log('[+] SSL Pinning Bypass completed');
});