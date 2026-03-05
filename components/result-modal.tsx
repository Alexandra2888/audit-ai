"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  IconX,
  IconShieldCheck,
  IconChartBar,
  IconBulb,
  IconTool,
  IconLoader2,
  IconChevronDown,
} from "@tabler/icons-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import type { AuditSection, AuditMetric } from "@/utils/ai-prompt";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  results: AuditSection[] | null;
  onFix: () => void;
  fixing: boolean;
}

const scoreColor = (score: number) => {
  if (score >= 8) return "#22c55e";
  if (score >= 5) return "#eab308";
  return "#ef4444";
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Audit Report": <IconShieldCheck size={20} />,
  "Metric Scores": <IconChartBar size={20} />,
  "Suggestions for Improvement": <IconBulb size={20} />,
};

function MetricGrid({ metrics }: { metrics: AuditMetric[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
      {metrics.map((m) => (
        <div
          key={m.metric}
          className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/30"
        >
          <div className="w-16 h-16">
            <CircularProgressbar
              value={m.score * 10}
              text={`${m.score}`}
              strokeWidth={8}
              styles={buildStyles({
                textSize: "28px",
                pathColor: scoreColor(m.score),
                textColor: scoreColor(m.score),
                trailColor: "#27272a",
                pathTransitionDuration: 0.8,
              })}
            />
          </div>
          <span className="text-xs text-zinc-400 text-center font-medium">
            {m.metric}
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({
  section,
  onFix,
  fixing,
}: {
  section: AuditSection;
  onFix?: () => void;
  fixing?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const isMetrics = section.section === "Metric Scores";
  const isSuggestions = section.section === "Suggestions for Improvement";

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 text-white">
          <span className="text-indigo-400">
            {SECTION_ICONS[section.section]}
          </span>
          <span className="font-medium text-sm">{section.section}</span>
        </div>
        <IconChevronDown
          size={16}
          className={`text-zinc-500 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-5 py-4">
          {isMetrics && Array.isArray(section.details) ? (
            <MetricGrid metrics={section.details as AuditMetric[]} />
          ) : (
            <>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {section.details as string}
              </p>
              {isSuggestions && onFix && (
                <button
                  onClick={onFix}
                  disabled={fixing}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg transition-all"
                >
                  {fixing ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <IconTool size={16} />
                      Auto-fix Issues
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsModal({
  isOpen,
  onClose,
  loading,
  results,
  onFix,
  fixing,
}: ResultsModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                  <Dialog.Title className="text-lg font-semibold text-white">
                    {loading ? "Analyzing Contract..." : "Audit Results"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
                  >
                    <IconX size={20} />
                  </button>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="w-12 h-12 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-sm text-zinc-400">
                        AI is analyzing your smart contract...
                      </p>
                    </div>
                  ) : results ? (
                    <div className="space-y-4">
                      {results.map((section) => (
                        <SectionBlock
                          key={section.section}
                          section={section}
                          onFix={
                            section.section === "Suggestions for Improvement"
                              ? onFix
                              : undefined
                          }
                          fixing={fixing}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
