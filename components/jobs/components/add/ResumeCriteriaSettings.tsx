'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Kbd, Radio, RadioGroup, Select, SelectItem, Slider, Tab, Tabs, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, Tooltip } from '@heroui/react';
import { Plus, Save, Trash2, Wand2, Info, ShieldCheck, RefreshCw, Settings2 } from 'lucide-react';
import { useFormikContext } from 'formik';
import { AddJobFormValues } from '../../types';
import { showToast } from '@/app/utils/toastUtils';
import { generateRubricFromAI } from '@/services/job.service';

/**
 * Drop this file into: app/settings/resume-criteria/page.tsx
 * Requires: @heroui/react, tailwindcss.
 * Notes:
 * - The AI “Generate” buttons call placeholder endpoints you can wire to your backend
 *   (/api/rubrics/generate and /api/rubrics/save)
 * - The preview score is computed client‑side using the same weighting/cap logic
 * - This is a single‑file version for fast iteration; extract into components as needed
 */

// ---------------------- Types ----------------------
export type Rubric = {
  id?: string;

  weights: { skills: number; experience: number; seniority: number; domain: number };
  caps: { missing_core: number; missing_field_ops: number };
  mustHaves: {
    degree_any: string[];
    certifications_any: string[];
    min_years_role: number;
    hands_on_all: string[]; // normalized keys like ["site_inspections","incident_investigations"]
    nice_to_have?: string[];
  };
  keywords: Record<string, string[]>; // {site_inspections: ["inspection","audit","JSA"], ...}
  version?: number;
};

export type Evidence = {
  hasOhsDegree: boolean;
  hasHseCert: boolean;
  yearsHse: number;
  siteInspections: boolean;
  incidentInvestigations: boolean;
  training: boolean;
  regulatoryKnowledge: boolean;
  domainOverlap: number; // 0–100
  senioritySignals: number; // 0–100
  genericSkillOverlap: number; // 0–100
};

// ---------------------- Helpers ----------------------
function computeMatch(e: Evidence, caps: Rubric['caps'], w: Rubric['weights']) {
  const missingCore = !(e.hasOhsDegree && e.hasHseCert && e.yearsHse >= 3);
  if (missingCore) return caps.missing_core;

  const missingFieldOps = !(e.siteInspections && e.incidentInvestigations);
  if (missingFieldOps) return caps.missing_field_ops;

  const skills = 0.35 * e.genericSkillOverlap + 0.25 * (e.siteInspections ? 100 : 0) + 0.25 * (e.incidentInvestigations ? 100 : 0) + 0.15 * (e.training ? 100 : 0);

  const experience = Math.min(100, e.yearsHse * 20); // 5y ⇒ 100
  const seniority = e.senioritySignals;
  const domain = e.regulatoryKnowledge ? Math.max(e.domainOverlap, 60) : e.domainOverlap;

  const score = w.skills * skills + w.experience * experience + w.seniority * seniority + w.domain * domain;
  return Math.round(score);
}

export const DEFAULT_RUBRIC: Rubric = {
  weights: { skills: 0.4, experience: 0.3, seniority: 0.2, domain: 0.1 },
  caps: { missing_core: 10, missing_field_ops: 20 },
  mustHaves: {
    degree_any: ['Occupational Health and Safety', 'Environmental Health'],
    certifications_any: ['CRSP', 'CSP', 'NEBOSH', 'OHSAS'],
    min_years_role: 3,
    hands_on_all: ['site_inspections', 'incident_investigations'],
    nice_to_have: ['training_delivery', 'iso_45001', 'osha'],
  },
  keywords: {
    site_inspections: ['site inspection', 'safety audit', 'JSA', 'walkthrough'],
    incident_investigations: ['root cause', 'near miss', 'incident investigation'],
    training_delivery: ['toolbox talk', 'HSE training', 'safety induction'],
    regulatory: ['OSHA', 'ISO 45001', 'local OHS law', 'compliance'],
  },
  version: 1,
};

