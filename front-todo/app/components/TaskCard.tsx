interface Task {
  id: number
  title: string
}

export default function TaskCard({
  task,
  onDelete
}: {
  task: Task
  onDelete: (id:number)=>void
}) {

  return (
    <div
      style={{
        padding:16,
        border:"1px solid #333",
        borderRadius:10,
        marginBottom:12,
        background:"#1e1e1e",
        color:"white",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}
    >
      <span>{task.title}</span>

      <div style={{display:"flex", gap:8}}>
        <button
          style={{
            background:"#2563eb",
            border:"none",
            color:"white",
            padding:"4px 10px",
            borderRadius:6
          }}
        >
          editar
        </button>

        <button
          onClick={()=>onDelete(task.id)}
          style={{
            background:"#dc2626",
            border:"none",
            color:"white",
            padding:"4px 10px",
            borderRadius:6
          }}
        >
          excluir
        </button>
      </div>
    </div>
  )
}