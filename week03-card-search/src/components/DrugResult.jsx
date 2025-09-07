import { useEffect, useState } from 'react'
import FoodCard from './FoodCard'

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
          setError(new Error('검색 결과가 없습니다.'))
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
        className="text-red-400 text-base font-semibold mt-6"
      >
        {error.message}
      </p>
    )
  }

  if (!drug) return null

  const avoidFood = Array.isArray(drug.avoid) ? drug.avoid : []
  const goodFood = Array.isArray(drug.good) ? drug.good : []

  return (
    <section className="mt-6 space-y-8">
      <header>
        <h2 className="text-md font-bold text-slate-500">
          <span className="text-emerald-600 font-bold">{drug.name}</span>에 대한
          검색 결과입니다.
        </h2>
      </header>
      <div>
        <h3 className="mb-3 text-3xl font-semibold text-red-600">
          Foods to Avoid
        </h3>
        <div className="grid gap-3">
          {avoidFood.length > 0 ? (
            avoidFood.map((item, index) => (
              <FoodCard
                key={index}
                emoji={'❌'}
                name={item.name}
                description={item.description}
                bgColour="bg-red-50"
              />
            ))
          ) : (
            <p className="text-slate-500">피해야 할 음식 정보가 없습니다. 🤓</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-3xl font-semibold text-green-700">
          Beneficial Foods
        </h3>
        <div className="grid gap-3">
          {goodFood.length > 0 ? (
            goodFood.map((item, index) => (
              <FoodCard
                key={index}
                emoji={'👩🏻‍⚕️'}
                name={item.name}
                description={item.description}
                bgColour="bg-green-50"
              />
            ))
          ) : (
            <p className="text-slate-500">권장되는 음식 정보가 없습니다. 🙂</p>
          )}
        </div>
      </div>
    </section>
  )
}
