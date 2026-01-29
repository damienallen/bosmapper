export const getObjectHash = async (obj: any): Promise<string> => {
    // 1. Convert object to a stable string
    const str = JSON.stringify(obj)
    // 2. Encode string as bytes
    const msgUint8 = new TextEncoder().encode(str)
    // 3. Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    // 4. Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
