import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function MapView({ emergencies=[], ambulances=[], hospitals=[] }){
  const center = emergencies[0]?.location || ambulances[0]?.location || hospitals[0]?.location || { lat:12.97, lng:77.59 }
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={13} style={{height:'100%', width:'100%'}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {ambulances.map(a=> a.location && <Marker key={a._id||a.id} position={[a.location.lat, a.location.lng]}><Popup>Ambulance</Popup></Marker>)}
      {hospitals.map(h=> h.location && <Marker key={h._id||h.id} position={[h.location.lat, h.location.lng]}><Popup>{h.name}</Popup></Marker>)}
      {emergencies.map(e=> e.location && <Marker key={e._id||e.id} position={[e.location.lat, e.location.lng]}><Popup>Emergency</Popup></Marker>)}
    </MapContainer>
  )
}
