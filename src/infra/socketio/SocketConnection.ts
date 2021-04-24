import express from "express"
import cors from "cors"
import socket from "socket.io"
import http from "http"

const app = express()
const server = http.createServer(app)
const io = socket(server)

app.use(cors())

app.use(express.static(__dirname + "../../../../uploads"))

server.listen(4444, () => {
  console.log("Server started")
})

export { io as socket }