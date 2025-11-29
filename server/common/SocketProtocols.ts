export type playerInfo = {
    x:number,
    y:number,
    rot:number,
    id:string,
    team:string
}

export type message = Array<message> | Object

export interface Sendalbe{
    getInfo():message
}