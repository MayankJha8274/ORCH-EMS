import React from 'react'

export default function EmergencyList({ emergencies = [], onDispatch = ()=>{} }){
  if(!emergencies.length) return <div style={{padding:12}}>No emergencies</div>
  return (
    <div>
      {emergencies.map(e => (
        <div key={e._id||e.id} style={{padding:12, borderBottom:'1px solid #eee'}}>
          <div><strong>{e.caller||e.type||'Emergency'}</strong></div>
          <div>Severity: {e.severity ?? 'N/A'}</div>
          <div>Location: {e.location?.lat},{e.location?.lng}</div>
          <div style={{marginTop:8}}><button onClick={()=>onDispatch(e._id||e.id)}>Dispatch</button></div>
        </div>
      ))}
    </div>
  )
}
