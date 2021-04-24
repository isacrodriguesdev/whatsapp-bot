import jwt from "jsonwebtoken"

export interface IJwtControllerAdpter {
  verifyToken(token: string): Promise<any>
}

export class JwtControllerAdpter implements IJwtControllerAdpter {

  verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, "sad", (error: any, decoded: any) => {
        if (error) {
          return reject(error)
        }
        resolve(decoded)
      })
    })
  }
}