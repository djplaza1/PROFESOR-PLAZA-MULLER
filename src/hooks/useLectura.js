window.useLecturaState = function (app) {
  // ---- estados ----
  var _ref1 = React.useState("current_story");
  var readingSource = _ref1[0], setReadingSource = _ref1[1];

  var _ref2 = React.useState("__current__");
  var readingScriptId = _ref2[0], setReadingScriptId = _ref2[1];

  var _ref3 = React.useState("");
  var readingTextInput = _ref3[0], setReadingTextInput = _ref3[1];

  var _ref4 = React.useState(function () {
    try {
      var raw = Number(localStorage.getItem("muller_reading_font_size"));
      return Number.isFinite(raw) ? mullerClamp(raw, 14, 32) : 19;
    } catch (e) { return 19; }
  });
  var readingFontPx = _ref4[0], setReadingFontPx = _ref4[1];

  var _ref5 = React.useState(null);
  var readingWordInfo = _ref5[0], setReadingWordInfo = _ref5[1];

  var _ref6 = React.useState(false);
  var readingFocusMode = _ref6[0], setReadingFocusMode = _ref6[1];

  var _ref7 = React.useState("");
  var readingSelectedSnippet = _ref7[0], setReadingSelectedSnippet = _ref7[1];

  var _ref8 = React.useState(false);
  var readingWordAudioBusy = _ref8[0], setReadingWordAudioBusy = _ref8[1];

  var _ref9 = React.useState(false);
  var readingListening = _ref9[0], setReadingListening = _ref9[1];

  var _ref10 = React.useState("");
  var readingTranscript = _ref10[0], setReadingTranscript = _ref10[1];

  var _ref11 = React.useState(null);
  var readingScore = _ref11[0], setReadingScore = _ref11[1];

  var _ref12 = React.useState([]);
  var readingFeedback = _ref12[0], setReadingFeedback = _ref12[1];

  // ---- referencias ----
  var readingTextSurfaceRef = React.useRef(null);
  var readingRecRef = React.useRef(null);
  var readingRestartTimerRef = React.useRef(null);
  var readingSessionIdRef = React.useRef(0);
  var readingStopRequestedRef = React.useRef(false);
  var readingAutoRestartRef = React.useRef(false);
  var readingFinalRef = React.useRef("");
  var readingLiveTranscriptRef = React.useRef("");

  // ---- derivados ----
  var readingTargetText = React.useMemo(function () {
    if (readingSource === "paste") return String(readingTextInput || "").trim();
    if (readingSource === "current_story") {
      return (app.guionData || []).map(function (s) { return String(s && s.text ? s.text : "").trim(); }).filter(Boolean).join(" ");
    }
    if (readingSource === "one_saved") {
      var picked = (app.savedScripts || []).find(function (s) { return String(s.id) === String(readingScriptId); });
      if (!picked) return "";
      try {
        var rows = JSON.parse(picked.data || "[]");
        return (rows || []).map(function (s) { return String(s && s.text ? s.text : "").trim(); }).filter(Boolean).join(" ");
      } catch (e) { return ""; }
    }
    return "";
  }, [readingSource, readingTextInput, app.guionData, app.savedScripts, readingScriptId]);

  var readingProgress = React.useMemo(function () {
    var targetWords = normalizeGermanSpeechText(readingTargetText || "").split(/\s+/).filter(Boolean);
    var spokenWords = normalizeGermanSpeechText(readingTranscript || "").split(/\s+/).filter(Boolean);
    if (!targetWords.length) return { matched: 0, total: 0, pct: 0 };
    var i = 0;
    while (i < targetWords.length && i < spokenWords.length && targetWords[i] === spokenWords[i]) i++;
    var pct = Math.round((i / targetWords.length) * 100);
    return { matched: i, total: targetWords.length, pct: pct };
  }, [readingTargetText, readingTranscript]);

  var readingWordTokens = React.useMemo(function () { return mullerReadingTokenizeText(readingTargetText); }, [readingTargetText]);
  var readingScriptOptions = React.useMemo(function () {
    return (app.savedScripts || []).map(function (s) { return { id: String(s.id), title: s.title || "Sin título" }; });
  }, [app.savedScripts]);

  var readingSelectedWord = readingWordInfo ? String(readingWordInfo.word || "") : "";

  var readingVerbLookup = React.useMemo(function () {
    var map = new Map();
    (app.rutaVerbDb && Array.isArray(app.rutaVerbDb.verbs) ? app.rutaVerbDb.verbs : []).forEach(function (verb) {
      if (!verb) return;
      var lemmaKey = mullerNormalizeGermanWordToken(verb.lemma || verb.id || "");
      if (lemmaKey && !map.has(lemmaKey)) map.set(lemmaKey, verb);
      var forms = verb.forms || {};
      Object.keys(forms).forEach(function (tenseKey) {
        var tense = forms[tenseKey];
        if (!tense || typeof tense !== "object") return;
        Object.values(tense).forEach(function (v) {
          var w = mullerNormalizeGermanWordToken(v);
          if (w && !map.has(w)) map.set(w, verb);
        });
      });
      var p2 = mullerNormalizeGermanWordToken(verb.partizip2 || "");
      if (p2 && !map.has(p2)) map.set(p2, verb);
    });
    return map;
  }, [app.rutaVerbDb]);

  var readingVerbInfo = React.useMemo(function () {
    var key = mullerNormalizeGermanWordToken(readingSelectedWord);
    if (!key) return null;
    var hit = readingVerbLookup.get(key) || null;
    if (hit) {
      var forms = (hit && hit.forms) || {};
      var pr = forms.praeteritum && (forms.praeteritum.ich || forms.praeteritum.er_sie_es || forms.praeteritum.wir || forms.praeteritum.sie_Sie || forms.praeteritum.du);
      var pf = forms.perfekt && (forms.perfekt.ich || forms.perfekt.er_sie_es || forms.perfekt.wir || forms.perfekt.sie_Sie || forms.perfekt.du);
      return { infinitive: hit.lemma || hit.id || key, translation: hit.es || "", praeteritum: pr || "", perfekt: pf || "", level: hit.level || "", source: "db" };
    }
    var fallback = resolveTempusVerbInfo(key);
    if (!fallback) return null;
    return { infinitive: fallback.infinitive || key, translation: "", praeteritum: "", perfekt: "", formsHint: fallback.forms || "", source: "fallback" };
  }, [readingSelectedWord, readingVerbLookup]);

  // ---- funciones auxiliares ----
  var readingSpeakText = React.useCallback(function (rawText, opts) {
    var text = String(rawText || "").replace(/\s+/g, " ").trim();
    if (!text) return false;
    var synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== "function") {
      if (window.__mullerToast) window.__mullerToast("Tu navegador no soporta reproducción de voz.", "error");
      return false;
    }
    var defaultRate = Number(opts && opts.rate);
    var fallbackRate = Number.isFinite(defaultRate) ? defaultRate : 0.92;
    var finalRate = fallbackRate;
    try {
      var storedRate = parseFloat(localStorage.getItem("muller_tts_rate") || String(fallbackRate));
      if (Number.isFinite(storedRate) && storedRate >= 0.5 && storedRate <= 1.5) finalRate = storedRate;
    } catch (e) {}
    try {
      setReadingWordAudioBusy(true);
      synth.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = "de-DE";
      utter.rate = finalRate;
      if (typeof window.__mullerApplyPreferredDeVoice === "function") window.__mullerApplyPreferredDeVoice(utter);
      utter.onend = function () { setReadingWordAudioBusy(false); };
      utter.onerror = function () { setReadingWordAudioBusy(false); };
      synth.speak(utter);
      return true;
    } catch (e) {
      setReadingWordAudioBusy(false);
      if (window.__mullerToast) window.__mullerToast("No se pudo reproducir el audio ahora.", "error");
      return false;
    }
  }, []);

  var speakReadingWord = React.useCallback(function (rawWord) {
    var cleanWord = mullerNormalizeGermanWordToken(rawWord);
    if (!cleanWord) return;
    readingSpeakText(cleanWord, { rate: 0.9 });
  }, [readingSpeakText]);

  var runReadingWordLookup = React.useCallback(async function (rawWord) {
    var cleanWord = mullerNormalizeGermanWordToken(rawWord);
    if (!cleanWord) return;
    setReadingWordInfo({ word: cleanWord, loading: true, translation: "", error: "", ts: Date.now() });
    try {
      var r = await mullerTranslateGtxFull(cleanWord, "de", "es");
      var out = String((r && r.text) || "").trim();
      if (out) {
        setReadingWordInfo(function (prev) {
          if (!prev || prev.word !== cleanWord) return prev;
          return { word: prev.word, loading: false, translation: out, error: "", ts: prev.ts };
        });
        return;
      }
    } catch (e) {}
    try {
      var mm = await mullerTranslateViaMyMemory(cleanWord, "de|es");
      setReadingWordInfo(function (prev) {
        if (!prev || prev.word !== cleanWord) return prev;
        return { word: prev.word, loading: false, translation: String(mm || "").trim(), error: "", ts: prev.ts };
      });
    } catch (e2) {
      setReadingWordInfo(function (prev) {
        if (!prev || prev.word !== cleanWord) return prev;
        return { word: prev.word, loading: false, translation: "", error: "No se pudo traducir ahora mismo.", ts: prev.ts };
      });
    }
  }, []);

  var readingSentences = React.useMemo(function () {
    var chunks = String(readingTargetText || "").match(/[^.!?…\n]+[.!?…]?/g) || [];
    return chunks.map(function (x) { return x.replace(/\s+/g, " ").trim(); }).filter(Boolean);
  }, [readingTargetText]);

  var speakReadingSentenceWithWord = React.useCallback(function (rawWord) {
    var pickedSnippet = String(readingSelectedSnippet || "").replace(/\s+/g, " ").trim();
    if (pickedSnippet) {
      readingSpeakText(pickedSnippet, { rate: 0.92 });
      return;
    }
    var cleanWord = mullerNormalizeGermanWordToken(rawWord);
    if (!cleanWord) {
      if (window.__mullerToast) window.__mullerToast("Selecciona una palabra o una frase.", "info");
      return;
    }
    var sentence = readingSentences.find(function (s) {
      var tokens = mullerReadingTokenizeText(s);
      return tokens.some(function (t) { return t.word === cleanWord; });
    });
    if (sentence) {
      readingSpeakText(sentence, { rate: 0.92 });
      return;
    }
    readingSpeakText(cleanWord, { rate: 0.92 });
  }, [readingSelectedSnippet, readingSentences, readingSpeakText]);

  var readingCaptureCurrentSelection = React.useCallback(function () {
    try {
      if (typeof window === "undefined" || typeof window.getSelection !== "function") return;
      var host = readingTextSurfaceRef.current;
      if (!host) return;
      var sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      var anchorNode = sel.anchorNode;
      var focusNode = sel.focusNode;
      if ((anchorNode && !host.contains(anchorNode)) || (focusNode && !host.contains(focusNode))) return;
      var raw = String(sel.toString() || "");
      var text = raw.replace(/\s+/g, " ").trim();
      if (!text || text.length < 2) return;
      setReadingSelectedSnippet(text);
    } catch (e) {}
  }, []);

  var readingTipForWord = function (w) {
    var x = String(w || "").toLowerCase();
    if (/[äöü]/.test(x)) return "Atención a umlauts: ä (tipo e abierta), ö (o redondeada), ü (i con labios redondos).";
    if (x.includes("sch")) return 'sch suena como "sh".';
    if (x.includes("ch")) return 'ch no suena como "ch" español; en alemán suele ser más suave/gutural.';
    if (x.includes("ei")) return 'ei suena parecido a "ai".';
    if (x.includes("ie")) return "ie suena como i larga.";
    if (x.includes("eu") || x.includes("äu")) return 'eu/äu suena parecido a "oi".';
    if (x.includes("z")) return 'z suena como "ts".';
    if (x.includes("v")) return "En alemán muchas veces v suena como \"f\".";
    return "Repite lento por sílabas, luego a velocidad normal.";
  };

  var runReadingCompare = function (targetText, transcript) {
    var a = normalizeGermanSpeechText(targetText || "");
    var b = normalizeGermanSpeechText(transcript || "");
    if (!a || !b) { setReadingScore(null); setReadingFeedback([]); return; }
    var aw = a.split(/\s+/).filter(Boolean);
    var bw = b.split(/\s+/).filter(Boolean);
    var feedback = matchGermanWordsSequential(aw, bw);
    var ok = feedback.filter(function (f) { return f.correct; }).length;
    var pct = aw.length ? Math.round((ok / aw.length) * 100) : 0;
    var enriched = feedback.filter(function (f) { return !f.correct; }).slice(0, 18).map(function (f) { return { word: f.word, correct: f.correct, tip: readingTipForWord(f.word) }; });
    setReadingScore(pct);
    setReadingFeedback(enriched);
  };

  var finalizeReadingSession = React.useCallback(function () {
    var finalText = collapseStutterRepeats((readingFinalRef.current || readingLiveTranscriptRef.current || "").trim());
    setReadingTranscript(finalText);
    runReadingCompare(readingTargetText, finalText);
  }, [readingTargetText]);

  var startReadingListen = async function () {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Para lectura en voz alta usa Chrome o Edge."); return; }
    var ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
    if (!ok) return;
    try { if (readingRecRef.current) readingRecRef.current.stop(); } catch (e) {}
    if (readingRestartTimerRef.current) {
      window.clearTimeout(readingRestartTimerRef.current);
      readingRestartTimerRef.current = null;
    }
    readingStopRequestedRef.current = false;
    readingAutoRestartRef.current = true;
    var sessionId = Date.now();
    readingSessionIdRef.current = sessionId;
    readingFinalRef.current = "";
    readingLiveTranscriptRef.current = "";
    setReadingTranscript("");
    setReadingScore(null);
    setReadingFeedback([]);

    var startCycle = function () {
      if (readingSessionIdRef.current !== sessionId) return;
      if (readingStopRequestedRef.current || !readingAutoRestartRef.current) return;
      var rec = new SpeechRecognition();
      rec.lang = "de-DE";
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.onresult = function (event) {
        if (readingSessionIdRef.current !== sessionId) return;
        var interim = "";
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var r = event.results[i];
          var t = (r[0] && r[0].transcript) ? String(r[0].transcript).trim() : "";
          if (!t) continue;
          if (r.isFinal) readingFinalRef.current = mergeSpeechFinalChunk(readingFinalRef.current, t);
          else interim = t;
        }
        var merged = collapseStutterRepeats((readingFinalRef.current + (interim ? (" " + interim) : "")).trim());
        readingLiveTranscriptRef.current = merged;
        setReadingTranscript(merged);
      };
      rec.onerror = function (evt) {
        if (readingSessionIdRef.current !== sessionId) return;
        var errType = evt && evt.error ? String(evt.error) : "";
        if (errType === "not-allowed" || errType === "service-not-allowed") {
          readingStopRequestedRef.current = true;
          readingAutoRestartRef.current = false;
          setReadingListening(false);
          if (window.__mullerToast) window.__mullerToast("Permiso de micrófono no disponible.", "error");
        }
      };
      rec.onend = function () {
        if (readingSessionIdRef.current !== sessionId) return;
        if (readingRecRef.current === rec) readingRecRef.current = null;
        if (readingStopRequestedRef.current || !readingAutoRestartRef.current) {
          setReadingListening(false);
          finalizeReadingSession();
          return;
        }
        readingRestartTimerRef.current = window.setTimeout(function () { startCycle(); }, 120);
      };
      readingRecRef.current = rec;
      setReadingListening(true);
      try { rec.start(); } catch (e) {
        readingRestartTimerRef.current = window.setTimeout(function () { startCycle(); }, 260);
      }
    };
    startCycle();
  };

  var stopReadingListen = function () {
    readingStopRequestedRef.current = true;
    readingAutoRestartRef.current = false;
    if (readingRestartTimerRef.current) {
      window.clearTimeout(readingRestartTimerRef.current);
      readingRestartTimerRef.current = null;
    }
    var r = readingRecRef.current;
    if (!r) {
      setReadingListening(false);
      finalizeReadingSession();
      return;
    }
    try { r.stop(); } catch (e) {
      setReadingListening(false);
      finalizeReadingSession();
    }
  };

  // ---- efectos ----
  React.useEffect(function () {
    try { localStorage.setItem("muller_reading_font_size", String(readingFontPx)); } catch (e) {}
  }, [readingFontPx]);

  React.useEffect(function () {
    setReadingSelectedSnippet("");
  }, [readingTargetText]);

  // ---- retorno ----
  return {
    readingSource, setReadingSource,
    readingScriptId, setReadingScriptId,
    readingTextInput, setReadingTextInput,
    readingFontPx, setReadingFontPx,
    readingWordInfo, setReadingWordInfo,
    readingFocusMode, setReadingFocusMode,
    readingSelectedSnippet, setReadingSelectedSnippet,
    readingWordAudioBusy, setReadingWordAudioBusy,
    readingListening, setReadingListening,
    readingTranscript, setReadingTranscript,
    readingScore, setReadingScore,
    readingFeedback, setReadingFeedback,
    readingTextSurfaceRef,
    readingTargetText,
    readingProgress,
    readingWordTokens,
    readingScriptOptions,
    readingSelectedWord,
    readingVerbInfo,
    speakReadingWord,
    speakReadingSentenceWithWord,
    runReadingWordLookup,
    startReadingListen,
    stopReadingListen,
    readingCaptureCurrentSelection,
    finalizeReadingSession,
    readingRecRef,
    readingRestartTimerRef,
    readingSessionIdRef,
    readingStopRequestedRef,
    readingAutoRestartRef,
    readingFinalRef,
    readingLiveTranscriptRef
  };
};
