import { useCallback, useState } from 'react'

export default function UploadDropzone({ onChange }: { onChange?: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([])

  const handleFiles = useCallback((list: FileList | null) => {
    if (!list) return
    const arr = Array.from(list).slice(0, 10)
    setFiles((prev) => {
      const next = [...prev, ...arr]
      onChange?.(next)
      return next
    })
  }, [onChange])

  const remove = (index: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index)
      onChange?.(next)
      return next
    })
  }

  return (
    <div>
      <label className="upload-label">
        <div className="upload-dropbox">
          <svg className="upload-icon" width="36" height="36" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 3v9" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 7l4-4 4 4" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 15v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" stroke="#6366F1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="upload-heading">Drag & drop property images</div>
          <div className="upload-copy">JPG, PNG, WEBP, PDF • Max 10MB per file</div>
          <div className="upload-action">Choose files</div>
        </div>
        <input className="sr-only" type="file" multiple accept="image/*,application/pdf" onChange={(e) => handleFiles(e.target.files)} />
      </label>

      {files.length > 0 && (
        <div className="upload-files">
          {files.map((f, i) => (
            <div key={i} className="upload-file">
              <div className="upload-file-icon" />
              <div className="upload-file-text">
                <div>{f.name}</div>
                <div className="upload-file-size">{(f.size / 1024).toFixed(1)} KB</div>
              </div>
              <button onClick={() => remove(i)} className="remove-button" type="button" aria-label="Remove file">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
