import fs from "fs";
import path from "path";
import type {
  AgentMessage,
  AgentResponse,
  Allergy,
  Condition,
  EvidenceSource,
  Medication,
  Observation,
  Patient,
  PatientContext,
  SavedDraft,
} from "../types";

export interface DerivedContextRow {
  id: string;
  patientId: string;
  context: PatientContext;
  generatedAt: string;
}

export interface AgentMessageRow {
  id: string;
  patientId: string;
  role: "user" | "assistant";
  content: string;
  response: AgentResponse | null;
  createdAt: string;
}

export interface DatabaseState {
  patients: Patient[];
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  observations: Observation[];
  evidenceSources: EvidenceSource[];
  derivedContext: DerivedContextRow[];
  agentMessages: AgentMessageRow[];
  savedDrafts: SavedDraft[];
}

const dbPath =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), "data", "datax.json");

let state: DatabaseState | null = null;

function emptyState(): DatabaseState {
  return {
    patients: [],
    conditions: [],
    medications: [],
    allergies: [],
    observations: [],
    evidenceSources: [],
    derivedContext: [],
    agentMessages: [],
    savedDrafts: [],
  };
}

function persist(): void {
  if (!state) return;
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dbPath, JSON.stringify(state, null, 2), "utf-8");
}

export function getStore(): DatabaseState {
  if (state) return state;

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(dbPath)) {
    try {
      state = JSON.parse(fs.readFileSync(dbPath, "utf-8")) as DatabaseState;
    } catch {
      state = emptyState();
      persist();
    }
  } else {
    state = emptyState();
    persist();
  }

  return state;
}

export function saveStore(): void {
  persist();
}

export function rowToAgentMessage(row: AgentMessageRow): AgentMessage {
  return {
    id: row.id,
    patientId: row.patientId,
    role: row.role,
    content: row.content,
    agentResponse: row.response,
    createdAt: row.createdAt,
  };
}
