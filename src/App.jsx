// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Plus,
//   Save,
//   Trash2,
//   Copy,
//   FileText,
//   Search,
//   Download,
//   Printer,
//   Edit3,
//   Image as ImageIcon,
//   Menu,
//   X,
//   ChevronUp,
//   ChevronDown,
//   PanelLeft,
//   Sparkles,
// } from "lucide-react";

// const BLOCK_TYPES = [
//   { type: "scene", label: "Scene", hint: "INT./EXT. LOCATION - DAY" },
//   { type: "action", label: "Action", hint: "Describe action" },
//   { type: "character", label: "Character", hint: "CHARACTER NAME" },
//   { type: "parens", label: "Parens", hint: "(whispering)" },
//   { type: "dialogue", label: "Dialogue", hint: "Spoken lines" },
//   { type: "transition", label: "Transition", hint: "CUT TO:" },
//   { type: "shot", label: "Shot", hint: "CLOSE ON:" },
//   { type: "text", label: "Text", hint: "General text" },
//   { type: "note", label: "Note", hint: "Writer note" },
//   { type: "outline", label: "Outline", hint: "Beat / summary" },
//   { type: "newAct", label: "New Act", hint: "ACT ONE" },
//   { type: "endAct", label: "End Act", hint: "END OF ACT ONE" },
//   { type: "lyrics", label: "Lyrics", hint: "Song lyrics" },
//   { type: "image", label: "Image", hint: "Paste image URL" },
//   { type: "sequence", label: "Sequence", hint: "Sequence title" },
//   { type: "dual", label: "Dual", hint: "LEFT DIALOGUE || RIGHT DIALOGUE" },
// ];

// const DEFAULT_SCRIPT = () => ({
//   id: crypto.randomUUID(),
//   title: "Untitled Script",
//   updatedAt: new Date().toISOString(),
//   blocks: [{ id: crypto.randomUUID(), type: "scene", content: "" }],
// });

// const STORAGE_KEY = "premium-script-studio-files";
// const ACTIVE_KEY = "premium-script-studio-active";
// const VIEW_KEY = "premium-script-studio-view";

// function formatDate(iso) {
//   try {
//     return new Date(iso).toLocaleString();
//   } catch {
//     return "";
//   }
// }

// function slugify(text) {
//   return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "script";
// }

// function getBlockStyle(type) {
//   const base = "w-full bg-transparent outline-none resize-none text-[15px] leading-7";
//   switch (type) {
//     case "scene":
//     case "transition":
//     case "shot":
//     case "newAct":
//     case "endAct":
//       return `${base} uppercase tracking-wide font-semibold`;
//     case "character":
//       return `${base} text-center font-semibold uppercase`;
//     case "dialogue":
//       return `${base} text-center md:px-40`;
//     case "parens":
//       return `${base} text-center italic text-slate-500 -mt-7`;
//     case "lyrics":
//       return `${base} italic text-fuchsia-700`;
//     case "note":
//       return `${base} text-amber-900`;
//     case "outline":
//       return `${base} text-blue-900 font-medium`;
//     default:
//       return base;
//   }
// }

// function blockWrapper(type) {
//   switch (type) {
//     case "scene":
//       return "bg-slate-50 border-slate-200";
//     case "action":
//       return "bg-white border-slate-200";
//     case "character":
//       return "bg-violet-50 border-violet-200 md:mx-20";
//     case "parens":
//       return "bg-rose-50 border-rose-200 md:mx-24 -mt-2";
//     case "dialogue":
//       return "bg-white border-slate-200 md:mx-12 -mt-2";
//     case "transition":
//       return "bg-emerald-50 border-emerald-200 text-right";
//     case "shot":
//       return "bg-cyan-50 border-cyan-200";
//     case "text":
//       return "bg-white border-slate-200";
//     case "note":
//       return "bg-amber-50 border-amber-200 border-dashed";
//     case "outline":
//       return "bg-blue-50 border-blue-200";
//     case "newAct":
//       return "bg-indigo-100 border-indigo-300 text-center";
//     case "endAct":
//       return "bg-pink-100 border-pink-300 text-center";
//     case "lyrics":
//       return "bg-fuchsia-50 border-fuchsia-200";
//     case "image":
//       return "bg-slate-50 border-slate-200";
//     case "sequence":
//       return "bg-teal-50 border-teal-200 font-semibold";
//     case "dual":
//       return "bg-purple-50 border-purple-200";
//     default:
//       return "bg-white border-slate-200";
//   }
// }

// function autoGrow(el) {
//   if (!el) return;
//   el.style.height = "auto";
//   el.style.height = `${Math.max(48, el.scrollHeight)}px`;
// }

// function scriptToText(script) {
//   return script.blocks
//     .map((b) => {
//       if (b.type === "image") return `[IMAGE] ${b.content}`;
//       if (b.type === "dual") {
//         const [left = "", right = ""] = b.content.split("||");
//         return `${left.trim()}    ||    ${right.trim()}`;
//       }
//       return b.content;
//     })
//     .join("\n\n");
// }

// function getWordCount(script) {
//   return script.blocks
//     .map((b) => b.content || "")
//     .join(" ")
//     .trim()
//     .split(/\s+/)
//     .filter(Boolean).length;
// }

// function createTestCases() {
//   return [
//     {
//       name: "empty new script uses placeholder",
//       input: DEFAULT_SCRIPT(),
//       check: (script) => script.blocks.length === 1 && script.blocks[0].content === "",
//     },
//     {
//       name: "dialogue block stays centered style",
//       input: "dialogue",
//       check: (type) => getBlockStyle(type).includes("text-center"),
//     },
//     {
//       name: "parens style stays close to dialogue",
//       input: "parens",
//       check: (type) => getBlockStyle(type).includes("-mt-2"),
//     },
//   ];
// }

