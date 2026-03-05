export interface AuditMetric {
  metric: string;
  score: number;
}

export interface AuditSection {
  section: string;
  details: string | AuditMetric[];
}

export async function analyzeContract(
  contract: string,
): Promise<AuditSection[]> {
  const res = await fetch("/api/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contract }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to audit contract");
  }

  return data.results;
}

export async function fixIssues(
  contract: string,
  suggestions: string,
): Promise<string> {
  const res = await fetch("/api/fix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contract, suggestions }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fix contract");
  }

  return data.contract;
}
