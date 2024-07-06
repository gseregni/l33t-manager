import { Injectable } from "@angular/core";
import { io, Socket } from 'socket.io-client';


@Injectable({
    providedIn: 'root'
})
export class WSService {
    
    socket: Socket | undefined;
    public variables: {} = {};
    tree: any;

    constructor() {
        this.start()
    }

    async start() {

        const config = {
        iceServers: [
            { 
            "urls": "stun:stun.l.google.com:19302",
            }
        ]
        };

        this.socket = await io("http://localhost:1337");
        
        console.log("STARTTTTT ")
        
        this.socket.on("tree_refresh", (message) => {
            // console.log("read1", message)
            // var vs = JSON.parse(message)
            // console.log(message)
            this.tree = message
           /*  vs.forEach(v => {
                let h = this.getHandle(v.name)
                h.plc = v.plc
                h.value = v.value
                this.change$.next(h)
            }) */
            // console.log("read2", this.variables)
        })

        this.socket.on("connect", () => {
            this.socket?.emit("helo")
           /*  this.socket.emit("plc_subscriber",this.socket.id, "RULLIERA")
            this.socket.emit("plc_subscriber",this.socket.id, "ZONA3")
            this.socket.emit("plc_subscriber",this.socket.id, "ASPIRAZIONE") */
        });

    }
}