// export default function App() {
//   const [scripts, setScripts] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed) && parsed.length) return parsed;
//       } catch {}
//     }
//     return [DEFAULT_SCRIPT()];
//   });

//   const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY) || null);
//   const [search, setSearch] = useState("");
//   const [showMobileSidebar, setShowMobileSidebar] = useState(false);
//   const [showLeftPanel, setShowLeftPanel] = useState(() => {
//     if (typeof window === "undefined") return true;
//     return window.innerWidth >= 768;
//   });
//   const [viewMode, setViewMode] = useState(() => localStorage.getItem(VIEW_KEY) || "editor");
//   const editorRefs = useRef({});

//   useEffect(() => {
//     if (!activeId && scripts.length) setActiveId(scripts[0].id);
//     if (activeId && !scripts.find((s) => s.id === activeId) && scripts.length) setActiveId(scripts[0].id);
//   }, [activeId, scripts]);

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
//   }, [scripts]);

//   useEffect(() => {
//     if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
//   }, [activeId]);

//   useEffect(() => {
//     localStorage.setItem(VIEW_KEY, viewMode);
//   }, [viewMode]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setShowMobileSidebar(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     requestAnimationFrame(() => {
//       Object.values(editorRefs.current).forEach(autoGrow);
//     });
//   }, [scripts, viewMode]);

//   const activeScript = useMemo(
//     () => scripts.find((s) => s.id === activeId) || scripts[0],
//     [scripts, activeId]
//   );

//   const filteredScripts = useMemo(() => {
//     return scripts.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
//   }, [scripts, search]);

//   const stats = useMemo(() => {
//     if (!activeScript) return { words: 0, pages: 0, scenes: 0 };
//     const words = getWordCount(activeScript);
//     const scenes = activeScript.blocks.filter((b) => b.type === "scene").length;
//     const pages = Math.max(1, Math.ceil(words / 180));
//     return { words, scenes, pages };
//   }, [activeScript]);

//   const updateScript = (updater) => {
//     if (!activeScript) return;
//     setScripts((prev) =>
//       prev.map((s) =>
//         s.id === activeScript.id ? { ...updater(s), updatedAt: new Date().toISOString() } : s
//       )
//     );
//   };

//   const createScript = () => {
//     const next = DEFAULT_SCRIPT();
//     setScripts((prev) => [next, ...prev]);
//     setActiveId(next.id);
//     setShowMobileSidebar(false);
//   };

//   const duplicateScript = () => {
//     if (!activeScript) return;
//     const copy = {
//       ...activeScript,
//       id: crypto.randomUUID(),
//       title: `${activeScript.title} Copy`,
//       updatedAt: new Date().toISOString(),
//       blocks: activeScript.blocks.map((b) => ({ ...b, id: crypto.randomUUID() })),
//     };
//     setScripts((prev) => [copy, ...prev]);
//     setActiveId(copy.id);
//   };

//   const deleteScript = () => {
//     if (!activeScript) return;
//     const confirmed = window.confirm(`Delete "${activeScript.title}"?`);
//     if (!confirmed) return;
//     const remaining = scripts.filter((s) => s.id !== activeScript.id);
//     if (!remaining.length) {
//       const fresh = DEFAULT_SCRIPT();
//       setScripts([fresh]);
//       setActiveId(fresh.id);
//       return;
//     }
//     setScripts(remaining);
//     setActiveId(remaining[0].id);
//   };

//   const renameScript = (title) => {
//     updateScript((s) => ({ ...s, title }));
//   };

//   const addBlock = (type, index = activeScript?.blocks.length || 0) => {
//     if (!activeScript) return;
//     const template = BLOCK_TYPES.find((b) => b.type === type);
//     const newBlock = {
//       id: crypto.randomUUID(),
//       type,
//       content: "",
//       placeholder: template?.hint || "",
//     };

//     updateScript((s) => {
//       const next = [...s.blocks];
//       next.splice(index, 0, newBlock);
//       return { ...s, blocks: next };
//     });

//     setTimeout(() => {
//       const el = editorRefs.current[newBlock.id];
//       if (el) {
//         el.focus();
//         autoGrow(el);
//       }
//     }, 80);
//   };

//   const updateBlock = (blockId, content) => {
//     updateScript((s) => ({
//       ...s,
//       blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, content } : b)),
//     }));
//   };

//   const moveBlock = (index, direction) => {
//     updateScript((s) => {
//       const next = [...s.blocks];
//       const target = index + direction;
//       if (target < 0 || target >= next.length) return s;
//       [next[index], next[target]] = [next[target], next[index]];
//       return { ...s, blocks: next };
//     });
//   };

//   const removeBlock = (blockId) => {
//     updateScript((s) => ({
//       ...s,
//       blocks: s.blocks.filter((b) => b.id !== blockId),
//     }));
//   };

//   const duplicateBlock = (blockId) => {
//     updateScript((s) => {
//       const index = s.blocks.findIndex((b) => b.id === blockId);
//       if (index === -1) return s;
//       const copy = { ...s.blocks[index], id: crypto.randomUUID() };
//       const next = [...s.blocks];
//       next.splice(index + 1, 0, copy);
//       return { ...s, blocks: next };
//     });
//   };

//   const exportTxt = () => {
//     if (!activeScript) return;
//     const blob = new Blob([scriptToText(activeScript)], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${slugify(activeScript.title)}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const printScript = () => {
//     window.print();
//   };

//   const saveNotice = () => {
//     window.alert("Saved automatically to local storage.");
//   };

