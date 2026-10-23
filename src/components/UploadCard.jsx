import { useRef } from 'react'
import { Upload } from 'lucide-react'

export default function UploadCard({ onSelect }) {
  const inputRef = useRef(null)

  function handleChange(event) {
    const file = event.target.files?.[0]
    if (file) {
      onSelect(file)
    }
    // reset so selecting the same file again still fires onChange
    event.target.value = ''
  }

  return (
    <label className="capture-option" htmlFor="leaf-upload-input">
      <span className="capture-option__icon">
        <Upload size={22} strokeWidth={2} />
      </span>
      <span className="capture-option__title">Upload Leaf Image</span>
      <span className="capture-option__desc">Choose a clear photo of a plant leaf</span>
      <input
        ref={inputRef}
        id="leaf-upload-input"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleChange}
      />
    </label>
  )
}
