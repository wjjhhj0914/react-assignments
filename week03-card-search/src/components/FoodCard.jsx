export default function FoodCard({ emoji, name, description, bgColour }) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg shadow-sm ${bgColour}`}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="min-w-0">
        <h4 className="text-lg font-bold text-slate-900 truncate">{name}</h4>
        <p className="text-slate-600 text-sm leading-6 break-words">
          {description}
        </p>
      </div>
    </div>
  )
}
