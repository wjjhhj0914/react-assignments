import { useRef, useState } from 'react'

export default function SearchBar({
  onSearch,
  defaultValue = '',
  placeholder = 'Search',
}) {
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmedSearchTerm = searchTerm.trim()

    if (!trimmedSearchTerm) {
      setErrorMessage('검색어를 입력해주세요! 🤓')
      inputRef.current?.focus()
      return
    }

    setErrorMessage('')
    onSearch?.(trimmedSearchTerm)
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative">
      <label htmlFor="search-drug" className="sr-only">
        약 이름 검색
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          id="search-drug"
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          aria-label="약 이름 검색"
          className="input-field"
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? 'search-error' : undefined}
        />
      </div>
      <button type="submit" className="sr-only">
        검색
      </button>

      {errorMessage && (
        <p
          id="search-error"
          role="alert"
          aria-live="assertive"
          className="mt-3 text-sm text-red-400"
        >
          {errorMessage}
        </p>
      )}
    </form>
  )
}
