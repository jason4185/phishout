// Mirrors the data shape returned by the check_url contract method on GenLayer.
export type CheckRecord = {
  url: string;
  phishingStatus: 0 | 1; // 0 = clean, 1 = flagged — matches contract return type
  validatorCount: number;
  checkedAt: string; // ISO 8601
};

// Result state machine — shared across homepage and /check/[url] page
export type CheckState =
  | { phase: "idle" }
  | { phase: "loading"; url: string }
  | { phase: "flagged"; url: string }
  | { phase: "clean"; url: string }
  | { phase: "error"; url: string };
