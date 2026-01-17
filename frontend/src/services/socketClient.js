import { io as ioClient } from 'socket.io-client'

export const socket = { on: ()=>{}, off: ()=>{}, emit: ()=>{} }

export function initSocket(url){
  try{
    const base = url || import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const s = ioClient(base)
    socket.on = s.on.bind(s)
    socket.off = s.off.bind(s)
    socket.emit = s.emit.bind(s)
    return s
  }catch(err){ console.warn('socket init failed', err); return null }
}