//   if (!activeScript) return null;

//   return (
//     <div className="min-h-screen bg-slate-100 text-slate-900">
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { background: white !important; }
//         }
//       `}</style>

//       <div className="no-print sticky top-0 z-40 border-b border-slate-200 bg-slate-950 text-white shadow-lg">
//         <div className="flex items-center justify-between gap-3 px-3 py-3 md:px-6">
//           <div className="flex min-w-0 items-center gap-3">
//             <button
//               onClick={() => setShowMobileSidebar(true)}
//               className="rounded-xl border border-white/10 bg-white/10 p-2 md:hidden"
//             >
//               <Menu size={18} />
//             </button>

//             <button
//               onClick={() => setShowLeftPanel((v) => !v)}
//               className="hidden rounded-xl border border-white/10 bg-white/10 p-2 md:block"
//             >
//               <PanelLeft size={18} />
//             </button>

//             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
//               <FileText size={18} />
//             </div>

//             <div className="min-w-0">
//               <h1 className="truncate text-lg font-bold">Script Studio Pro</h1>
//               <p className="truncate text-xs text-slate-300">Scene • Dialogue • Notes • Dual Dialogue • Outline</p>
//             </div>
//           </div>

//           <div className="hidden items-center gap-2 md:flex">
//             <button
//               onClick={() => setViewMode("editor")}
//               className={`rounded-xl px-3 py-2 text-sm ${viewMode === "editor" ? "bg-white text-slate-900" : "bg-white/10"}`}
//             >
//               Editor
//             </button>
//             <button
//               onClick={() => setViewMode("outline")}
//               className={`rounded-xl px-3 py-2 text-sm ${viewMode === "outline" ? "bg-white text-slate-900" : "bg-white/10"}`}
//             >
//               Outline
//             </button>
//             <button
//               onClick={() => setViewMode("preview")}
//               className={`rounded-xl px-3 py-2 text-sm ${viewMode === "preview" ? "bg-white text-slate-900" : "bg-white/10"}`}
//             >
//               Preview
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto border-t border-white/10 px-2 py-2 md:px-4">
//           <div className="flex min-w-max items-center gap-2">
//             {BLOCK_TYPES.map((item) => (
//               <button
//                 key={item.type}
//                 onClick={() => addBlock(item.type)}
//                 className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium transition hover:bg-white/20"
//                 title={item.label}
//               >
//                 {item.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         <>
//           {showMobileSidebar && (
//             <div
//               className="no-print fixed inset-0 z-40 bg-slate-950/50 md:hidden"
//               onClick={() => setShowMobileSidebar(false)}
//             />
//           )}

//           {(showLeftPanel || showMobileSidebar) && (
//             <aside
//               className={`no-print fixed left-0 top-0 z-50 h-full w-[88%] max-w-sm border-r border-slate-200 bg-white p-4 shadow-2xl md:sticky md:z-10 md:block md:h-[calc(100vh-0px)] md:w-80 ${
//                 showMobileSidebar ? "block" : "hidden md:block"
//               }`}
//             >
//               <div className="mb-4 flex items-center justify-between">
//                 <div>
//                   <h2 className="text-lg font-bold">Your Scripts</h2>
//                   <p className="text-sm text-slate-500">Save and manage projects</p>
//                 </div>
//                 <button className="rounded-xl p-2 hover:bg-slate-100 md:hidden" onClick={() => setShowMobileSidebar(false)}>
//                   <X size={18} />
//                 </button>
//               </div>

//               <button
//                 onClick={createScript}
//                 className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg"
//               >
//                 <Plus size={16} /> New Script
//               </button>

//               <div className="relative mb-4">
//                 <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search scripts"
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none focus:border-slate-400"
//                 />
//               </div>

//               <div className="space-y-3 overflow-y-auto pb-24">
//                 {filteredScripts.map((script) => (
//                   <button
//                     key={script.id}
//                     onClick={() => {
//                       setActiveId(script.id);
//                       setShowMobileSidebar(false);
//                     }}
//                     className={`w-full rounded-2xl border p-4 text-left transition ${script.id === activeId ? "border-slate-950 bg-slate-950 text-white shadow-xl" : "border-slate-200 bg-slate-50 hover:bg-white"}`}
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="min-w-0">
//                         <h3 className="truncate font-semibold">{script.title}</h3>
//                         <p className={`mt-1 text-xs ${script.id === activeId ? "text-slate-300" : "text-slate-500"}`}>
//                           {script.blocks.length} blocks
//                         </p>
//                       </div>
//                     </div>
//                     <p className="mt-3 text-xs text-slate-400">Updated {formatDate(script.updatedAt)}</p>
//                   </button>
//                 ))}
//               </div>
//             </aside>
//           )}
//         </>

//         <main className="min-w-0 flex-1">
//           <div className="no-print border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-8">
//             <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//               <div className="min-w-0">
//                 <input
//                   value={activeScript.title}
//                   onChange={(e) => renameScript(e.target.value)}
//                   className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl font-bold outline-none focus:border-slate-400 md:max-w-xl"
//                 />
//                 <p className="mt-2 text-sm text-slate-500">Auto-saved locally • Last updated {formatDate(activeScript.updatedAt)}</p>
//               </div>

//               <div className="flex flex-wrap items-center gap-2">
//                 <button onClick={duplicateScript} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Copy className="mr-2 inline" size={16} />Duplicate</button>
//                 <button onClick={saveNotice} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Save className="mr-2 inline" size={16} />Save</button>
//                 <button onClick={exportTxt} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Download className="mr-2 inline" size={16} />Export</button>
//                 <button onClick={printScript} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Printer className="mr-2 inline" size={16} />Print</button>
//                 <button onClick={deleteScript} className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white"><Trash2 className="mr-2 inline" size={16} />Delete</button>
//               </div>
//             </div>

