import { readEditorialData, writeEditorialData } from "@/lib/editorial-storage"

const FILE_PATH = "disapproved-candidates.json"

export interface DisapprovedCandidateRecord {
  id: string
  name: string
  email: string
  orcid?: string
  institution?: string
  credentialId?: string
  disapprovedAt: string
  disapprovedBy?: string
  status: "Disapproved" | "Revoked" | "Purged / Watchlisted"
  reason?: string
  notes?: string
}

export async function getStoredDisapproved(): Promise<DisapprovedCandidateRecord[]> {
  const data = await readEditorialData<{ disapproved: DisapprovedCandidateRecord[] }>(FILE_PATH, { disapproved: [] })
  return Array.isArray(data?.disapproved) ? data.disapproved : []
}

export async function saveStoredDisapproved(records: DisapprovedCandidateRecord[]): Promise<void> {
  const payload = {
    disapproved: records,
    lastUpdated: new Date().toISOString()
  }
  await writeEditorialData(FILE_PATH, payload)
}
