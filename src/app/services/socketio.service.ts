import { effect, Injectable, signal } from "@angular/core";
import { io, Socket } from 'socket.io-client';
import { SelectionService } from "./selection.service";


export class MediaCache {
    private cache: Map<string, ArrayBuffer>;

    constructor() {
        this.cache = new Map<string, ArrayBuffer>();
    }

    // Aggiunge un elemento alla cache
    public set(key: string, value: ArrayBuffer): void {
        this.cache.set(key, value);
    }

    // Recupera un elemento dalla cache
    public get(key: string): ArrayBuffer | undefined {
        return this.cache.get(key);
    }

    // Rimuove un elemento dalla cache
    public delete(key: string): boolean {
        return this.cache.delete(key);
    }

    // Verifica se un elemento esiste nella cache
    public has(key: string): boolean {
        return this.cache.has(key);
    }

    // Pulisce l'intera cache
    public clear(): void {
        this.cache.clear();
    }

    // Restituisce il numero di elementi nella cache
    public size(): number {
        return this.cache.size;
    }
}

@Injectable({
    providedIn: 'root'
})
export class WSService {
    
    socket: Socket | undefined;
    public variables: {} = {};
    tree: any;
    public timestamp = signal(0)
    public callbacks:Function[] = []
    
    public mediaCache = new MediaCache();

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
        
        this.socket.on("frame_update", (message) => {
            // this.tree.areas[0].agents[0].img = message.img
            this.mediaCache.set("2", new Uint8Array(message.img))
        })

        this.socket.on("tree_refresh", (message) => {
            this.timestamp.update(() => Date.now())
            console.log("tree_refresh", message)
            this.tree = message
            this.selectionService.selection.set(this.tree.areas[0].agents[0])
        })

        this.socket.on("connect", () => {
            this.socket?.emit("helo")
        });

    }
}