type Task = {
  id: number
  title: string
  description: string
  taskStatus: string
}

export default function TaskCard({ task }: { task: Task }) {

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">

      <h3 className="text-lg font-semibold text-gray-800">
        {task.title}
      </h3>

      <p className="text-gray-500 text-sm mt-1">
        {task.description}
      </p>

      <span className="inline-block mt-3 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
        {task.taskStatus}
      </span>

    </div>
  )
}