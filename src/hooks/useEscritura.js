// Hook: useEscritura
// Extrae estados y lógica de Escritura (Writing) de b-app1.jsx
window.useEscritura = function(deps) {
  const { pdfStudyDoc, setPdfStudyErr, setActiveTab, setPdfStudyBusyMsg, setPdfStudyLastApplied } = deps;

  const [showHandwriting, setShowHandwriting] = React.useState(false);
  const [writingMode, setWritingMode] = React.useState("free");
  const [writingGrid, setWritingGrid] = React.useState(true);
  const [writingStroke, setWritingStroke] = React.useState(4);
  const [writingCopyIdx, setWritingCopyIdx] = React.useState(0);
  const [writingPromptIdx, setWritingPromptIdx] = React.useState(0);
  const [writingTelcIdx, setWritingTelcIdx] = React.useState(0);
  const [writingTelcInputMode, setWritingTelcInputMode] = React.useState("pen");
  const [writingTelcTypedText, setWritingTelcTypedText] = React.useState("");
  const [writingTelcLastOcrText, setWritingTelcLastOcrText] = React.useState("");
  const [writingTelcCoach, setWritingTelcCoach] = React.useState(null);
  const [writingDictIdx, setWritingDictIdx] = React.useState(0);
  const [writingLetterIdx, setWritingLetterIdx] = React.useState(0);
  const [writingGuionWriteIdx, setWritingGuionWriteIdx] = React.useState(0);
  const [writingDictReveal, setWritingDictReveal] = React.useState(false);
  const [writingDictSource, setWritingDictSource] = React.useState("builtin");
  const [writingDictScriptId, setWritingDictScriptId] = React.useState("__current__");
  const [writingCanvasKey, setWritingCanvasKey] = React.useState(0);
  const [writingCanvasSnapshot, setWritingCanvasSnapshot] = React.useState({ padKey: 0, data: "" });
  const [writingVocabIdx, setWritingVocabIdx] = React.useState(0);

  const escrituraExerciseHelpId = React.useMemo(function() {
    return "escritura_" + writingMode;
  }, [writingMode]);

  const applyPdfStudyTextToWriting = React.useCallback(function(pageNumber) {
    if (!pdfStudyDoc) return;
    const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
    const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
    const txt = page && page.text ? String(page.text).trim() : "";
    if (!txt) {
      setPdfStudyErr("Página sin texto extraído todavía.");
      return;
    }
    setActiveTab("escritura");
    setWritingMode("telc");
    setWritingTelcInputMode("keyboard");
    setWritingTelcTypedText(txt);
    setPdfStudyBusyMsg("Página " + page.page + " enviada a Escritura TELC.");
    setPdfStudyLastApplied("✓ Página " + page.page + " cargada en Escritura TELC");
  }, [pdfStudyDoc, setPdfStudyErr, setActiveTab, setWritingMode, setWritingTelcInputMode, setWritingTelcTypedText, setPdfStudyBusyMsg, setPdfStudyLastApplied]);

  return {
    showHandwriting, setShowHandwriting,
    writingMode, setWritingMode,
    writingGrid, setWritingGrid,
    writingStroke, setWritingStroke,
    writingCopyIdx, setWritingCopyIdx,
    writingPromptIdx, setWritingPromptIdx,
    writingTelcIdx, setWritingTelcIdx,
    writingTelcInputMode, setWritingTelcInputMode,
    writingTelcTypedText, setWritingTelcTypedText,
    writingTelcLastOcrText, setWritingTelcLastOcrText,
    writingTelcCoach, setWritingTelcCoach,
    writingDictIdx, setWritingDictIdx,
    writingLetterIdx, setWritingLetterIdx,
    writingGuionWriteIdx, setWritingGuionWriteIdx,
    writingDictReveal, setWritingDictReveal,
    writingDictSource, setWritingDictSource,
    writingDictScriptId, setWritingDictScriptId,
    writingCanvasKey, setWritingCanvasKey,
    writingCanvasSnapshot, setWritingCanvasSnapshot,
    writingVocabIdx, setWritingVocabIdx,
    escrituraExerciseHelpId,
    applyPdfStudyTextToWriting
  };
};
