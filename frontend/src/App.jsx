import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { initSocket, socket } from './services/socketClient'
import EmergencyList from './components/EmergencyList'
import MapView from './components/MapView'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App(){
  const [emergencies, setEmergencies] = useState([])
  const [ambulances, setAmbulances] = useState([])
  const [hospitals, setHospitals] = useState([])

  useEffect(()=>{
    initSocket(API)
    socket.on('connect', ()=>console.log('socket connected'))
    socket.on('emergency.created', (d)=>{ setEmergencies(prev => [d.emergency, ...prev]) })
    socket.on('dispatch.created', ()=> fetchAll())
    fetchAll()
    return ()=>{
      socket.off('emergency.created')
      socket.off('dispatch.created')
    }
  }, [])

  async function fetchAll(){
    try{
      const [eRes,aRes,hRes] = await Promise.all([
        axios.get(`${API}/api/emergencies`),
        axios.get(`${API}/api/ambulances`),
        axios.get(`${API}/api/hospitals`)
      ])
      setEmergencies(eRes.data.data || eRes.data)
      setAmbulances(aRes.data.data || aRes.data)
      setHospitals(hRes.data.data || hRes.data)
    }catch(err){ console.error(err) }
  }

  async function handleDispatch(id){
    try{ await axios.post(`${API}/api/dispatch`, { emergencyId: id }); fetchAll() }catch(err){ alert('Dispatch failed: '+(err.response?.data?.message||err.message)) }
  }

  return (
    <div style={{display:'flex', height:'100vh'}}>
      <div style={{width:360, borderRight:'1px solid #ddd', overflow:'auto'}}>
        <h3 style={{padding:12}}>Emergencies</h3>
        <EmergencyList emergencies={emergencies} onDispatch={handleDispatch} />
      </div>
      <div style={{flex:1}}>
        <MapView emergencies={emergencies} ambulances={ambulances} hospitals={hospitals} />
      </div>
    </div>
  )
}