//             <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Words</p><p className="mt-1 text-xl font-bold">{stats.words}</p></div>
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Est. Pages</p><p className="mt-1 text-xl font-bold">{stats.pages}</p></div>
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Scenes</p><p className="mt-1 text-xl font-bold">{stats.scenes}</p></div>
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Mode</p><p className="mt-1 text-xl font-bold capitalize">{viewMode}</p></div>
//             </div>

//             <div className="mt-4 flex flex-wrap gap-2 md:hidden">
//               <button
//                 onClick={() => setViewMode("editor")}
//                 className={`rounded-xl px-3 py-2 text-sm ${viewMode === "editor" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"}`}
//               >
//                 Editor
//               </button>
//               <button
//                 onClick={() => setViewMode("outline")}
//                 className={`rounded-xl px-3 py-2 text-sm ${viewMode === "outline" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"}`}
//               >
//                 Outline
//               </button>
//               <button
//                 onClick={() => setViewMode("preview")}
//                 className={`rounded-xl px-3 py-2 text-sm ${viewMode === "preview" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"}`}
//               >
//                 Preview
//               </button>
//             </div>
//           </div>

//           <div className="px-3 py-4 md:px-8 md:py-8">
//             {viewMode === "outline" && (
//               <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
//                 <div className="mb-6 flex items-center gap-3">
//                   <div className="rounded-2xl bg-blue-100 p-3 text-blue-700"><Edit3 size={18} /></div>
//                   <div>
//                     <h3 className="text-xl font-bold">Story Outline</h3>
//                     <p className="text-sm text-slate-500">Quick structure view of scenes, sequences, acts, and notes</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   {activeScript.blocks.map((block, i) => {
//                     if (!["scene", "outline", "sequence", "newAct", "endAct", "note", "shot"].includes(block.type)) return null;
//                     return (
//                       <div key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                         <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{block.type}</div>
//                         <div className="font-medium">{block.content || `${block.type} ${i + 1}`}</div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {viewMode === "preview" && (
//               <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-300 bg-white p-6 shadow-xl md:p-10">
//                 <div className="mb-8 text-center">
//                   <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Screenplay Preview</p>
//                   <h2 className="mt-2 text-3xl font-bold">{activeScript.title}</h2>
//                 </div>
//                 <div className="space-y-3 font-mono text-[15px] leading-7">
//                   {activeScript.blocks.map((block) => (
//                     <PreviewBlock key={block.id} block={block} />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {viewMode === "editor" && (
//               <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white shadow-2xl">
//                 <div className="no-print flex items-center justify-between border-b border-slate-200 px-4 py-4 md:px-8">
//                   <div>
//                     <h2 className="text-lg font-bold">Editor</h2>
//                     <p className="text-sm text-slate-500">Add screenplay elements from the toolbar above</p>
//                   </div>
//                   <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
//                     <Sparkles size={16} /> Premium UI
//                   </div>
//                 </div>

//                 <div className="space-y-0.5 p-3 md:p-8">
//                   {activeScript.blocks.map((block, index) => (
//                     <div key={block.id} className={`group rounded-2xl border p-2 shadow-sm transition hover:shadow-md md:p-3 ${blockWrapper(block.type)}`}>
//                       <div className="no-print mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//                         <div className="flex flex-wrap items-center gap-2">
//                           <span className="rounded-xl bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
//                             {block.type}
//                           </span>
//                           <button onClick={() => addBlock(block.type, index + 1)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs">+ add below</button>
//                         </div>
//                         <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
//                           <button onClick={() => moveBlock(index, -1)} className="rounded-xl border border-slate-200 bg-white p-2"><ChevronUp size={16} /></button>
//                           <button onClick={() => moveBlock(index, 1)} className="rounded-xl border border-slate-200 bg-white p-2"><ChevronDown size={16} /></button>
//                           <button onClick={() => duplicateBlock(block.id)} className="rounded-xl border border-slate-200 bg-white p-2"><Copy size={16} /></button>
//                           <button onClick={() => removeBlock(block.id)} className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 size={16} /></button>
//                         </div>
//                       </div>

//                       {block.type === "image" ? (
//                         <div className="space-y-0.5">
//                           <div className="flex items-center gap-2 text-sm text-slate-500"><ImageIcon size={16} /> Image block</div>
//                           <textarea
//                             ref={(el) => {
//                               editorRefs.current[block.id] = el;
//                               autoGrow(el);
//                             }}
//                             value={block.content}
//                             onChange={(e) => {
//                               updateBlock(block.id, e.target.value);
//                               autoGrow(e.target);
//                             }}
//                             placeholder="Paste image URL"
//                             className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
//                             rows={1}
//                           />
//                           {block.content ? (
//                             <img
//                               src={block.content}
//                               alt="Script reference"
//                               className="max-h-80 w-full rounded-2xl border border-slate-200 object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = "none";
//                               }}
//                             />
//                           ) : (
//                             <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
//                               Add a reference image URL here
//                             </div>
//                           )}
//                         </div>
//                       ) : block.type === "dual" ? (
//                         <DualDialogueEditor value={block.content} onChange={(next) => updateBlock(block.id, next)} />
//                       ) : (
//                         <textarea
//                           ref={(el) => {
//                             editorRefs.current[block.id] = el;
//                             autoGrow(el);
//                           }}
//                           value={block.content}
//                           placeholder={BLOCK_TYPES.find((b) => b.type === block.type)?.hint || "Write here"}
//                           onChange={(e) => {
//                             updateBlock(block.id, e.target.value);
//                             autoGrow(e.target);
//                           }}
//                           rows={1}
//                           className={getBlockStyle(block.type)}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function DualDialogueEditor({ value, onChange }) {
//   const [left = "", right = ""] = value.split("||");
//   return (
//     <div className="grid gap-3 md:grid-cols-2">
//       <div className="rounded-2xl border border-slate-200 bg-white p-4">
//         <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Left dialogue</div>
//         <textarea
//           value={left.trim()}
//           onChange={(e) => onChange(`${e.target.value} || ${right.trim()}`)}
//           className="min-h-[140px] w-full resize-none bg-transparent outline-none"
//           placeholder="Character A dialogue"
//         />
//       </div>
//       <div className="rounded-2xl border border-slate-200 bg-white p-4">
//         <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Right dialogue</div>
//         <textarea
//           value={right.trim()}
//           onChange={(e) => onChange(`${left.trim()} || ${e.target.value}`)}
//           className="min-h-[140px] w-full resize-none bg-transparent outline-none"
//           placeholder="Character B dialogue"
//         />
//       </div>
//     </div>
//   );
// }

