import { useState } from 'react'
import SearchBar from './components/SearchBar'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 p-4">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span
              className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-500
                   bg-clip-text text-transparent tracking-normal"
            >
              DrugMate
            </span>
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            약 이름으로 검색해 음식 궁합을 확인하세요!
          </p>
        </header>
        <SearchBar onSearch={(term) => setSearchTerm(term)} defaultValue="" />
        <section className="mt-8">
          {searchTerm ? (
            <p className="text-slate-600 text-base">
              <span className="font-medium text-slate-600">
                "{searchTerm}"에 대한 검색 결과입니다.
              </span>
            </p>
          ) : (
            <p className="text-slate-400 text-base">Type to search...</p>
          )}
        </section>
      </div>
    </main>
  )
}
