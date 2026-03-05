"use client";

import React, { useCallback, useRef } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-solidity";
import "prismjs/themes/prism-tomorrow.css";
import { IconShieldSearch, IconUpload, IconLoader2 } from "@tabler/icons-react";

interface ContractInputProps {
  contract: string;
  setContract: (value: string) => void;
  onAudit: () => void;
  loading: boolean;
}

const SPDX_REGEX = /\/\/\s*SPDX-License-Identifier:\s*[^\s]+/;
const PRAGMA_REGEX = /pragma\s+solidity\s+[^;]+;/;

const isValidSolidity = (code: string) =>
  SPDX_REGEX.test(code) && PRAGMA_REGEX.test(code);

const highlight = (code: string) =>
  Prism.highlight(code, Prism.languages.solidity, "solidity");

export default function ContractInput({
  contract,
  setContract,
  onAudit,
  loading,
}: ContractInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") setContract(text);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [setContract],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file?.name.endsWith(".sol")) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") setContract(text);
      };
      reader.readAsText(file);
    },
    [setContract],
  );

  const handleAudit = () => {
    if (!contract.trim()) return;
    if (!isValidSolidity(contract)) {
      alert(
        "Invalid Solidity contract. Ensure it includes an SPDX license identifier and a pragma directive.",
      );
      return;
    }
    onAudit();
  };

  const canAudit = contract.trim().length > 0 && !loading;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Smart Contract Editor
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Paste your Solidity code or upload a .sol file
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".sol"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-all"
          >
            <IconUpload size={16} />
            Upload .sol
          </button>
        </div>
      </div>

      <div
        className="relative group"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
        <div className="relative border border-zinc-800 rounded-xl bg-zinc-900/80 overflow-hidden">
          <div className="border-b border-zinc-800 px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <span className="text-xs text-zinc-500 ml-2 font-mono">
              contract.sol
            </span>
          </div>

          <div className="overflow-y-auto" style={{ height: "420px" }}>
            <Editor
              value={contract}
              onValueChange={setContract}
              highlight={highlight}
              padding={20}
              textareaId="code-editor"
              className="code-editor"
              textareaClassName="outline-none"
              placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your code here...&#10;}"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 14,
                lineHeight: 1.6,
                minHeight: "100%",
                background: "transparent",
                color: "#e4e4e7",
              }}
            />
          </div>

          <div className="border-t border-zinc-800 px-4 py-3 flex items-center justify-between bg-zinc-900/50">
            <span className="text-xs text-zinc-500">
              {contract.split("\n").length} lines
            </span>
            <button
              onClick={handleAudit}
              disabled={!canAudit}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            >
              {loading ? (
                <>
                  <IconLoader2 size={16} className="animate-spin" />
                  Auditing...
                </>
              ) : (
                <>
                  <IconShieldSearch size={16} />
                  Run Audit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
