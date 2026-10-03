import { readFileSync, writeFileSync } from "fs";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";
const PATH = `${CWD}\\src\\components\\admin\\AdminDashboard.tsx`;

let src = readFileSync(PATH, "utf8").replace(/\r\n/g, "\n");

// ── 1. Replace WorkflowTemplatesTab state block ──────────────────────────────
const OLD_STATE = `  const [saving, setSaving] = useState(false);
  const [undoStack, setUndoStack] = useState<{ phaseOrder: number; name: string; templateId: string } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);`;

const NEW_STATE = `  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStep, setEditingStep] = useState<{ phaseOrder: number; idx: number; value: string } | null>(null);
  const [undoStack, setUndoStack] = useState<{ phaseOrder: number; name: string; templateId: string } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);`;

if (!src.includes(OLD_STATE)) { console.error("STATE marker not found"); process.exit(1); }
src = src.replace(OLD_STATE, NEW_STATE);

// ── 2. Add renameStep function after undoRemoveStep ──────────────────────────
const OLD_AFTER_UNDO = `  const tpl = templates.find(t => t.id === selected);`;

const NEW_RENAME_PLUS = `  async function renameStep(phaseOrder: number, stepIdx: number, newName: string) {
    if (!selected || !newName.trim() || saving) return;
    setSaving(true);
    await supabase.rpc("fl_admin_workflow_update_step", {
      p_token: token, p_template_id: selected,
      p_phase_order: phaseOrder, p_step_index: stepIdx, p_new_name: newName.trim()
    });
    const { data } = await supabase.rpc("fl_admin_workflow_templates_get", { p_token: token });
    setTemplates((data as WfTemplate[]) ?? []);
    setEditingStep(null); setSaving(false);
  }

  const tpl = templates.find(t => t.id === selected);`;

if (!src.includes(OLD_AFTER_UNDO)) { console.error("AFTER_UNDO marker not found"); process.exit(1); }
src = src.replace(OLD_AFTER_UNDO, NEW_RENAME_PLUS);

// ── 3. Replace template picker block + add Edit/Done toggle ──────────────────
const OLD_PICKER = `      {/* Template picker */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {templates.map(t => (
          <button key={t.id} type="button" onClick={() => setSelected(t.id)}
            style={{ padding: "6px 14px", borderRadius: 8, border: \`1px solid \${selected === t.id ? GREEN : "rgba(18,16,12,.2)"}\`,
              background: selected === t.id ? GREEN : "#fff", color: selected === t.id ? CREAM : INK,
              fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {t.name}
          </button>
        ))}
      </div>`;

const NEW_PICKER = `      {/* Template picker + edit mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        {templates.map(t => (
          <button key={t.id} type="button" onClick={() => { setSelected(t.id); setEditMode(false); setEditingStep(null); }}
            style={{ padding: "6px 14px", borderRadius: 8, border: \`1px solid \${selected === t.id ? GREEN : "rgba(18,16,12,.2)"}\`,
              background: selected === t.id ? GREEN : "#fff", color: selected === t.id ? CREAM : INK,
              fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {t.name}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        {!editMode ? (
          <button type="button" onClick={() => setEditMode(true)}
            style={{ padding: "6px 16px", borderRadius: 8, border: \`1px solid \${GOLD}\`,
              background: "transparent", color: "#8a6a22", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ✎ Edit Template
          </button>
        ) : (
          <>
            <span style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>EDIT MODE — changes save immediately</span>
            <button type="button" onClick={() => { setEditMode(false); setEditingStep(null); }}
              style={{ padding: "6px 16px", borderRadius: 8, border: "none",
                background: GREEN, color: CREAM, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              ✓ Done Editing
            </button>
          </>
        )}
      </div>`;

if (!src.includes(OLD_PICKER)) { console.error("PICKER marker not found"); process.exit(1); }
src = src.replace(OLD_PICKER, NEW_PICKER);

// ── 4. Replace phase header (+ Step button only in editMode) ─────────────────
const OLD_PHASE_HDR = `              <div style={{ padding: "10px 14px", background: "rgba(16,42,30,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: GREEN }}>{phase.name}</span>
                <button type="button"
                  onClick={() => { setAddingStep(addingStep?.phaseOrder === phase.order ? null : { phaseOrder: phase.order }); setNewStepName(""); }}
                  style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: \`1px solid \${GOLD}\`,
                    background: addingStep?.phaseOrder === phase.order ? GOLD : "transparent",
                    color: addingStep?.phaseOrder === phase.order ? "#fff" : "#8a6a22", cursor: "pointer", fontWeight: 600 }}>
                  {addingStep?.phaseOrder === phase.order ? "Cancel" : "+ Step"}
                </button>
              </div>`;

