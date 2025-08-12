'use client';

import React, { useMemo, useState } from 'react';
import { Button, Accordion, AccordionItem, Chip } from '@heroui/react';
import { Wand2, Settings2 } from 'lucide-react';
import { useFormikContext } from 'formik';
import { AddJobFormValues } from '../../types';
import { showToast } from '@/app/utils/toastUtils';
import { generateRubricFromAI } from '@/services/job.service';

type RubricItem = { Category: string; Requirement: string };

export default function ResumeCriteriaSettings() {
  const [generating, setGenerating] = useState(false);
  const { values, setFieldValue } = useFormikContext<AddJobFormValues>();

  // --- helpers ---------------------------------------------------------------
  const toArray = (v: unknown): RubricItem[] => (Array.isArray(v) ? (v as RubricItem[]) : []);
  const normalize = (items: RubricItem[]) =>
    items
      .filter((i) => i && i.Category && i.Requirement)
      .map((i) => ({
        Category: String(i.Category).trim(),
        Requirement: String(i.Requirement).trim(),
      }));

  const groupByCategory = (items: RubricItem[]) => {
    const map = new Map<string, Set<string>>();
    for (const it of items) {
      const key = it.Category;
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(it.Requirement);
    }
    // return sorted categories with deduped requirement arrays
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cat, set]) => ({ category: cat, requirements: Array.from(set.values()) }));
  };

  // --- generate via AI -------------------------------------------------------
  async function handleGenerate() {
    try {
      setGenerating(true);
      const roleTitle = (values as any).jobTitle || 'Untitled Role';
      const jdText = (values as any).descriptionPlain?.trim() || '';

      if (!roleTitle && !jdText) {
        showToast.error('Please enter a role title or a job description first.');
        return;
      }

      const raw = await generateRubricFromAI({
        roleTitle,
        ...(jdText ? { jdText } : {}),
      });

      const arr = normalize(toArray(raw));
      setFieldValue('resumeCriteria', arr);
      showToast.success('Resume criteria generated!');
    } catch (e: any) {
      console.error(e);
      showToast.error(e?.response?.data?.error ?? 'Failed to generate resume criteria.');
    } finally {
      setGenerating(false);
    }
  }

  // --- derived view model ----------------------------------------------------
  const grouped = useMemo(() => {
    const items = normalize(toArray((values as any).resumeCriteria));
    return groupByCategory(items);
  }, [values]);

  return (
    <div className="">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-[5px]">
          <Settings2 className="w-5 h-5 text-xl text-secondary-400" />
          <h1 className="text-xl/[24px] font-semibold text-tertiary md:text-[20px]/[24px]">Resume Processing Criteria</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="flat" radius="full" color="secondary" size="sm" startContent={<Wand2 className="w-4 h-4" />} isLoading={generating} onPress={handleGenerate}>
            Generate with AI
          </Button>
        </div>
      </div>

      {/* Accordion */}
      {grouped.length === 0 ? (
        <div className="text-default-400 text-sm">No criteria found. Generate with AI to populate.</div>
      ) : (
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          itemClasses={{
            title: 'font-semibold',
            content: 'pt-0',
          }}
          defaultExpandedKeys={new Set(grouped.slice(0, 2).map((g) => g.category))} // open first couple by default
        >
          {grouped.map(({ category, requirements }) => (
            <AccordionItem
              key={category}
              aria-label={category}
              title={
                <div className="flex items-center gap-2">
                  <span>{category}</span>
                  <Chip size="sm" variant="flat">
                    {requirements.length}
                  </Chip>
                </div>
              }
            >
              <ul className="list-disc pl-6 py-3 space-y-2">
                {requirements.map((r) => (
                  <li key={r} className="text-default-600">
                    {r}
                  </li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
