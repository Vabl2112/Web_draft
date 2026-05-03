import type { Brief, BriefStatus } from "@/lib/briefs/types"
import { INITIAL_MOCK_BRIEFS } from "@/lib/briefs/mock-data"

const NETWORK_MS = 420

function delay(ms: number = NETWORK_MS): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** In-memory «БД» */
let briefsStore: Brief[] = [...INITIAL_MOCK_BRIEFS]

export function resetBriefsMockForTests(seed?: Brief[]): void {
  briefsStore = seed ? [...seed] : [...INITIAL_MOCK_BRIEFS]
}

export async function fetchAllBriefs(): Promise<Brief[]> {
  await delay()
  return [...briefsStore]
}

export async function fetchBriefsByClient(clientId: number): Promise<Brief[]> {
  await delay()
  return briefsStore.filter(b => b.clientId === clientId).sort(sortByCreatedDesc)
}

export async function fetchOpenBriefsForFeed(): Promise<Brief[]> {
  await delay()
  return briefsStore.filter(b => b.status === "open").sort(sortByCreatedDesc)
}

export async function fetchBriefById(id: number): Promise<Brief | null> {
  await delay()
  return briefsStore.find(b => b.id === id) ?? null
}

export interface CreateBriefPayload {
  clientId: number
  category: string
  budgetMin: number | null
  budgetMax: number | null
  status: BriefStatus
  dynamicData: Record<string, unknown>
}

export async function createBrief(payload: CreateBriefPayload): Promise<Brief> {
  await delay()
  const next: Brief = {
    id: Date.now(),
    clientId: payload.clientId,
    category: payload.category,
    budgetMin: payload.budgetMin,
    budgetMax: payload.budgetMax,
    status: payload.status,
    dynamicData: { ...payload.dynamicData },
    createdAt: new Date().toISOString(),
  }
  briefsStore = [next, ...briefsStore]
  return next
}

function sortByCreatedDesc(a: Brief, b: Brief): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}
