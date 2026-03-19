"use client";

import AppShell from "@/components/AppShell";
import { api, readApiErrorResponse } from "@/app/services/api";
import {
  CheckCircle2,
  ChevronDown,
  Filter,
  LoaderCircle,
  PencilLine,
  Save,
  Tag,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type TaskStatusCode = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "OVERDUE";

type TagItem = {
  id: string;
  name: string;
  color: string;
};

type TaskItem = {
  id: number;
  title: string;
  description: string;
  taskStatus: TaskStatusCode;
  tagId: string | null;
  syncStatus: "synced" | "pending" | "error";
  origin: "remote" | "local";
};

type RemoteTag = {
  id?: string | number;
  name?: string | null;
  label?: string | null;
  title?: string | null;
  color?: string | null;
  hexColor?: string | null;
};

type RemoteTask = {
  id?: number;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  details?: string | null;
  taskStatus?: string | null;
  status?: string | null;
  tagId?: string | number | null;
  tagName?: string | null;
  tagColor?: string | null;
  tag?: RemoteTag | null;
};

type RemoteCollection<T> = T[] | { data?: T[]; items?: T[]; content?: T[]; tasks?: T[]; tags?: T[] };

type TaskDraft = {
  title: string;
  description: string;
  taskStatus: TaskStatusCode;
  tagId: string;
};

const TASK_TITLE_MAX_LENGTH = 50;
const TASK_DESCRIPTION_MAX_LENGTH = 255;

const statusOptions: Array<{ value: TaskStatusCode; label: string }> = [
  { value: "PENDING", label: "Pendente" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "OVERDUE", label: "Atrasada" },
];

function getCountLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function parseHexColor(hexColor: string) {
  const normalized = hexColor.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized
        .split("")
        .map((character) => `${character}${character}`)
        .join("")
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return null;
  }

  return {
    red: Number.parseInt(expanded.slice(0, 2), 16),
    green: Number.parseInt(expanded.slice(2, 4), 16),
    blue: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function toRgba(hexColor: string, alpha: number) {
  const parsed = parseHexColor(hexColor);

  if (!parsed) {
    return `rgba(91, 155, 213, ${alpha})`;
  }

  return `rgba(${parsed.red}, ${parsed.green}, ${parsed.blue}, ${alpha})`;
}

function getContrastingTextColor(hexColor: string) {
  const parsed = parseHexColor(hexColor);

  if (!parsed) {
    return "#17324f";
  }

  const brightness = (parsed.red * 299 + parsed.green * 587 + parsed.blue * 114) / 1000;

  return brightness > 160 ? "#17324f" : "#f8fbff";
}

function getTagButtonStyle(color: string, isActive: boolean) {
  const parsed = parseHexColor(color);
  const defaultTextColor = "#17324f";
  const textColor = parsed ? (getContrastingTextColor(color) === "#f8fbff" ? defaultTextColor : color) : defaultTextColor;

  return {
    backgroundColor: isActive ? toRgba(color, 0.24) : toRgba(color, 0.14),
    color: textColor,
    border: isActive ? `2px solid ${color}` : `1px solid ${toRgba(color, 0.28)}`,
    boxShadow: isActive ? `0 0 0 4px ${toRgba(color, 0.14)}` : "none",
  };
}

function getSyncStatusLabel(syncStatus: TaskItem["syncStatus"]) {
  if (syncStatus === "pending") {
    return "Sincronizando";
  }

  if (syncStatus === "error") {
    return "Erro na sincronização";
  }

  return "Sincronizada";
}

function getCollectionItems<T>(payload: RemoteCollection<T>): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.data || payload.items || payload.content || payload.tasks || payload.tags || [];
}

function normalizeStatusValue(status?: string | null): TaskStatusCode {
  const value = (status || "").trim().toUpperCase();

  if (value === "IN_PROGRESS" || value === "EM_ANDAMENTO" || value === "EM ANDAMENTO") {
    return "IN_PROGRESS";
  }

  if (value === "COMPLETED" || value === "CONCLUIDA" || value === "CONCLUÍDA") {
    return "COMPLETED";
  }

  if (value === "CANCELLED" || value === "CANCELADA") {
    return "CANCELLED";
  }

  if (value === "OVERDUE" || value === "ATRASADA") {
    return "OVERDUE";
  }

  return "PENDING";
}

function getStatusLabel(status: TaskStatusCode) {
  return statusOptions.find((option) => option.value === status)?.label ?? "Pendente";
}

function getStatusChipClass(status: TaskStatusCode) {
  if (status === "COMPLETED") {
    return "tasks-status-chip tasks-status-chip-success";
  }

  return "tasks-status-chip";
}

function normalizeTag(tag: RemoteTag): TagItem | null {
  const rawId = tag.id;
  const name = tag.name || tag.label || tag.title;

  if ((typeof rawId !== "string" && typeof rawId !== "number") || !name) {
    return null;
  }

  return {
    id: String(rawId),
    name,
    color: tag.color || tag.hexColor || "#5b9bd5",
  };
}

function buildTagMap(tags: TagItem[]) {
  return new Map(tags.map((tag) => [tag.id, tag]));
}

function normalizeTask(task: RemoteTask, fallbackTagId: string | null): TaskItem | null {
  const title = task.title || task.name;

  if (typeof task.id !== "number" || !title) {
    return null;
  }

  const rawTagId = typeof task.tagId === "string" || typeof task.tagId === "number"
    ? String(task.tagId)
    : task.tag && (typeof task.tag.id === "string" || typeof task.tag.id === "number")
      ? String(task.tag.id)
      : fallbackTagId;

  return {
    id: task.id,
    title,
    description: task.description || task.details || "Sem descricao informada.",
    taskStatus: normalizeStatusValue(task.taskStatus || task.status),
    tagId: rawTagId,
    syncStatus: "synced",
    origin: "remote",
  };
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
}

function buildTaskDraft(task: TaskItem, fallbackTagId: string) {
  return {
    title: task.title,
    description: task.description,
    taskStatus: task.taskStatus,
    tagId: task.tagId || fallbackTagId,
  };
}

function toRemoteTagPayload(tag: TagItem) {
  return {
    name: tag.name,
    color: tag.color,
  };
}

function toTaskPayload(task: { title: string; description: string; taskStatus: TaskStatusCode; tagId: string | null }) {
  return {
    title: task.title,
    description: task.description,
    taskStatus: task.taskStatus,
    tagId: task.tagId && /^\d+$/.test(task.tagId) ? Number(task.tagId) : null,
  };
}

function validateTaskDraft(task: Pick<TaskDraft, "title" | "description">) {
  const errors: Partial<Record<keyof TaskDraft, string>> = {};
  const normalizedTitle = task.title.trim();
  const normalizedDescription = task.description.trim();

  if (!normalizedTitle) {
    errors.title = "Informe um título válido para a task.";
  } else if (normalizedTitle.length < 3 || normalizedTitle.length > TASK_TITLE_MAX_LENGTH) {
    errors.title = `O título deve ter entre 3 e ${TASK_TITLE_MAX_LENGTH} caracteres.`;
  }

  if (normalizedDescription.length > TASK_DESCRIPTION_MAX_LENGTH) {
    errors.description = `A descrição deve ter no máximo ${TASK_DESCRIPTION_MAX_LENGTH} caracteres.`;
  }

  return errors;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#5b9bd5");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState("Crie tarefas, organize por tags e acompanhe sua lista em um unico painel.");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<TaskDraft | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [syncedTagIds, setSyncedTagIds] = useState<string[]>([]);
  const [createFieldErrors, setCreateFieldErrors] = useState<Partial<Record<keyof TaskDraft, string>>>({});
  const [editFieldErrors, setEditFieldErrors] = useState<Partial<Record<keyof TaskDraft, string>>>({});

  useEffect(() => {
    const loadRemoteData = async () => {
      try {
        const [tagsResponse, tasksResponse] = await Promise.all([
          api("/api/tags"),
          api("/api/tasks"),
        ]);

        let remoteTags: TagItem[] = [];

        if (tagsResponse.ok) {
          const tagPayload = await readJsonResponse<RemoteCollection<RemoteTag>>(tagsResponse);
          remoteTags = getCollectionItems(tagPayload || []).map(normalizeTag).filter((tag): tag is TagItem => tag !== null);
          setTags(remoteTags);
          setSyncedTagIds(remoteTags.map((tag) => tag.id));
        }

        if (!tasksResponse.ok) {
          setTasks([]);
          setMessage("Nao foi possivel carregar suas tasks agora. Tente novamente em instantes.");
          setLoading(false);
          return;
        }

        const taskPayload = await readJsonResponse<RemoteCollection<RemoteTask>>(tasksResponse);
        const normalizedTasks = getCollectionItems(taskPayload || [])
          .map((task) => normalizeTask(task, null))
          .filter((task): task is TaskItem => task !== null);

        setTasks(normalizedTasks);
        setMessage(
          remoteTags.length > 0
            ? "Tags e tasks foram carregadas com sucesso a partir da API."
            : "Suas tasks foram carregadas com sucesso.",
        );
      } catch (error) {
        console.error("Falha ao carregar tags e tasks.", error);
        setTasks([]);
        setTags([]);
        setMessage("Sem conexao com a API no momento. Suas tasks nao puderam ser carregadas.");
      } finally {
        setLoading(false);
      }
    };

    void loadRemoteData();
  }, []);

  const tagMap = useMemo(() => buildTagMap(tags), [tags]);
  const completedCount = tasks.filter((task) => task.taskStatus === "COMPLETED").length;
  const openCount = tasks.filter((task) => task.taskStatus !== "COMPLETED" && task.taskStatus !== "CANCELLED").length;
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesTag = tagFilter === "all" || task.tagId === tagFilter;
        const matchesStatus = statusFilter === "all" || task.taskStatus === statusFilter;

        return matchesTag && matchesStatus;
      }),
    [statusFilter, tagFilter, tasks],
  );
  const isTaskListEmpty = !loading && tasks.length === 0;
  const hasNoFilteredResults = !loading && tasks.length > 0 && filteredTasks.length === 0;

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const draftErrors = validateTaskDraft({ title, description });

    if (Object.keys(draftErrors).length > 0) {
      setCreateFieldErrors(draftErrors);
      setMessage(draftErrors.title || draftErrors.description || "Revise os dados antes de criar a task.");
      return;
    }

    setCreateFieldErrors({});

    setSaveState("saving");

    const canSyncRemotely = !selectedTagId || syncedTagIds.includes(selectedTagId);

    if (!canSyncRemotely) {
      setSaveState("idle");
      setMessage("Selecione uma tag valida para criar a task.");
      return;
    }

    try {
      const draftTask = {
        title: title.trim(),
        description: description.trim() || "Sem descricao informada.",
        taskStatus: "PENDING" as TaskStatusCode,
        tagId: selectedTagId || null,
      };

      const response = await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify(toTaskPayload(draftTask)),
      });

      if (response.ok) {
        const remoteTask = await readJsonResponse<RemoteTask>(response);
        const normalizedTask = remoteTask ? normalizeTask(remoteTask, draftTask.tagId) : null;

        if (normalizedTask) {
          setTasks((current) => [...current, normalizedTask]);
        }
        setTitle("");
        setDescription("");
        setCreateFieldErrors({});
        setMessage("Task criada com sucesso.");
      } else {
        const errorPayload = await readApiErrorResponse(response);
        setCreateFieldErrors((errorPayload?.errors as Partial<Record<keyof TaskDraft, string>>) || {});
        setMessage(errorPayload?.message || "Nao foi possivel criar a task agora. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.error("Falha ao criar task.", error);
      setMessage("Sem conexao com a API no momento. A task nao foi criada.");
    } finally {
      setSaveState("idle");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);

    if (!taskToDelete) {
      return;
    }

    const previousTasks = tasks;
    setTasks((current) => current.filter((task) => task.id !== taskId));

    try {
      const response = await api(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setTasks(previousTasks);
        setMessage("Nao foi possivel excluir a task na API. Nada foi removido.");
        return;
      }

      setMessage("Task removida com sucesso.");
    } catch (error) {
      console.error("Falha ao excluir task.", error);
      setTasks(previousTasks);
      setMessage("A API nao respondeu ao excluir a task. A remocao foi revertida localmente.");
    }
  };

  const handleStartEditTask = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditDraft(buildTaskDraft(task, tags[0]?.id ?? ""));
    setEditFieldErrors({});
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setEditDraft(null);
    setEditFieldErrors({});
  };

  const handleSaveTask = async (taskId: number) => {
    if (!editDraft) {
      return;
    }

    const draftErrors = validateTaskDraft(editDraft);

    if (Object.keys(draftErrors).length > 0) {
      setEditFieldErrors(draftErrors);
      setMessage(draftErrors.title || draftErrors.description || "Revise os dados antes de salvar a task.");
      return;
    }

    setEditFieldErrors({});

    const previousTasks = tasks;
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (!taskToUpdate) {
      return;
    }

    if (editDraft.tagId && !syncedTagIds.includes(editDraft.tagId) && taskToUpdate.origin === "remote") {
      setMessage("Essa tag ainda nao foi sincronizada com a API. Escolha uma tag remota ou salve a task apenas localmente.");
      return;
    }

    const updatedTask: TaskItem = {
      ...taskToUpdate,
      title: editDraft.title.trim(),
      description: editDraft.description.trim() || "Sem descricao informada.",
      taskStatus: editDraft.taskStatus,
      tagId: editDraft.tagId || null,
      syncStatus: "pending",
    };

    setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)));

    try {
      const response = await api(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(toTaskPayload(updatedTask)),
      });

      if (!response.ok) {
        const errorPayload = await readApiErrorResponse(response);
        setTasks(previousTasks.map((task) => (task.id === taskId ? { ...task, syncStatus: "error" } : task)));

        if (response.status === 400 && errorPayload?.errors) {
          setEditFieldErrors(errorPayload.errors as Partial<Record<keyof TaskDraft, string>>);
        }

        setMessage(errorPayload?.message || "Nao foi possivel salvar a edicao na API. As alteracoes foram revertidas.");
        return;
      }

      const remoteTask = await readJsonResponse<RemoteTask>(response);
      const normalizedTask = remoteTask ? normalizeTask(remoteTask, updatedTask.tagId) : null;

      if (normalizedTask) {
        setTasks((current) => current.map((task) => (task.id === taskId ? normalizedTask : task)));
      }

      setMessage("Task atualizada com sucesso.");
      setEditingTaskId(null);
      setEditDraft(null);
      setEditFieldErrors({});
    } catch (error) {
      console.error("Falha ao salvar task.", error);
      setTasks(previousTasks.map((task) => (task.id === taskId ? { ...task, syncStatus: "error" } : task)));
      setMessage("A API nao respondeu ao tentar editar a task. As alteracoes foram revertidas.");
    }
  };

  const handleCreateTag = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = tagName.trim();

    if (!normalizedName) {
      setMessage("Informe um nome para a tag.");
      return;
    }

    if (editingTagId) {
      const previousTags = tags;
      const currentTag = tags.find((tag) => tag.id === editingTagId);

      if (!currentTag) {
        return;
      }

      const updatedTag: TagItem = {
        ...currentTag,
        name: normalizedName,
        color: tagColor,
      };

      setTags((current) => current.map((tag) => (tag.id === editingTagId ? updatedTag : tag)));

      try {
        const response = await api(`/api/tags/${editingTagId}`, {
          method: "PUT",
          body: JSON.stringify(toRemoteTagPayload(updatedTag)),
        });

        if (!response.ok) {
          setTags(previousTags);
          setMessage("Nao foi possivel atualizar a tag na API. As alteracoes foram revertidas.");
          return;
        }

        const remoteTag = await readJsonResponse<RemoteTag>(response);
        const nextTag = remoteTag ? normalizeTag(remoteTag) : updatedTag;

        if (nextTag) {
          setTags((current) => current.map((tag) => (tag.id === editingTagId ? nextTag : tag)));
        }

        setMessage(`Tag ${normalizedName} atualizada com sucesso.`);
      } catch (error) {
        console.error("Falha ao atualizar tag.", error);
        setTags(previousTags);
        setMessage("A API nao respondeu ao atualizar a tag. As alteracoes foram revertidas.");
        return;
      }
    } else {
      const localTag: TagItem = {
        id: `${normalizedName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: normalizedName,
        color: tagColor,
      };

      try {
        const response = await api("/api/tags", {
          method: "POST",
          body: JSON.stringify(toRemoteTagPayload(localTag)),
        });

        if (response.ok) {
          const remoteTag = await readJsonResponse<RemoteTag>(response);
          const nextTag = remoteTag ? normalizeTag(remoteTag) : localTag;

          if (nextTag) {
            setTags((current) => [nextTag, ...current.filter((tag) => tag.id !== nextTag.id)]);
            setSelectedTagId(nextTag.id);
            setSyncedTagIds((current) => Array.from(new Set([...current, nextTag.id])));
            setMessage(`Tag ${nextTag.name} criada e sincronizada com a API.`);
          }
        } else {
          setMessage(`Nao foi possivel criar a tag ${normalizedName} agora.`);
        }
      } catch (error) {
        console.error("Falha ao criar tag.", error);
        setMessage(`Sem conexao com a API no momento. A tag ${normalizedName} nao foi criada.`);
      }
    }

    setTagName("");
    setTagColor("#5b9bd5");
    setEditingTagId(null);
    setIsTagModalOpen(false);
  };

  const handleStartEditTag = (tag: TagItem) => {
    setEditingTagId(tag.id);
    setTagName(tag.name);
    setTagColor(tag.color);
    setIsTagModalOpen(true);
  };

  const handleOpenCreateTagModal = () => {
    setEditingTagId(null);
    setTagName("");
    setTagColor("#5b9bd5");
    setIsTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId: string) => {
    const tagToDelete = tags.find((tag) => tag.id === tagId);

    if (!tagToDelete) {
      return;
    }

    const previousTags = tags;
    const previousTasks = tasks;
    const fallbackTagId = tags.find((tag) => tag.id !== tagId)?.id ?? "";

    setTags((current) => current.filter((tag) => tag.id !== tagId));
    setTasks((current) => current.map((task) => (task.tagId === tagId ? { ...task, tagId: null } : task)));

    if (selectedTagId === tagId) {
      setSelectedTagId(fallbackTagId);
    }

    if (tagFilter === tagId) {
      setTagFilter("all");
    }

    try {
      const response = await api(`/api/tags/${tagId}`, { method: "DELETE" });

      if (!response.ok) {
        setTags(previousTags);
        setTasks(previousTasks);
        if (selectedTagId === fallbackTagId) {
          setSelectedTagId(tagId);
        }
        setMessage("Nao foi possivel excluir a tag na API. As alteracoes foram revertidas.");
        return;
      }

      setSyncedTagIds((current) => current.filter((id) => id !== tagId));
      setMessage(`Tag ${tagToDelete.name} removida com sucesso.`);
    } catch (error) {
      console.error("Falha ao excluir tag.", error);
      setTags(previousTags);
      setTasks(previousTasks);
      if (selectedTagId === fallbackTagId) {
        setSelectedTagId(tagId);
      }
      setMessage("A API nao respondeu ao excluir a tag. As alteracoes foram revertidas.");
    }
  };

  const handleSelectSidebarTag = (tagId: string) => {
    setSelectedTagId(tagId);
    setTagFilter((current) => (current === tagId ? "all" : tagId));
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    setEditingTagId(null);
    setTagName("");
    setTagColor("#5b9bd5");
  };

  return (
    <AppShell
      title="My Tasks"
      subtitle="Liste suas tarefas em formato de lista, crie tags sem sair da tela e vincule cada task a uma categoria da sua rotina."
      sectionLabel="Produtividade"
      currentPageLabel="My Tasks"
      notificationItems={[
        "Crie tags diretamente nesta tela para organizar novas tasks.",
        "Cada task pode ser vinculada a uma tag no momento da criacao ou da edicao.",
        "A barra lateral permanece fixa para navegar entre perfil e tarefas.",
      ]}
    >
      <div className="tasks-layout">
        <div className="tasks-sidebar-stack">
          <section className="surface-panel tasks-summary-card">
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow tasks-eyebrow">VISÃO GERAL</p>
                <h3 className="panel-title">Resumo das tasks</h3>
              </div>
              <span className="profile-badge">{getCountLabel(tasks.length, "item", "itens")}</span>
            </div>

            <div className="tasks-kpi-grid section-spacer">
              <div className="tasks-kpi-card">
                <strong>{openCount}</strong>
                <span>Em aberto</span>
              </div>
              <div className="tasks-kpi-card">
                <strong>{completedCount}</strong>
                <span>Concluídas</span>
              </div>
            </div>

            <div className="subtle-list">
              <div className="subtle-list-item subtle-list-item-centered">
                <CheckCircle2 size={16} /> {message}
              </div>
            </div>
          </section>

          <section className="surface-panel tasks-tags-card">
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow tasks-eyebrow">Tags</p>
                <h3 className="panel-title">Organização por categoria</h3>
              </div>

              <button type="button" className="ghost-button tasks-secondary-action" onClick={handleOpenCreateTagModal}>
                <Tags size={16} /> Criar tag
              </button>
            </div>

            <div className="tasks-tag-list section-spacer">
              {tags.length === 0 ? <p className="panel-subtitle">Crie sua primeira tag para classificar as tasks.</p> : null}

              {tags.map((tag) => (
                <div key={tag.id} className="tasks-tag-item">
                  <button
                    type="button"
                    className={`tasks-tag-row${tagFilter === tag.id ? " is-active" : ""}`}
                    onClick={() => handleSelectSidebarTag(tag.id)}
                    aria-pressed={tagFilter === tag.id}
                    style={getTagButtonStyle(tag.color, tagFilter === tag.id)}
                  >
                    <span className="tasks-tag-dot" style={{ backgroundColor: tag.color }} />
                    <span>{tag.name}</span>
                    {tagFilter === tag.id ? <span className="tasks-tag-active-badge">Ativa</span> : null}
                  </button>

                  <div className="tasks-tag-actions">
                    <button type="button" className="ghost-button tasks-mini-button" onClick={() => handleStartEditTag(tag)}>
                      <PencilLine size={14} />
                    </button>
                    <button type="button" className="danger-button tasks-mini-button" onClick={() => handleDeleteTag(tag.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="surface-panel tasks-main-panel">
          <div className="panel-header tasks-panel-header">
            <div>
              <p className="eyebrow tasks-eyebrow">Nova task</p>
              <h2 className="section-title">Criar e listar tarefas</h2>
              <p className="panel-subtitle">Adicione uma task, vincule a uma tag e acompanhe tudo em formato de lista na mesma tela.</p>
            </div>
          </div>

          <form className="profile-form section-spacer" onSubmit={handleCreateTask}>
            <div className="tasks-create-grid">
              <label className="label">
                Titulo da task
                <input
                  className={`input${createFieldErrors.title ? " input-error" : ""}`}
                  value={title}
                  maxLength={TASK_TITLE_MAX_LENGTH}
                  onChange={(event) => {
                    const nextValue = event.target.value.slice(0, TASK_TITLE_MAX_LENGTH);
                    setTitle(nextValue);
                    if (createFieldErrors.title || createFieldErrors.description) {
                      setCreateFieldErrors((current) => ({ ...current, title: undefined }));
                    }
                  }}
                  placeholder="Ex.: Revisar backlog da sprint"
                  aria-invalid={Boolean(createFieldErrors.title)}
                />
                <div className="input-helper-row input-helper-row-compact">
                  {createFieldErrors.title ? <span className="panel-subtitle form-error-text">{createFieldErrors.title}</span> : <span />}
                  <span className="panel-subtitle profile-character-counter">{title.length}/{TASK_TITLE_MAX_LENGTH}</span>
                </div>
              </label>

              <label className="label">
                Tag
                <div className="tasks-select-field">
                  <select
                    className={`input tasks-select-input${selectedTagId ? " is-filled" : " is-placeholder"}`}
                    value={selectedTagId}
                    onChange={(event) => setSelectedTagId(event.target.value)}
                  >
                    <option value="">Selecione uma tag (opcional)</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
                <div className="input-helper-row input-helper-row-compact">
                  <span className="panel-subtitle profile-character-counter tasks-counter-placeholder" aria-hidden="true">0/255</span>
                </div>
              </label>
            </div>

            <label className="label">
              Descrição
              <textarea
                className={`textarea tasks-description-textarea${createFieldErrors.description ? " input-error" : ""}`}
                value={description}
                maxLength={TASK_DESCRIPTION_MAX_LENGTH}
                onChange={(event) => {
                  setDescription(event.target.value.slice(0, TASK_DESCRIPTION_MAX_LENGTH));
                  if (createFieldErrors.description) {
                    setCreateFieldErrors((current) => ({ ...current, description: undefined }));
                  }
                }}
                placeholder="Inclua contexto rapido para essa task."
              />
              <div className="input-helper-row">
                {createFieldErrors.description ? <span className="panel-subtitle form-error-text">{createFieldErrors.description}</span> : <span />}
                <span className="panel-subtitle profile-character-counter">{description.length}/{TASK_DESCRIPTION_MAX_LENGTH}</span>
              </div>
            </label>

            <div className="tasks-form-actions">
              <button type="submit" className="primary-button" disabled={saveState === "saving"} aria-busy={saveState === "saving"}>
                {saveState === "saving" ? (
                  <>
                    <LoaderCircle size={16} className="button-spinner" /> Criando task...
                  </>
                ) : (
                  "Criar task"
                )}
              </button>
            </div>
          </form>

          <div className="tasks-list-block section-spacer">
            <div className="panel-header compact-header">
              <h3 className="panel-title">Lista de tasks</h3>
              {!loading ? <span className="profile-badge muted">{getCountLabel(filteredTasks.length, "visível", "visíveis")}</span> : null}
            </div>

            <div className="tasks-filter-grid section-spacer">
              <label className="label">
                Filtrar por tag
                <div className="tasks-filter-field">
                  <Filter size={16} />
                  <select className="input" value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
                    <option value="all">Todas as tags</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="label">
                Filtrar por status
                <div className="tasks-filter-field">
                  <CheckCircle2 size={16} />
                  <select className="input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="all">Todos os status</option>
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            {loading ? <p className="panel-subtitle section-spacer">Carregando tarefas...</p> : null}

            {isTaskListEmpty ? (
              <div className="tasks-empty-state section-spacer">
                <Tag size={18} /> Nenhuma tarefa encontrada. Que tal criar sua primeira task?
              </div>
            ) : null}

            {hasNoFilteredResults ? (
              <div className="tasks-empty-state section-spacer">
                <Tag size={18} /> Nenhuma task encontrada com os filtros atuais.
              </div>
            ) : null}

            {!loading && filteredTasks.length > 0 ? (
              <div className="tasks-list section-spacer">
                {filteredTasks.map((task) => {
                  const linkedTag = task.tagId ? tagMap.get(task.tagId) : undefined;
                  const isEditing = editingTaskId === task.id && editDraft !== null;

                  return (
                    <article key={task.id} className={`tasks-list-item${task.taskStatus === "COMPLETED" ? " is-completed" : ""}`}>
                      <div className="tasks-item-main">
                        {isEditing ? (
                          <div className="tasks-edit-form">
                            <div className="tasks-edit-grid">
                              <label className="label">
                                Título
                                <input
                                  className={`input${editFieldErrors.title ? " input-error" : ""}`}
                                  value={editDraft.title}
                                  maxLength={TASK_TITLE_MAX_LENGTH}
                                  onChange={(event) =>
                                    setEditDraft((current) =>
                                      current
                                        ? { ...current, title: event.target.value.slice(0, TASK_TITLE_MAX_LENGTH) }
                                        : current,
                                    )
                                  }
                                  aria-invalid={Boolean(editFieldErrors.title)}
                                />
                                <div className="input-helper-row input-helper-row-compact">
                                  {editFieldErrors.title ? <span className="panel-subtitle form-error-text">{editFieldErrors.title}</span> : <span />}
                                  <span className="panel-subtitle profile-character-counter">{editDraft.title.length}/{TASK_TITLE_MAX_LENGTH}</span>
                                </div>
                              </label>

                              <label className="label">
                                Status
                                <select
                                  className="input"
                                  value={editDraft.taskStatus}
                                  onChange={(event) =>
                                    setEditDraft((current) =>
                                      current
                                        ? { ...current, taskStatus: event.target.value as TaskStatusCode }
                                        : current,
                                    )
                                  }
                                >
                                  {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="input-helper-row input-helper-row-compact">
                                  <span className="panel-subtitle profile-character-counter tasks-counter-placeholder" aria-hidden="true">0/255</span>
                                </div>
                              </label>

                              <label className="label">
                                Tag
                                <div className="tasks-select-field">
                                  <select
                                    className="input tasks-select-input"
                                    value={editDraft.tagId}
                                    onChange={(event) =>
                                      setEditDraft((current) =>
                                        current
                                          ? { ...current, tagId: event.target.value }
                                          : current,
                                      )
                                    }
                                  >
                                    <option value="">Selecione uma tag (opcional)</option>
                                    {tags.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={16} />
                                </div>
                                <div className="input-helper-row input-helper-row-compact">
                                  <span className="panel-subtitle profile-character-counter tasks-counter-placeholder" aria-hidden="true">0/255</span>
                                </div>
                              </label>
                            </div>

                            <label className="label">
                              Descrição
                              <textarea
                                className={`textarea tasks-description-textarea${editFieldErrors.description ? " input-error" : ""}`}
                                value={editDraft.description}
                                maxLength={TASK_DESCRIPTION_MAX_LENGTH}
                                onChange={(event) =>
                                  setEditDraft((current) =>
                                    current
                                      ? { ...current, description: event.target.value.slice(0, TASK_DESCRIPTION_MAX_LENGTH) }
                                      : current,
                                  )
                                }
                              />
                              <div className="input-helper-row">
                                {editFieldErrors.description ? <span className="panel-subtitle form-error-text">{editFieldErrors.description}</span> : <span />}
                                <span className="panel-subtitle profile-character-counter">{editDraft.description.length}/{TASK_DESCRIPTION_MAX_LENGTH}</span>
                              </div>
                            </label>
                          </div>
                        ) : (
                          <>
                            <div className="tasks-item-header">
                              <h3>{task.title}</h3>
                              <span className={getStatusChipClass(task.taskStatus)}>{getStatusLabel(task.taskStatus)}</span>
                            </div>
                            <p>{task.description}</p>
                            <div className="tasks-item-meta">
                              <span className="tasks-linked-tag">
                                <span
                                  className="tasks-tag-dot"
                                  style={{ backgroundColor: linkedTag?.color || "#8a9ab5" }}
                                />
                                {linkedTag?.name || "Sem tag"}
                              </span>
                              <span className={`profile-badge muted tasks-sync-badge tasks-sync-badge-${task.syncStatus}`}>
                                {getSyncStatusLabel(task.syncStatus)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="tasks-item-actions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="ghost-button tasks-action-button"
                              onClick={handleCancelEditTask}
                            >
                              <X size={16} /> Cancelar
                            </button>
                            <button
                              type="button"
                              className="primary-button tasks-action-button"
                              onClick={() => handleSaveTask(task.id)}
                              disabled={task.syncStatus === "pending"}
                            >
                              {task.syncStatus === "pending" ? <LoaderCircle size={16} className="button-spinner" /> : <Save size={16} />} Salvar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="ghost-button tasks-action-button"
                              onClick={() => handleStartEditTask(task)}
                            >
                              <PencilLine size={16} /> Editar
                            </button>
                            <button
                              type="button"
                              className="danger-button tasks-delete-button"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 size={16} /> Excluir
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {isTagModalOpen ? (
        <div className="tasks-modal-backdrop" role="presentation" onClick={handleCloseTagModal}>
          <div
            className="tasks-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tag-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow tasks-eyebrow">{editingTagId ? "Editar tag" : "Nova tag"}</p>
                <h3 id="tag-modal-title" className="panel-title">
                  {editingTagId ? "Atualizar tag existente" : "Criar tag para suas tasks"}
                </h3>
              </div>
            </div>

            <form className="profile-form section-spacer" onSubmit={handleCreateTag}>
              <label className="label">
                Nome da tag
                <input
                  className="input"
                  value={tagName}
                  onChange={(event) => setTagName(event.target.value)}
                  placeholder="Ex.: Financeiro"
                  autoFocus
                />
              </label>

              <label className="label">
                Cor da tag
                <input
                  className="color-input"
                  type="color"
                  value={tagColor}
                  onChange={(event) => setTagColor(event.target.value)}
                />
              </label>

              <div className="tasks-form-actions">
                <button type="button" className="ghost-button" onClick={handleCloseTagModal}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  {editingTagId ? "Salvar alteracoes" : "Salvar tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}