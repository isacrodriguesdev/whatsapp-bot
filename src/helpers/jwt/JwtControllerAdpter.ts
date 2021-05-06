import jwt from "jsonwebtoken"

export interface IJwtControllerAdpter {
  verifyToken(token: string): Promise<any>
}

export class JwtControllerAdpter implements IJwtControllerAdpter {

  verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, "3794CCAFB59D79C8ACEADE0C86B0353089C717ABFCAAC430A074B8A59A53BDFA", (error: any, decoded: any) => {
        if (error) {
          return reject(error)
        }
        resolve(decoded)
      })
    })
  }
}