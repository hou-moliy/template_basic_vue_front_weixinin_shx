import {
	JSEncrypt
} from 'wxmp-rsa'
import {
	encode,
	decode,
	Base64
} from '@/utils/base.js'
// import RSA from '@/utils/wx_rsa.js'

const rsaEncryption = (str) => {
	//定义公钥
	const publicKey =
		`MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsGBIVmDa7kGZiH2Pqw68ES1gF8kw3MCrQtZM+f/AavMUqhZ0wb8E4wNSNCWfCnr8X5C3eHI9kH++lBv+Y1/vm5kICi/XEK3Ts2bRkI0NyqcN7gRnbGx2Dpklo6ida6mrEatOLzG0Ea0+1oXGNC0JHDhqtHVmH4yk8Q0YxGzI4MQIDAQAB`
	const myEncrypt = new JSEncrypt()
	myEncrypt.setPublicKey(publicKey)
	const cryptStr = myEncrypt.encryptLong(str)
	return cryptStr
}
const rsaDecryption = (str) => {
	//定义私钥
	const privateKey =
		`MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAroThZpHc8IoJgkk/awwc0rBY6tG2naE4KGA6dhRX6EYHGnqM+oSms6+x4I1f5MuFq9DoolodW0CnSDm995csawIDAQABAkBUkOVcO4AxOuJitLW7XJI28ecUWmzAM1gwEHkjsLXsQfvQ+QdvhEKTb2jirRv7ulVr2BfwNjvrVbllD4iMGzI5AiEA86wfvZfic2Gtw44Otu3+kI2U5uO0iMec/q7uyOQ4m7UCIQC3WSF7xyzu6EK5crMJVlLOAO+QZs1m10J3ebnFGzT7nwIgWk4P9VO0uM4ad77N9T1+elP+OxNodMiFhl2OYSUzVYECIE2jEVmfenhjozVxyzwt8HxIyyiDT4C3r+51feNn5OSTAiAZR6ys4lJhmPGFHGwvB9AW+sUnbOjcn8m/XsFjqJ7/Jw==`
	const myEncrypt = new JSEncrypt()
	myEncrypt.setPrivateKey(privateKey)
	const cryptStr = myEncrypt.decryptLong(str)
	return cryptStr
}


module.exports = {
	rsaEncryption,
	rsaDecryption
}
