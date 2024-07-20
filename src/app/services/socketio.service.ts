import { effect, Injectable, signal } from "@angular/core";
import { io, Socket } from 'socket.io-client';
import { SelectionService } from "./selection.service";


@Injectable({
    providedIn: 'root'
})
export class WSService {
    
    socket: Socket | undefined;
    public variables: {} = {};
    tree: any;
    public timestamp = signal(0)
    public callbacks:Function[] = []

    constructor(
        private selectionService: SelectionService
    ) {
        this.start()

    }

    onUpdate(callback:Function) {
        this.callbacks.push(callback)
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
            this.timestamp.update(() => Date.now())
            console.log("tree_refresh", message)

            
            this.tree = message


            this.selectionService.selection.set(this.tree.areas[0].agents[0])


            // this.callbacks.forEach((callback) => {
            //     console.log("Calling callback")
            //     callback()
            // })

        })

        this.socket.on("connect", () => {
            this.socket?.emit("helo")
        });

    }
}