const NEW_PHASE_HDR = `              <div style={{ padding: "10px 14px", background: "rgba(16,42,30,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: GREEN }}>{phase.name}</span>
                {editMode && (
                  <button type="button"
                    onClick={() => { setAddingStep(addingStep?.phaseOrder === phase.order ? null : { phaseOrder: phase.order }); setNewStepName(""); }}
                    style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: \`1px solid \${GOLD}\`,
                      background: addingStep?.phaseOrder === phase.order ? GOLD : "transparent",
                      color: addingStep?.phaseOrder === phase.order ? "#fff" : "#8a6a22", cursor: "pointer", fontWeight: 600 }}>
                    {addingStep?.phaseOrder === phase.order ? "Cancel" : "+ Step"}
                  </button>
                )}
              </div>`;

if (!src.includes(OLD_PHASE_HDR)) { console.error("PHASE_HDR marker not found"); process.exit(1); }
src = src.replace(OLD_PHASE_HDR, NEW_PHASE_HDR);

// ── 5. Replace milestone row (edit/remove gated by editMode) ─────────────────
const OLD_MS_ROW = `                {phase.milestones.map((ms, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid rgba(18,16,12,.05)" }}>
                    <span style={{ fontSize: 13, flex: 1, color: INK }}>• {ms}</span>
                    <button type="button" onClick={() => void removeStep(phase.order, idx)}
                      title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 13, padding: "0 4px" }}>✕</button>
                  </div>
                ))}`;

const NEW_MS_ROW = `                {phase.milestones.map((ms, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid rgba(18,16,12,.05)" }}>
                    {editMode && editingStep?.phaseOrder === phase.order && editingStep.idx === idx ? (
                      <>
                        <input autoFocus value={editingStep.value}
                          onChange={e => setEditingStep({ ...editingStep, value: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === "Enter") void renameStep(phase.order, idx, editingStep.value);
                            if (e.key === "Escape") setEditingStep(null);
                          }}
                          style={{ flex: 1, fontSize: 13, padding: "4px 8px", borderRadius: 6, border: \`1px solid \${GOLD}\`, outline: "none" }} />
                        <button type="button" onClick={() => void renameStep(phase.order, idx, editingStep.value)}
                          disabled={saving || !editingStep.value.trim()}
                          style={{ padding: "3px 10px", borderRadius: 6, border: "none", background: GREEN, color: CREAM, fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.5 : 1 }}>
                          {saving ? "…" : "Save"}
                        </button>
                        <button type="button" onClick={() => setEditingStep(null)}
                          style={{ background: "none", border: "none", color: MUTED, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 13, flex: 1, color: INK }}>• {ms}</span>
                        {editMode && (
                          <>
                            <button type="button"
                              onClick={() => setEditingStep({ phaseOrder: phase.order, idx, value: ms })}
                              title="Rename" style={{ background: "none", border: "none", cursor: "pointer", color: GOLD, fontSize: 12, padding: "0 3px" }}>✎</button>
                            <button type="button" onClick={() => void removeStep(phase.order, idx)}
                              title="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 13, padding: "0 4px" }}>✕</button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}`;

if (!src.includes(OLD_MS_ROW)) { console.error("MS_ROW marker not found"); process.exit(1); }
src = src.replace(OLD_MS_ROW, NEW_MS_ROW);

// ── 6. Gate "Add phase" behind editMode ──────────────────────────────────────
const OLD_ADD_PHASE = `          {/* Add phase */}
          <div style={{ marginTop: 12 }}>
            {!addingPhase ? (
              <button type="button" onClick={() => setAddingPhase(true)}`;

const NEW_ADD_PHASE = `          {/* Add phase — only in edit mode */}
          {editMode && <div style={{ marginTop: 12 }}>
            {!addingPhase ? (
              <button type="button" onClick={() => setAddingPhase(true)}`;

if (!src.includes(OLD_ADD_PHASE)) { console.error("ADD_PHASE marker not found"); process.exit(1); }
src = src.replace(OLD_ADD_PHASE, NEW_ADD_PHASE);

// Close the editMode && wrapper around Add Phase block
const OLD_CLOSE_PHASE = `              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recycle Bin Tab`;

const NEW_CLOSE_PHASE = `              </div>
            )}
          </div>}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recycle Bin Tab`;

if (!src.includes(OLD_CLOSE_PHASE)) { console.error("CLOSE_PHASE marker not found"); process.exit(1); }
src = src.replace(OLD_CLOSE_PHASE, NEW_CLOSE_PHASE);

writeFileSync(PATH, src.replace(/\n/g, "\r\n"), "utf8");
console.log("✓ WorkflowTemplatesTab patched with edit-mode gate + rename support");
