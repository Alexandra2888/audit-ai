"use client";

import { useState } from "react";
import Header from "@/components/header";
import ContractInput from "@/components/contract-input";
import ResultsModal from "@/components/result-modal";
import {
  analyzeContract,
  fixIssues,
  type AuditSection,
} from "@/utils/ai-prompt";

export default function Home() {
  const [contract, setContract] = useState("");
  const [results, setResults] = useState<AuditSection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    setError(null);
    setResults(null);
    setIsModalOpen(true);
    setLoading(true);

    try {
      const auditResults = await analyzeContract(contract);
      setResults(auditResults);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFix = async () => {
    if (!results) return;

    const suggestions = results.find(
      (r) => r.section === "Suggestions for Improvement",
    )?.details;

    if (typeof suggestions !== "string") return;

    setFixing(true);
    try {
      const fixedContract = await fixIssues(contract, suggestions);
      setContract(fixedContract);
      setIsModalOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fix contract";
      setError(message);
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            AI-Powered Smart Contract{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Security Auditor
            </span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Detect vulnerabilities, optimize gas usage, and improve code quality
            with AI-driven analysis.
          </p>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 ml-4"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
          <ContractInput
            contract={contract}
            setContract={setContract}
            onAudit={handleAudit}
            loading={loading}
          />
        </div>
      </main>

      <ResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loading={loading}
        results={results}
        onFix={handleFix}
        fixing={fixing}
      />
    </div>
  );
}
