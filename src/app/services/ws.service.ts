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
        
        this.socket.on("tree_refresh", (message) => {
            console.log("tree_refresh", message)
            this.tree = message
        })

        this.socket.on("connect", () => {
            this.socket?.emit("helo")
        });

    }
}