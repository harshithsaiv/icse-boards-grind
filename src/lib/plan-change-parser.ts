import type { ParsedPlanChange } from "@/store/use-store";
import type { Block } from "./constants";

/** Extract [PLAN_CHANGE]...[/PLAN_CHANGE] blocks from AI text */
export function parsePlanChanges(text: string): ParsedPlanChange[] {
  const changes: ParsedPlanChange[] = [];
  const regex = /\[PLAN_CHANGE\]([\s\S]*?)\[\/PLAN_CHANGE\]/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const block = match[1];
    const actionMatch = block.match(/action:\s*(add|remove|replace)/i);
    const startMatch = block.match(/start:\s*(\d{2}:\d{2})/);
    const endMatch = block.match(/end:\s*(\d{2}:\d{2})/);
    const subjectMatch = block.match(/subject:\s*(\S+)/);
    const labelMatch = block.match(/label:\s*(.+)/);

    if (actionMatch && startMatch && endMatch) {
      changes.push({
        action: actionMatch[1].toLowerCase() as "add" | "remove" | "replace",
        start: startMatch[1],
        end: endMatch[1],
        subject: subjectMatch?.[1],
        label: labelMatch?.[1]?.trim() || "Study block",
      });
    }
  }

  return changes;
}

/** Remove [PLAN_CHANGE] tags from display text */
export function stripPlanChangeTags(text: string): string {
  return text.replace(/\[PLAN_CHANGE\][\s\S]*?\[\/PLAN_CHANGE\]/g, "").trim();
}

/** Apply plan changes to current blocks */
export function applyPlanChanges(
  currentBlocks: Block[],
  changes: ParsedPlanChange[]
): Block[] {
  let blocks = [...currentBlocks];

  for (const change of changes) {
    if (change.action === "add") {
      blocks.push({
        start: change.start,
        end: change.end,
        label: change.label,
        type: "study",
        subjectKey: change.subject,
      });
    } else if (change.action === "remove") {
      blocks = blocks.filter(
        (b) => !(b.start === change.start && b.end === change.end)
      );
    } else if (change.action === "replace") {
      blocks = blocks.map((b) => {
        if (b.start === change.start && b.end === change.end) {
          return {
            ...b,
            label: change.label,
            subjectKey: change.subject || b.subjectKey,
          };
        }
        return b;
      });
    }
  }

  // Sort by start time
  blocks.sort((a, b) => a.start.localeCompare(b.start));
  return blocks;
}
