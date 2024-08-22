import React from 'react'

function LeaveRegect() {
  // how to take url parameter in react

  const url = window.location.href;
  const urlParts = url.split('/');
  console.log(urlParts);
  return (
    <div>LeaveRegect</div>
  )
}

export default LeaveRegect