// function PreviewBlock({ block }) {
//   if (block.type === "image") {
//     return block.content ? <img src={block.content} alt="Reference" className="max-h-80 rounded-2xl border border-slate-200" /> : null;
//   }

//   if (block.type === "dual") {
//     const [left = "", right = ""] = block.content.split("||");
//     return (
//       <div className="grid grid-cols-2 gap-8">
//         <div className="rounded-xl bg-slate-50 p-4">{left.trim()}</div>
//         <div className="rounded-xl bg-slate-50 p-4">{right.trim()}</div>
//       </div>
//     );
//   }

//   const cls = {
//     scene: "font-bold uppercase",
//     action: "",
//     character: "text-center font-semibold uppercase",
//     parens: "text-center italic text-slate-500 -mt-2",
//     dialogue: "mx-auto max-w-2xl text-center",
//     transition: "text-right font-bold uppercase",
//     shot: "font-bold uppercase",
//     text: "",
//     note: "rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-amber-900",
//     outline: "rounded-xl bg-blue-50 p-3 font-medium text-blue-900",
//     newAct: "text-center text-xl font-bold uppercase",
//     endAct: "text-center text-lg font-bold uppercase text-pink-700",
//     lyrics: "italic text-fuchsia-700",
//     sequence: "font-bold text-teal-700 uppercase",
//   }[block.type] || "";

//   return <div className={cls}>{block.content}</div>;
// }

// export { createTestCases };


import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Save,
  Trash2,
  Copy,
  FileText,
  Search,
  Download,
  Printer,
  Edit3,
  Image as ImageIcon,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  PanelLeft,
  Sparkles,
} from "lucide-react";

const BLOCK_TYPES = [
  { type: "scene", label: "Scene", hint: "INT./EXT. LOCATION - DAY" },
  { type: "action", label: "Action", hint: "Describe action" },
  { type: "character", label: "Character", hint: "CHARACTER NAME" },
  { type: "parens", label: "Parens", hint: "(whispering)" },
  { type: "dialogue", label: "Dialogue", hint: "Spoken lines" },
  { type: "transition", label: "Transition", hint: "CUT TO:" },
  { type: "shot", label: "Shot", hint: "CLOSE ON:" },
  { type: "text", label: "Text", hint: "General text" },
  { type: "note", label: "Note", hint: "Writer note" },
  { type: "outline", label: "Outline", hint: "Beat / summary" },
  { type: "newAct", label: "New Act", hint: "ACT ONE" },
  { type: "endAct", label: "End Act", hint: "END OF ACT ONE" },
  { type: "lyrics", label: "Lyrics", hint: "Song lyrics" },
  { type: "image", label: "Image", hint: "Paste image URL" },
  { type: "sequence", label: "Sequence", hint: "Sequence title" },
  { type: "dual", label: "Dual", hint: "LEFT DIALOGUE || RIGHT DIALOGUE" },
];

const DEFAULT_SCRIPT = () => ({
  id: crypto.randomUUID(),
  title: "Untitled Script",
  updatedAt: new Date().toISOString(),
  blocks: [{ id: crypto.randomUUID(), type: "scene", content: "" }],
});

const STORAGE_KEY = "premium-script-studio-files";
const ACTIVE_KEY = "premium-script-studio-active";
const VIEW_KEY = "premium-script-studio-view";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "script";
}

function getBlockStyle(type) {
  const base = "w-full bg-transparent outline-none resize-none text-[15px] leading-[1.05] p-0 m-0 border-0 shadow-none";
  switch (type) {
    case "scene":
    case "transition":
    case "shot":
    case "newAct":
    case "endAct":
      return `${base} uppercase tracking-wide font-semibold`;
    case "character":
      return `${base} text-center font-semibold uppercase md:pl-[22%] md:pr-[22%]`;
    case "dialogue":
      return `${base} text-left md:pl-[26%] md:pr-[26%]`;
    case "parens":
      return `${base} text-center italic text-slate-500 md:pl-[24%] md:pr-[24%]`;
    case "lyrics":
      return `${base} italic text-fuchsia-700`;
    case "note":
      return `${base} text-amber-900`;
    case "outline":
      return `${base} text-blue-900 font-medium`;
    default:
      return base;
  }
}

