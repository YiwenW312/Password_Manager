import React from 'react'


const CopyToClipboardButton = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Copied to clipboard!')
      },
      err => {
        console.error('Could not copy text: ', err)
      }
    )
  }

  return <button onClick={handleCopy}>Copy</button>
}

export default CopyToClipboardButton
