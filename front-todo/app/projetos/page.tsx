"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  priority?: string;
  taskStatus?: string;
};

type Project = {
  id: number;
  name: string;
  color?: string;
  tasks: Task[];
};

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/projects/user/1/with-tasks")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{
      padding: "20px",
      display: "flex",
      gap: "16px",
      flexWrap: "wrap"
    }}>
      {projects.map(project => (
        <div key={project.id} style={{
          backgroundColor: project.color || "#ddd",
          padding: "16px",
          borderRadius: "12px",
          width: "300px"
        }}>
          <h2>{project.name}</h2>

          {project.tasks.map(task => (
            <div key={task.id} style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "8px",
              marginTop: "8px"
            }}>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>{task.priority} | {task.taskStatus}</small>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}