function blockWrapper(type) {
  switch (type) {
    case "scene":
      return "bg-slate-50 border-slate-200";
    case "action":
      return "bg-white border-slate-200";
    case "character":
      return "bg-violet-50 border-violet-200 py-1";
    case "parens":
      return "bg-rose-50 border-rose-200 -mt-3 py-0.5";
    case "dialogue":
      return "bg-white border-slate-200 -mt-3 py-0.5";
    case "transition":
      return "bg-emerald-50 border-emerald-200 text-right";
    case "shot":
      return "bg-cyan-50 border-cyan-200";
    case "text":
      return "bg-white border-slate-200";
    case "note":
      return "bg-amber-50 border-amber-200 border-dashed";
    case "outline":
      return "bg-blue-50 border-blue-200";
    case "newAct":
      return "bg-indigo-100 border-indigo-300 text-center";
    case "endAct":
      return "bg-pink-100 border-pink-300 text-center";
    case "lyrics":
      return "bg-fuchsia-50 border-fuchsia-200";
    case "image":
      return "bg-slate-50 border-slate-200";
    case "sequence":
      return "bg-teal-50 border-teal-200 font-semibold";
    case "dual":
      return "bg-purple-50 border-purple-200";
    default:
      return "bg-white border-slate-200";
  }
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.max(48, el.scrollHeight)}px`;
}

function scriptToText(script) {
  return script.blocks
    .map((b) => {
      if (b.type === "image") return `[IMAGE] ${b.content}`;
      if (b.type === "dual") {
        const [left = "", right = ""] = b.content.split("||");
        return `${left.trim()}    ||    ${right.trim()}`;
      }
      return b.content;
    })
    .join("\n\n");
}

function getWordCount(script) {
  return script.blocks
    .map((b) => b.content || "")
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function createTestCases() {
  return [
    {
      name: "empty new script uses placeholder",
      input: DEFAULT_SCRIPT(),
      check: (script) => script.blocks.length === 1 && script.blocks[0].content === "",
    },
    {
      name: "dialogue block stays centered style",
      input: "dialogue",
      check: (type) => getBlockStyle(type).includes("text-center"),
    },
    {
      name: "parens style stays close to dialogue",
      input: "parens",
      check: (type) => getBlockStyle(type).includes("-mt-2"),
    },
  ];
}

export default function App() {
  const [scripts, setScripts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      } catch {}
    }
    return [DEFAULT_SCRIPT()];
  });

  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY) || null);
  const [search, setSearch] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 768;
  });
  const [viewMode, setViewMode] = useState(() => localStorage.getItem(VIEW_KEY) || "editor");
  const editorRefs = useRef({});

  useEffect(() => {
    if (!activeId && scripts.length) setActiveId(scripts[0].id);
    if (activeId && !scripts.find((s) => s.id === activeId) && scripts.length) setActiveId(scripts[0].id);
  }, [activeId, scripts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId]);

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      Object.values(editorRefs.current).forEach(autoGrow);
    });
  }, [scripts, viewMode]);

  const activeScript = useMemo(
    () => scripts.find((s) => s.id === activeId) || scripts[0],
    [scripts, activeId]
  );

  const filteredScripts = useMemo(() => {
    return scripts.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
  }, [scripts, search]);

  const stats = useMemo(() => {
    if (!activeScript) return { words: 0, pages: 0, scenes: 0 };
    const words = getWordCount(activeScript);
    const scenes = activeScript.blocks.filter((b) => b.type === "scene").length;
    const pages = Math.max(1, Math.ceil(words / 180));
    return { words, scenes, pages };
  }, [activeScript]);

  const updateScript = (updater) => {
    if (!activeScript) return;
    setScripts((prev) =>
      prev.map((s) =>
        s.id === activeScript.id ? { ...updater(s), updatedAt: new Date().toISOString() } : s
      )
    );
  };

  const createScript = () => {
    const next = DEFAULT_SCRIPT();
    setScripts((prev) => [next, ...prev]);
    setActiveId(next.id);
    setShowMobileSidebar(false);
  };

  const duplicateScript = () => {
    if (!activeScript) return;
    const copy = {
      ...activeScript,
      id: crypto.randomUUID(),
      title: `${activeScript.title} Copy`,
      updatedAt: new Date().toISOString(),
      blocks: activeScript.blocks.map((b) => ({ ...b, id: crypto.randomUUID() })),
    };
    setScripts((prev) => [copy, ...prev]);
    setActiveId(copy.id);
  };

  const deleteScript = () => {
    if (!activeScript) return;
    const confirmed = window.confirm(`Delete "${activeScript.title}"?`);
    if (!confirmed) return;
    const remaining = scripts.filter((s) => s.id !== activeScript.id);
    if (!remaining.length) {
      const fresh = DEFAULT_SCRIPT();
      setScripts([fresh]);
      setActiveId(fresh.id);
      return;
    }
    setScripts(remaining);
    setActiveId(remaining[0].id);
  };

  const renameScript = (title) => {
    updateScript((s) => ({ ...s, title }));
  };

  const addBlock = (type, index = activeScript?.blocks.length || 0) => {
    if (!activeScript) return;
    const template = BLOCK_TYPES.find((b) => b.type === type);
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
      placeholder: template?.hint || "",
    };

    updateScript((s) => {
      const next = [...s.blocks];
      next.splice(index, 0, newBlock);
      return { ...s, blocks: next };
    });

    setTimeout(() => {
      const el = editorRefs.current[newBlock.id];
      if (el) {
        el.focus();
        autoGrow(el);
      }
    }, 80);
  };

  const updateBlock = (blockId, content) => {
    updateScript((s) => ({
      ...s,
      blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, content } : b)),
    }));
  };

  const moveBlock = (index, direction) => {
    updateScript((s) => {
      const next = [...s.blocks];
      const target = index + direction;
      if (target < 0 || target >= next.length) return s;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...s, blocks: next };
    });
  };

  const removeBlock = (blockId) => {
    updateScript((s) => ({
      ...s,
      blocks: s.blocks.filter((b) => b.id !== blockId),
    }));
  };

  const duplicateBlock = (blockId) => {
    updateScript((s) => {
      const index = s.blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return s;
      const copy = { ...s.blocks[index], id: crypto.randomUUID() };
      const next = [...s.blocks];
      next.splice(index + 1, 0, copy);
      return { ...s, blocks: next };
    });
  };

  const exportTxt = () => {
    if (!activeScript) return;
    const blob = new Blob([scriptToText(activeScript)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(activeScript.title)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printScript = () => {
    window.print();
  };

  const saveNotice = () => {
    window.alert("Saved automatically to local storage.");
  };

  if (!activeScript) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="no-print sticky top-0 z-40 border-b border-slate-200 bg-slate-950 text-white shadow-lg">
        <div className="flex items-center justify-between gap-3 px-3 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="rounded-xl border border-white/10 bg-white/10 p-2 md:hidden"
            >
              <Menu size={18} />
            </button>

            <button
              onClick={() => setShowLeftPanel((v) => !v)}
              className="hidden rounded-xl border border-white/10 bg-white/10 p-2 md:block"
            >
              <PanelLeft size={18} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
              <FileText size={18} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold">Script Studio Pro</h1>
              <p className="truncate text-xs text-slate-300">Scene • Dialogue • Notes • Dual Dialogue • Outline</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => setViewMode("editor")}
              className={`rounded-xl px-3 py-2 text-sm ${viewMode === "editor" ? "bg-white text-slate-900" : "bg-white/10"}`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode("outline")}
              className={`rounded-xl px-3 py-2 text-sm ${viewMode === "outline" ? "bg-white text-slate-900" : "bg-white/10"}`}
            >
              Outline
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`rounded-xl px-3 py-2 text-sm ${viewMode === "preview" ? "bg-white text-slate-900" : "bg-white/10"}`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-white/10 px-2 py-2 md:px-4">
          <div className="flex min-w-max items-center gap-2">
            {BLOCK_TYPES.map((item) => (
              <button
                key={item.type}
                onClick={() => addBlock(item.type)}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium transition hover:bg-white/20"
                title={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        <>
          {showMobileSidebar && (
            <div
              className="no-print fixed inset-0 z-40 bg-slate-950/50 md:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {(showLeftPanel || showMobileSidebar) && (
            <aside
              className={`no-print fixed left-0 top-0 z-50 h-full w-[88%] max-w-sm border-r border-slate-200 bg-white p-4 shadow-2xl md:sticky md:z-10 md:block md:h-[calc(100vh-0px)] md:w-80 ${
                showMobileSidebar ? "block" : "hidden md:block"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Your Scripts</h2>
                  <p className="text-sm text-slate-500">Save and manage projects</p>
                </div>
                <button className="rounded-xl p-2 hover:bg-slate-100 md:hidden" onClick={() => setShowMobileSidebar(false)}>
                  <X size={18} />
                </button>
              </div>

              <button
                onClick={createScript}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                <Plus size={16} /> New Script
              </button>

              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search scripts"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-3 overflow-y-auto pb-24">
                {filteredScripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => {
                      setActiveId(script.id);
                      setShowMobileSidebar(false);
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${script.id === activeId ? "border-slate-950 bg-slate-950 text-white shadow-xl" : "border-slate-200 bg-slate-50 hover:bg-white"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{script.title}</h3>
                        <p className={`mt-1 text-xs ${script.id === activeId ? "text-slate-300" : "text-slate-500"}`}>
                          {script.blocks.length} blocks
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Updated {formatDate(script.updatedAt)}</p>
                  </button>
                ))}
              </div>
            </aside>
          )}
        </>

        <main className="min-w-0 flex-1">
          <div className="no-print border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <input
                  value={activeScript.title}
                  onChange={(e) => renameScript(e.target.value)}
                  className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl font-bold outline-none focus:border-slate-400 md:max-w-xl"
                />
                <p className="mt-2 text-sm text-slate-500">Auto-saved locally • Last updated {formatDate(activeScript.updatedAt)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button onClick={duplicateScript} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Copy className="mr-2 inline" size={16} />Duplicate</button>
                <button onClick={saveNotice} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Save className="mr-2 inline" size={16} />Save</button>
                <button onClick={exportTxt} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Download className="mr-2 inline" size={16} />Export</button>
                <button onClick={printScript} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"><Printer className="mr-2 inline" size={16} />Print</button>
                <button onClick={deleteScript} className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white"><Trash2 className="mr-2 inline" size={16} />Delete</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Words</p><p className="mt-1 text-xl font-bold">{stats.words}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Est. Pages</p><p className="mt-1 text-xl font-bold">{stats.pages}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Scenes</p><p className="mt-1 text-xl font-bold">{stats.scenes}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Mode</p><p className="mt-1 text-xl font-bold capitalize">{viewMode}</p></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 md:hidden">
              <button
                onClick={() => setViewMode("editor")}
                className={`rounded-xl px-3 py-2 text-sm ${viewMode === "editor" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"}`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode("outline")}
                className={`rounded-xl px-3 py-2 text-sm ${viewMode === "outline" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"}`}
              >
                Outline
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`rounded-xl px-3 py-2 text-sm ${viewMode === "preview" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"}`}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="px-3 py-4 md:px-8 md:py-8">
            {viewMode === "outline" && (
              <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-700"><Edit3 size={18} /></div>
                  <div>
                    <h3 className="text-xl font-bold">Story Outline</h3>
                    <p className="text-sm text-slate-500">Quick structure view of scenes, sequences, acts, and notes</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {activeScript.blocks.map((block, i) => {
                    if (!["scene", "outline", "sequence", "newAct", "endAct", "note", "shot"].includes(block.type)) return null;
                    return (
                      <div key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{block.type}</div>
                        <div className="font-medium">{block.content || `${block.type} ${i + 1}`}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "preview" && (
              <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-300 bg-white p-6 shadow-xl md:p-10">
                <div className="mb-8 text-center">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Screenplay Preview</p>
                  <h2 className="mt-2 text-3xl font-bold">{activeScript.title}</h2>
                </div>
                <div className="space-y-3 font-mono text-[15px] leading-tight">
                  {activeScript.blocks.map((block) => (
                    <PreviewBlock key={block.id} block={block} />
                  ))}
                </div>
              </div>
            )}

            {viewMode === "editor" && (
              <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white shadow-2xl">
                <div className="no-print flex items-center justify-between border-b border-slate-200 px-4 py-4 md:px-8">
                  <div>
                    <h2 className="text-lg font-bold">Editor</h2>
                    <p className="text-sm text-slate-500">Add screenplay elements from the toolbar above</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                    <Sparkles size={16} /> Premium UI
                  </div>
                </div>

                <div className="space-y-1 p-3 md:p-8">
                  {activeScript.blocks.map((block, index) => (
                    <div key={block.id} className={`group rounded-2xl border px-2 py-1 shadow-sm transition hover:shadow-md md:px-3 md:py-1.5 ${blockWrapper(block.type)}`}>
                      <div className="no-print mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-xl bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                            {block.type}
                          </span>
                          <button onClick={() => addBlock(block.type, index + 1)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs">+ add below</button>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                          <button onClick={() => moveBlock(index, -1)} className="rounded-xl border border-slate-200 bg-white p-2"><ChevronUp size={16} /></button>
                          <button onClick={() => moveBlock(index, 1)} className="rounded-xl border border-slate-200 bg-white p-2"><ChevronDown size={16} /></button>
                          <button onClick={() => duplicateBlock(block.id)} className="rounded-xl border border-slate-200 bg-white p-2"><Copy size={16} /></button>
                          <button onClick={() => removeBlock(block.id)} className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      {block.type === "image" ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-500"><ImageIcon size={16} /> Image block</div>
                          <textarea
                            ref={(el) => {
                              editorRefs.current[block.id] = el;
                              autoGrow(el);
                            }}
                            value={block.content}
                            onChange={(e) => {
                              updateBlock(block.id, e.target.value);
                              autoGrow(e.target);
                            }}
                            placeholder="Paste image URL"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
                            rows={1}
                          />
                          {block.content ? (
                            <img
                              src={block.content}
                              alt="Script reference"
                              className="max-h-80 w-full rounded-2xl border border-slate-200 object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
                              Add a reference image URL here
                            </div>
                          )}
                        </div>
                      ) : block.type === "dual" ? (
                        <DualDialogueEditor value={block.content} onChange={(next) => updateBlock(block.id, next)} />
                      ) : (
                        <textarea
                          ref={(el) => {
                            editorRefs.current[block.id] = el;
                            autoGrow(el);
                          }}
                          value={block.content}
                          placeholder={BLOCK_TYPES.find((b) => b.type === block.type)?.hint || "Write here"}
                          onChange={(e) => {
                            updateBlock(block.id, e.target.value);
                            autoGrow(e.target);
                          }}
                          rows={1}
                          className={getBlockStyle(block.type)} style={{ lineHeight: 1.05, paddingTop: 0, paddingBottom: 0, margin: 0 }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DualDialogueEditor({ value, onChange }) {
  const [left = "", right = ""] = value.split("||");
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Left dialogue</div>
        <textarea
          value={left.trim()}
          onChange={(e) => onChange(`${e.target.value} || ${right.trim()}`)}
          className="min-h-[140px] w-full resize-none bg-transparent outline-none"
          placeholder="Character A dialogue"
        />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Right dialogue</div>
        <textarea
          value={right.trim()}
          onChange={(e) => onChange(`${left.trim()} || ${e.target.value}`)}
          className="min-h-[140px] w-full resize-none bg-transparent outline-none"
          placeholder="Character B dialogue"
        />
      </div>
    </div>
  );
}

function PreviewBlock({ block }) {
  if (block.type === "image") {
    return block.content ? <img src={block.content} alt="Reference" className="max-h-80 rounded-2xl border border-slate-200" /> : null;
  }

  if (block.type === "dual") {
    const [left = "", right = ""] = block.content.split("||");
    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="rounded-xl bg-slate-50 p-4">{left.trim()}</div>
        <div className="rounded-xl bg-slate-50 p-4">{right.trim()}</div>
      </div>
    );
  }

  const cls = {
    scene: "font-bold uppercase",
    action: "",
    character: "text-center font-semibold uppercase md:pl-[22%] md:pr-[22%] leading-[1.05]",
    parens: "text-center italic text-slate-500 md:pl-[24%] md:pr-[24%] -mt-2 leading-[1.05]",
    dialogue: "md:pl-[26%] md:pr-[26%] -mt-2 leading-[1.05]",
    transition: "text-right font-bold uppercase",
    shot: "font-bold uppercase",
    text: "",
    note: "rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-amber-900",
    outline: "rounded-xl bg-blue-50 p-3 font-medium text-blue-900",
    newAct: "text-center text-xl font-bold uppercase",
    endAct: "text-center text-lg font-bold uppercase text-pink-700",
    lyrics: "italic text-fuchsia-700",
    sequence: "font-bold text-teal-700 uppercase",
  }[block.type] || "";

  return <div className={cls}>{block.content}</div>;
}

export { createTestCases };
