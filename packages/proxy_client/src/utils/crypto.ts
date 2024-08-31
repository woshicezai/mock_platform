import JSEncrypt from 'jsencrypt';

export function encrypt(message: string, publicKey: string): string {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(message);
}
