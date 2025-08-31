import { useEffect, useState } from 'react'

const API = 'http://localhost:4000/drugs'

export default function DrugResult({ term }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [drug, setDrug] = useState(null)

  useEffect(() => {
    if (!term) return

    const controller = new AbortController()
    const options = { signal: controller.signal }

    async function fetchDrug() {
      try {
        setLoading(true)
        setError(null)
        setDrug(null)

        const response = await fetch(API, options)

        if (!response.ok) throw new Error(`👩🏻‍⚕️ : 요청된 약은 존재하지 않습니다.`)

        const responseData = await response.json()
        const keyword = term.trim().toLowerCase()

        const matchedDrug =
          responseData.find((drug) =>
            drug.name?.toLowerCase().includes(keyword)
          ) ||
          responseData.find((drug) =>
            drug.engName?.toLowerCase().includes(keyword)
          ) ||
          null

        if (!matchedDrug) {
          setError(new Error('검색 결과가 없습니다. 😢'))
          return
        }

        setDrug(matchedDrug)
      } catch (error) {
        if (error.name !== 'AbortError') setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrug()
    return () => controller.abort()
  }, [term])

  if (loading) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-indigo-300 font-semibold text-xl mt-6"
      >
        로딩 중...
      </p>
    )
  }

  if (error) {
    return (
      <p
        role="alert"
        aria-live="assertive"
        className="text-red-400 text-base mt-6"
      >
        {error.message}
      </p>
    )
  }

  return (
    drug && (
      <article className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold">{drug.name}</h2>
        <p className="text-slate-500">{drug.engName}</p>
      </article>
    )
  )
}