// ---------------------- UI ----------------------
export default function ResumeCriteriaSettings() {
  const [activeTab, setActiveTab] = useState<string>('defaults');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { values, setFieldValue } = useFormikContext<AddJobFormValues>();

  // Initialize once if not present
  useEffect(() => {
    if (!values.resumeCriteria) {
      setFieldValue('resumeCriteria', DEFAULT_RUBRIC);
    }
  }, [values.resumeCriteria, setFieldValue]);

  // Single source of truth: Formik
  const rubric: Rubric = values.resumeCriteria ?? DEFAULT_RUBRIC;

  // Helper to update rubric in Formik
  const setRubric = (next: Rubric | ((r: Rubric) => Rubric)) => {
    const resolved = typeof next === 'function' ? (next as (r: Rubric) => Rubric)(rubric) : next;
    setFieldValue('resumeCriteria', resolved);
  };

  // Fake evidence for preview
  const demoEvidence: Evidence = {
    hasOhsDegree: false,
    hasHseCert: false,
    yearsHse: 0,
    siteInspections: false,
    incidentInvestigations: false,
    training: false,
    regulatoryKnowledge: false,
    domainOverlap: 8,
    senioritySignals: 20,
    genericSkillOverlap: 15,
  };

  const previewScore = useMemo(() => computeMatch(demoEvidence, rubric.caps, rubric.weights), [rubric]);

  // 1) Narrow the allowed keys for chip handlers
  type MustHaveArrayKey = 'degree_any' | 'certifications_any' | 'hands_on_all' | 'nice_to_have';

  // 2) Add chip
  const addChip = (path: MustHaveArrayKey, value: string) => {
    if (!value) return;
    setRubric((r) => {
      const curr = (r.mustHaves[path] ?? []) as string[];
      return {
        ...r,
        mustHaves: { ...r.mustHaves, [path]: [...curr, value] },
      };
    });
  };

  // 3) Remove chip
  const removeChip = (path: MustHaveArrayKey, value: string) => {
    setRubric((r) => {
      const curr = (r.mustHaves[path] ?? []) as string[];
      return {
        ...r,
        mustHaves: { ...r.mustHaves, [path]: curr.filter((v) => v !== value) },
      };
    });
  };

  // 4) Separate handler for the numeric field
  const setMinYears = (years: number) => {
    setRubric((r) => ({
      ...r,
      mustHaves: { ...r.mustHaves, min_years_role: years },
    }));
  };

  const upsertKeyword = (key: string, synonym: string) => {
    if (!key || !synonym) return;
    setRubric((r) => ({
      ...r,
      keywords: {
        ...r.keywords,
        [key]: Array.from(new Set([...(r.keywords[key] || []), synonym])),
      },
    }));
  };

  const removeKeyword = (key: string, synonym: string) => {
    setRubric((r) => ({
      ...r,
      keywords: {
        ...r.keywords,
        [key]: (r.keywords[key] || []).filter((s) => s !== synonym),
      },
    }));
  };

  // ---------- API stubs ----------
  async function handleGenerate() {
    try {
      setGenerating(true);

      const roleTitle = values.jobTitle || 'Untitled Role';
      const jdText = (values as any).descriptionPlain?.trim() || '';

      if (!roleTitle && !jdText) {
        showToast.error('Please enter a role title or a job description first.');
        return;
      }

      const rubricDraft = await generateRubricFromAI({
        roleTitle,
        ...(jdText ? { jdText } : {}),
      });

      setFieldValue('resumeCriteria', rubricDraft);
      showToast.success('Resume criteria generated!');
    } catch (e: any) {
      console.error(e);
      showToast.error(e?.response?.data?.error ?? 'Failed to generate resume criteria.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="">
      <div className="mb-5 flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-[5px]">
          <Settings2 className="w-5 h-5 text-xl text-secondary-400" />
          <h1 className="text-xl/[24px] font-semibold text-tertiary md:text-[20px]/[24px]">Resume Processing Criteria</h1>
        </div>

        <Button variant="flat" radius="full" color="secondary" size="sm" startContent={<Wand2 className="w-4 h-4" />} isLoading={generating} onPress={handleGenerate}>
          Generate with AI
        </Button>
      </div>

      <Tabs selectedKey={activeTab} onSelectionChange={(k) => setActiveTab(String(k))} variant="underlined">
        <Tab key="defaults" title="Must-Haves">
          <div className="grid md:grid-cols-2 gap-6">
            <Card shadow="sm" radius="sm">
              <CardHeader className="flex items-center justify-between">
                <span className="font-semibold">Degrees (any)</span>
                <Info className="w-4 h-4 text-default-500" />
              </CardHeader>
              <CardBody className="space-y-3">
                <ChipInput chips={rubric.mustHaves.degree_any} onAdd={(v) => addChip('degree_any', v)} onRemove={(v) => removeChip('degree_any', v)} placeholder="e.g., Occupational Health and Safety" />
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between">
                <span className="font-semibold">Certifications (any)</span>
                <ShieldCheck className="w-4 h-4 text-success" />
              </CardHeader>
              <CardBody className="space-y-3">
                <ChipInput chips={rubric.mustHaves.certifications_any} onAdd={(v) => addChip('certifications_any', v)} onRemove={(v) => removeChip('certifications_any', v)} placeholder="e.g., NEBOSH" />
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="font-semibold">Minimum years in role</CardHeader>
              <CardBody className="space-y-2">
                <Slider label={`Years: ${rubric.mustHaves.min_years_role}`} minValue={0} maxValue={10} step={1} value={rubric.mustHaves.min_years_role} onChange={(val) => setMinYears(Number(val))} />
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="font-semibold">Hands-on (all required)</CardHeader>
              <CardBody className="space-y-3">
                <ChipInput chips={rubric.mustHaves.hands_on_all} onAdd={(v) => addChip('hands_on_all', v)} onRemove={(v) => removeChip('hands_on_all', v)} placeholder="e.g., site_inspections" />
              </CardBody>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="font-semibold">Nice to have</CardHeader>
              <CardBody>
                <ChipInput chips={rubric.mustHaves.nice_to_have || []} onAdd={(v) => addChip('nice_to_have', v)} onRemove={(v) => removeChip('nice_to_have', v)} placeholder="e.g., iso_45001" />
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="weights" title="Weights & Caps">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="font-semibold">Weights</CardHeader>
              <CardBody className="space-y-5">
                <WeightSlider label="Skills" value={rubric.weights.skills} onChange={(v) => setRubric((r) => ({ ...r, weights: { ...r.weights, skills: v } }))} />
                <WeightSlider label="Experience" value={rubric.weights.experience} onChange={(v) => setRubric((r) => ({ ...r, weights: { ...r.weights, experience: v } }))} />
                <WeightSlider label="Seniority" value={rubric.weights.seniority} onChange={(v) => setRubric((r) => ({ ...r, weights: { ...r.weights, seniority: v } }))} />
                <WeightSlider label="Domain" value={rubric.weights.domain} onChange={(v) => setRubric((r) => ({ ...r, weights: { ...r.weights, domain: v } }))} />
                <p className="text-sm text-default-500">Tip: weights should sum to 1.0</p>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="font-semibold">Caps (applied before weights)</CardHeader>
              <CardBody className="space-y-4">
                <Input type="number" label="Cap when missing core (degree/cert/years)" value={String(rubric.caps.missing_core)} onChange={(e) => setRubric((r) => ({ ...r, caps: { ...r.caps, missing_core: Number(e.target.value) } }))} />
                <Input
                  type="number"
                  label="Cap when missing field ops (inspections/investigations)"
                  value={String(rubric.caps.missing_field_ops)}
                  onChange={(e) =>
                    setRubric((r) => ({
                      ...r,
                      caps: { ...r.caps, missing_field_ops: Number(e.target.value) },
                    }))
                  }
                />
                <Divider />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-default-600">Preview score with demo evidence:</span>
                  <Chip color={previewScore < 30 ? 'danger' : previewScore < 60 ? 'warning' : 'success'} variant="flat">
                    {previewScore}%
                  </Chip>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="keywords" title="Keywords & Synonyms">
          <Card>
            <CardBody>
              <KeywordEditor data={rubric.keywords} onAdd={upsertKeyword} onRemove={removeKeyword} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

function ChipInput({ chips, onAdd, onRemove, placeholder }: { chips: string[]; onAdd: (v: string) => void; onRemove: (v: string) => void; placeholder?: string }) {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <Chip key={c} variant="flat" color="secondary" onClose={() => onRemove(c)} className="rounded-full">
            {c}
          </Chip>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input value={value} variant="bordered" onChange={(e) => setValue(e.target.value)} placeholder={placeholder || 'Add value'} className="w-full" />
        <Button
          size="sm"
          variant="faded"
          color="secondary"
          radius="full"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => {
            onAdd(value.trim());
            setValue('');
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function WeightSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-default-500">{value.toFixed(2)}</span>
      </div>
      <Slider aria-label={`${label} weight`} minValue={0} maxValue={1} step={0.05} value={value} onChange={(v) => onChange(Number(v))} />
    </div>
  );
}

function KeywordEditor({ data, onAdd, onRemove }: { data: Record<string, string[]>; onAdd: (k: string, s: string) => void; onRemove: (k: string, s: string) => void }) {
  const [key, setKey] = useState('');
  const [syn, setSyn] = useState('');
  const keys = Object.keys(data);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <Input label="Keyword Group" placeholder="e.g., site_inspections" value={key} onChange={(e) => setKey(e.target.value)} className="md:w-[260px]" />
        <Input label="Synonym / Phrase" placeholder="e.g., safety audit" value={syn} onChange={(e) => setSyn(e.target.value)} />
        <Button
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => {
            onAdd(key.trim(), syn.trim());
            setSyn('');
          }}
        >
          Add
        </Button>
      </div>

      <Table aria-label="Keyword groups">
        <TableHeader>
          <TableColumn>Group</TableColumn>
          <TableColumn>Synonyms</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No keywords yet">
          {keys.map((k) => (
            <TableRow key={k}>
              <TableCell className="font-mono text-sm">{k}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {(data[k] || []).map((s) => (
                    <Chip key={k + '-' + s} variant="flat" onClose={() => onRemove(k, s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
