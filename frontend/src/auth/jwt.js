function base64UrlToBase64(base64Url){
    const base64 = base64Url.replace(/-/g,"+").replace(/_/g,"/")

    let result = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(result);
}

export function decodeJwtPayload(token) {
    
}