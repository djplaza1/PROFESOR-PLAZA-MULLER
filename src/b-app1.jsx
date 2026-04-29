        function App() {
          const [activeTab, setActiveTab] = useState(() => { try { return localStorage.getItem('muller_active_tab_v1') || 'inicio'; } catch { return 'inicio'; } });
          const [showSplash, setShowSplash] = useState(false); 
          const [splashLogoBlink, setSplashLogoBlink] = useState(false);
          const [rutaSubTab, setRutaSubTab] = useState('camino');
          const [rutaProgress, setRutaProgress] = useState(() => (typeof window.mullerRutaLoad === 'function' ? window.mullerRutaLoad() : { completed: {}, placementDone: false, suggestedLevelIdx: 0, playTimeMs: 0, lessonsCompleted: 0 }));
          const [rutaRun, setRutaRun] = useState(null);
          const [rutaVerbDb, setRutaVerbDb] = useState({ meta: null, verbs: [] });
          const [rutaArticleDb, setRutaArticleDb] = useState([]);
          const [rutaTopicFilter, setRutaTopicFilter] = useState('all');
          // --- NUEVOS ESTADOS PARA TEST ADAPTATIVO (30 PREGUNTAS) ---
const [placementQuestions, setPlacementQuestions] = useState([]);
const [placementAnswers, setPlacementAnswers] = useState([]);
const [placementIndex, setPlacementIndex] = useState(0);
const [placementLevel, setPlacementLevel] = useState('A2');
const [placementScore, setPlacementScore] = useState({ correct: 0, total: 0 });
const [placementFinished, setPlacementFinished] = useState(false);
          const [rutaMentor, setRutaMentor] = useState('lena');
          const [rutaFillInput, setRutaFillInput] = useState('');
          const [rutaSpeakErr, setRutaSpeakErr] = useState('');
          const [celebrationModal, setCelebrationModal] = useState(null);
          const [telcLevel, setTelcLevel] = useState('B1');
          const [diktatMotivationMsg, setDiktatMotivationMsg] = useState('');
          const rutaTabTimerRef = useRef(null);
          const [rutaTranscript, setRutaTranscript] = useState('');
          const [rutaListening, setRutaListening] = useState(false);
          const [rutaTutorTalking, setRutaTutorTalking] = useState(false);
          const [rutaPodcastUI, setRutaPodcastUI] = useState(null);
          const [rutaFillTip, setRutaFillTip] = useState('');
          const rutaPodcastPlaybackRef = useRef({ cancelled: false, line: 0, ex: null });
          var lectura = window.useLecturaState({ guionData: guionData, savedScripts: savedScripts, rutaVerbDb: rutaVerbDb });
          var readingSource = lectura.readingSource;
          var setReadingSource = lectura.setReadingSource;
          var readingScriptId = lectura.readingScriptId;
          var setReadingScriptId = lectura.setReadingScriptId;
          var readingTextInput = lectura.readingTextInput;
          var setReadingTextInput = lectura.setReadingTextInput;
          var readingFontPx = lectura.readingFontPx;
          var setReadingFontPx = lectura.setReadingFontPx;
          var readingWordInfo = lectura.readingWordInfo;
          var setReadingWordInfo = lectura.setReadingWordInfo;
          var readingFocusMode = lectura.readingFocusMode;
          var setReadingFocusMode = lectura.setReadingFocusMode;
          var readingSelectedSnippet = lectura.readingSelectedSnippet;
          var setReadingSelectedSnippet = lectura.setReadingSelectedSnippet;
          var readingWordAudioBusy = lectura.readingWordAudioBusy;
          var setReadingWordAudioBusy = lectura.setReadingWordAudioBusy;
          var readingListening = lectura.readingListening;
          var setReadingListening = lectura.setReadingListening;
          var readingTranscript = lectura.readingTranscript;
          var setReadingTranscript = lectura.setReadingTranscript;
          var readingScore = lectura.readingScore;
          var setReadingScore = lectura.setReadingScore;
          var readingFeedback = lectura.readingFeedback;
          var setReadingFeedback = lectura.setReadingFeedback;
          var readingTextSurfaceRef = lectura.readingTextSurfaceRef;
          var readingTargetText = lectura.readingTargetText;
          var readingProgress = lectura.readingProgress;
          var readingWordTokens = lectura.readingWordTokens;
          var readingScriptOptions = lectura.readingScriptOptions;
          var readingSelectedWord = lectura.readingSelectedWord;
          var readingVerbInfo = lectura.readingVerbInfo;
          var speakReadingWord = lectura.speakReadingWord;
          var speakReadingSentenceWithWord = lectura.speakReadingSentenceWithWord;
          var runReadingWordLookup = lectura.runReadingWordLookup;
          var startReadingListen = lectura.startReadingListen;
          var stopReadingListen = lectura.stopReadingListen;
          var readingCaptureCurrentSelection = lectura.readingCaptureCurrentSelection;
          var finalizeReadingSession = lectura.finalizeReadingSession;
          var readingRecRef = lectura.readingRecRef;
          var readingRestartTimerRef = lectura.readingRestartTimerRef;
          var readingSessionIdRef = lectura.readingSessionIdRef;
          var readingStopRequestedRef = lectura.readingStopRequestedRef;
          var readingAutoRestartRef = lectura.readingAutoRestartRef;
          var readingFinalRef = lectura.readingFinalRef;
          var readingLiveTranscriptRef = lectura.readingLiveTranscriptRef;
          const getWeeklyChartBars = () => {
              const raw = [];
              for (let i = 6; i >= 0; i--) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const key = d.toISOString().slice(0, 10);
                  raw.push((userStats.activityByDay && userStats.activityByDay[key]) || 0);
              }
              const maxVal = Math.max(...raw, 1);
              const normalized = raw.map((h) => Math.max(5, Math.round((h / maxVal) * 100)));
              const hasReal = raw.some((x) => x > 0);
              if (!hasReal && userStats.activityLog && userStats.activityLog.length >= 7) {
                  return userStats.activityLog.slice(-7).map((v) => Math.max(5, Math.min(100, v)));
              }
              return normalized;
          };

          useEffect(() => {
              if (activeTab !== 'progreso') return;
              const refreshMuller = () => {
                  try {
                      if (typeof getAdvancedDashboard === 'function') setMullerProgresoSnapshot(getAdvancedDashboard());
                  } catch (e) { setMullerProgresoSnapshot(null); }
              };
              refreshMuller();
              window.addEventListener('advancedProgressUpdated', refreshMuller);
              return () => window.removeEventListener('advancedProgressUpdated', refreshMuller);
          }, [activeTab]);

          useEffect(() => {
              if (activeTab !== 'vocabulario') {
                  const allVocab = [];
                  guionData.forEach(scene => { if (scene.vocab) scene.vocab.forEach(v => { if (!allVocab.some(existing => existing.de === v.de)) allVocab.push(v); }); });
                  setCurrentVocabList(mullerSortVocabBySrs(allVocab, mullerGetVocabSrsMap())); setVocabReviewIndex(0); setShowVocabTranslation(false);
              }
          }, [guionData, activeTab]);

          useEffect(() => {
              let cancelled = false;
              fetch('./b1-b2-database.json', { cache: 'no-cache' })
                  .then((r) => { if (!r.ok) throw new Error('bx'); return r.json(); })
                  .then((data) => {
                      if (cancelled) return;
                      const n = normalizeBxPayload(data);
                      setBxRemoteDatabases(n);
                      try { sessionStorage.setItem('muller_b1b2_json_v1', JSON.stringify(data)); } catch (e) {}
                  })
                  .catch(() => {
                      if (cancelled) return;
                      setBxRemoteDatabases((prev) => prev || BX_DB_FALLBACK);
                  });
              return () => { cancelled = true; };
          }, []);

          useEffect(() => {
              const pack = bxEffectiveDatabases;
              const dbToUse = bxBankLevel === 'b1' ? pack.b1 : pack.b2;
              let newList;
              if (bxCategory === 'mix') {
                  newList = [];
                  Object.values(dbToUse).forEach((arr) => { newList = newList.concat(arr); });
                  newList.sort(() => Math.random() - 0.5);
              } else {
                  newList = dbToUse[bxCategory] || [];
              }
              setBxCurrentList(newList);
              const catTabChanged = !bxCatTabRef.current || bxCatTabRef.current.c !== bxCategory || bxCatTabRef.current.t !== activeTab;
              bxCatTabRef.current = { c: bxCategory, t: activeTab };
              if (catTabChanged) setBxIndex(0);
              else setBxIndex((i) => (newList.length === 0 ? 0 : Math.min(i, newList.length - 1)));
          }, [bxCategory, activeTab, bxEffectiveDatabases]);

          useEffect(() => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              const src = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!src) return;
              const others = Object.keys(BX_DB_EMPTY).filter((c) => c !== src);
              setBxMoveTargetCat((prev) => (others.includes(prev) ? prev : others[0] || 'vocabulario'));
          }, [bxIndex, bxCategory, bxCurrentList, bxUserOverlay, activeTab]);

          useEffect(() => {
            const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
            if (!synth) return undefined;
            const handleVoicesChanged = () => setVoicesLoaded(true);
            try {
                if (typeof synth.getVoices === 'function' && synth.getVoices().length > 0) setVoicesLoaded(true);
            } catch (e) {}
            if (typeof synth.addEventListener === 'function') {
                synth.addEventListener('voiceschanged', handleVoicesChanged);
                return () => {
                    try { synth.removeEventListener('voiceschanged', handleVoicesChanged); } catch (e) {}
                };
            }
            const previous = synth.onvoiceschanged;
            synth.onvoiceschanged = handleVoicesChanged;
            return () => {
                try {
                    if (synth.onvoiceschanged === handleVoicesChanged) synth.onvoiceschanged = previous || null;
                } catch (e) {}
            };
          }, []);

          const updateTempusVerbList = (text) => {
              if (!tempusMode || !text) { setTempusVerbList([]); return; }
              const words = text.split(/\s+/);
              const foundVerbs = [];
              const processed = new Set();
              words.forEach(word => {
                  const cleanWord = word.toLowerCase().replace(/[.,!?;:()]/g, '');
                  if (TEMPUS_DICT[cleanWord]) {
                      if (!processed.has(cleanWord)) { foundVerbs.push({ infinitive: cleanWord, forms: TEMPUS_DICT[cleanWord] }); processed.add(cleanWord); }
                  } else if (cleanWord.match(/^(?:[a-zÃ¤Ã¶Ã¼ÃŸ]+)(?:en|eln|ern)$/i) && cleanWord.length > 3) {
                      const infinitive = cleanWord;
                      if (!processed.has(infinitive)) {
                          const base = infinitive.slice(0, -2);
                          const praet = base + 'te';
                          const perf = 'hat ' + infinitive;
                          foundVerbs.push({ infinitive, forms: `PrÃ¤t: ${praet} | Perf: ${perf} (regular estimado)` });
                          processed.add(infinitive);
                      }
                  }
              });
              setTempusVerbList(foundVerbs);
          };

          function resolveTempusVerbInfo(rawWord) {
              const clean = String(rawWord || '').toLowerCase().replace(/[.,!?;:()"]/g, '').trim();
              if (!clean) return null;
              if (TEMPUS_DICT[clean]) {
                  const forms = TEMPUS_DICT[clean];
                  const isInf = /(?:en|eln|ern)$/.test(clean);
                  let infinitive = clean;
                  if (!isInf) {
                      const alt = Object.keys(TEMPUS_DICT).find((k) => TEMPUS_DICT[k] === forms && /(?:en|eln|ern)$/.test(k));
                      if (alt) infinitive = alt;
                  }
                  return { touched: clean, infinitive, forms };
              }
              if (/(?:en|eln|ern)$/.test(clean) && clean.length > 3) {
                  const base = clean.slice(0, -2);
                  return { touched: clean, infinitive: clean, forms: `PrÃ¤t: ${base}te | Perf: hat ${clean} (regular estimado)` };
              }
              return null;
          }

          function inferTempusContextLabel(word) {
              const w = String(word || '').toLowerCase();
              if (!w) return '';
              if (w.startsWith('ge') && (w.endsWith('t') || w.endsWith('en'))) return 'Forma probable: Partizip II (Perfekt/Plusquamperfekt).';
              if (/(te|test|ten|tet)$/.test(w)) return 'Forma probable: PrÃ¤teritum (regular).';
              if (/(st|t|en)$/.test(w)) return 'Forma probable: PrÃ¤sens (segÃºn contexto/persona).';
              return 'Tiempo/persona: revisa contexto de la frase.';
          }

          useEffect(() => {
              const actualIdx = getActualSceneIndex();
              const currentScene = guionData[actualIdx];
              if (currentScene && tempusMode) updateTempusVerbList(currentScene.text);
              else setTempusVerbList([]);
          }, [sceneIndex, isReviewing, tempusMode, guionData]);
          useEffect(() => {
              if (!tempusMode) setTempusSelectedVerb(null);
          }, [tempusMode, sceneIndex, isReviewing]);

          const getVoice = (lang, gender, isOlder = false) => {
            const allVoices = window.speechSynthesis.getVoices();
            if (lang === 'de' && window.__mullerResolveVoice) {
                const pref = window.__mullerResolveVoice('muller_tts_de');
                if (pref) return pref;
            }
            if (lang === 'es' && window.__mullerResolveVoice) {
                const pref = window.__mullerResolveVoice('muller_tts_es');
                if (pref) return pref;
            }
            const langVoices = allVoices.filter(v => v.lang.startsWith(lang));
            if (langVoices.length === 0) return allVoices[0]; 
            const femaleVoices = langVoices.filter(v => /female|woman|Katja|Marlene|Vicki/i.test(v.name));
            const maleVoices = langVoices.filter(v => /male|man|Stefan|Conrad|Klaus/i.test(v.name));
            if (gender === 'female') return femaleVoices.length > 0 ? femaleVoices[0] : langVoices[0];
            if (gender === 'male') {
                if (isOlder && maleVoices.length > 1) return maleVoices[1];
                if (maleVoices.length > 0) return maleVoices[0];
                return langVoices[langVoices.length - 1]; 
            }
            return langVoices[0];
          };

          const speakRutaDe = (text, opts = {}) => {
              if (!text) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(text);
              u.lang = 'de-DE';
              u.onstart = () => setRutaTutorTalking(true);
              u.onend = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onEnd === 'function') {
                      try { opts.onEnd(); } catch (e) {}
                  }
              };
              u.onerror = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onError === 'function') opts.onError();
              };
              if (typeof window.__mullerApplyPreferredDeVoice === 'function') window.__mullerApplyPreferredDeVoice(u);
              else {
                  u.voice = rutaMentor === 'tom' ? getVoice('de', 'male') : getVoice('de', 'female');
              }
              if (rutaMentor === 'lena') { u.pitch = 1.12; u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92; }
              else if (rutaMentor === 'tom') { u.pitch = 0.88; u.rate = 0.9; }
              else { u.pitch = 1.32; u.rate = 0.96; }
              window.speechSynthesis.speak(u);
          };

          const speakRutaEs = (text, opts = {}) => {
              if (!text) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(text);
              u.lang = 'es-ES';
              u.onstart = () => setRutaTutorTalking(true);
              u.onend = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onEnd === 'function') {
                      try { opts.onEnd(); } catch (e) {}
                  }
              };
              u.onerror = () => {
                  setRutaTutorTalking(false);
                  if (typeof opts.onError === 'function') opts.onError();
              };
              const all = window.speechSynthesis.getVoices();
              const esList = all.filter((v) => (v.lang || '').toLowerCase().startsWith('es'));
              const spain = esList.find((v) => /es[-_]es/i.test(v.lang || '')) || esList.find((v) => /EspaÃ±a|Spain|Castellano/i.test((v.name || '') + (v.lang || ''))) || getVoice('es', 'female');
              u.voice = spain || esList[0] || all[0];
              u.rate = 0.9;
              u.pitch = 1.02;
              window.speechSynthesis.speak(u);
          };

          const clearRutaPodcastPlayback = () => {
              rutaPodcastPlaybackRef.current = { cancelled: true, line: 0, ex: null };
              window.speechSynthesis.cancel();
              setRutaPodcastUI(null);
          };

          const playRutaPodcastLine = () => {
              const ctx = rutaPodcastPlaybackRef.current;
              if (!ctx || !ctx.ex || !ctx.ex.podcast || ctx.cancelled) return;
              const { lines, checkpoints } = ctx.ex.podcast;
              const i = ctx.line;
              if (i >= lines.length) {
                  setRutaPodcastUI({ phase: 'done' });
                  setRutaRun((r) => (r ? { ...r, step: 2 } : r));
                  return;
              }
              const line = lines[i];
              const spoken = line.text;
              speakRutaDe(spoken, {
                  onEnd: () => {
                      if (rutaPodcastPlaybackRef.current.cancelled) return;
                      const next = i + 1;
                      const cp = (checkpoints || []).find((c) => c.afterLineIdx === next);
                      if (cp) {
                          rutaPodcastPlaybackRef.current.line = next;
                          setRutaPodcastUI({ phase: 'question', checkpoint: cp });
                          return;
                      }
                      rutaPodcastPlaybackRef.current.line = next;
                      setRutaPodcastUI({ phase: 'playing', line: next, checkpoint: null });
                      setTimeout(() => playRutaPodcastLine(), 160);
                  }
              });
          };

          const beginRutaPodcastFromExercise = (ex) => {
              if (!ex || !ex.podcast) return;
              rutaPodcastPlaybackRef.current = { cancelled: false, line: 0, ex };
              setRutaRun((r) => (r ? { ...r, podcastHadFailure: false, exerciseAttempts: 0, rutaLastChanceHint: '' } : r));
              setRutaPodcastUI({ phase: 'playing', line: 0, checkpoint: null });
              playRutaPodcastLine();
          };

          const resumeRutaPodcastAfterCheckpoint = () => {
              rutaPodcastPlaybackRef.current.cancelled = false;
              setRutaRun((r) => (r ? { ...r, exerciseAttempts: 0, rutaLastChanceHint: '' } : r));
              setRutaPodcastUI({ phase: 'playing', line: rutaPodcastPlaybackRef.current.line, checkpoint: null });
              setTimeout(() => playRutaPodcastLine(), 120);
          };

          useEffect(() => {
              const ex = rutaRun && Array.isArray(rutaRun.exercisePlan) ? rutaRun.exercisePlan[rutaRun.exerciseIdx || 0] : null;
              if (!ex) {
                  rutaAutoSpeakRef.current = '';
                  setRutaTutorTalking(false);
                  return;
              }
              const isLegacyAudio = (ex.type === 'podcast' || ex.type === 'audio_story') && !ex.podcast;
              const shouldAutoSpeak = (rutaRun.step || 0) === 0 && (ex.type === 'read' || ex.type === 'speak' || ex.type === 'translate_es' || isLegacyAudio);
              if (!shouldAutoSpeak) return;
              const key = `${ex.id}:${rutaRun.step || 0}`;
              if (rutaAutoSpeakRef.current === key) return;
              rutaAutoSpeakRef.current = key;
              const phrase = ex.type === 'speak'
                  ? ex.target
                  : ex.type === 'translate_es'
                      ? (ex.promptDe || '')
                      : isLegacyAudio
                          ? (Array.isArray(ex.transcript) ? ex.transcript.join(' ') : '')
                          : ex.de;
              if (phrase) speakRutaDe(phrase);
          }, [rutaRun && rutaRun.exerciseIdx, rutaRun && rutaRun.step, rutaRun && rutaRun.exercisePlan]);

          const stopAudio = () => { 
              window.speechSynthesis.cancel(); 
              if (timeoutRef.current) clearTimeout(timeoutRef.current); 
              setIsPlaying(false); 
              stopNoise(); // Detener ruido si estÃ¡ activo
          };

          // Funciones para ruido de fondo
          const startNoise = () => {
              if (!noiseEnabled) return;
              try {
                  const AudioContext = window.AudioContext || window.webkitAudioContext;
                  const ctx = new AudioContext();
                  noiseContextRef.current = ctx;
                  const bufferSize = 4096;
                  const noiseNode = ctx.createScriptProcessor(bufferSize, 1, 1);
                  noiseNode.onaudioprocess = (e) => {
                      const output = e.outputBuffer.getChannelData(0);
                      for (let i = 0; i < bufferSize; i++) {
                          output[i] = (Math.random() * 2 - 1) * 0.15; // Ruido blanco a bajo volumen
                      }
                  };
                  const gainNode = ctx.createGain();
                  gainNode.gain.value = 0.08; // Volumen muy bajo
                  noiseGainRef.current = gainNode;
                  noiseNode.connect(gainNode);
                  gainNode.connect(ctx.destination);
                  noiseSourceRef.current = noiseNode;
              } catch(e) { console.warn("No se pudo iniciar ruido de fondo:", e); }
          };

          const stopNoise = () => {
              if (noiseSourceRef.current) {
                  noiseSourceRef.current.disconnect();
                  noiseSourceRef.current = null;
              }
              if (noiseContextRef.current) {
                  noiseContextRef.current.close();
                  noiseContextRef.current = null;
              }
          };

          useEffect(() => {
              if (noiseEnabled && isPlaying) startNoise();
              else stopNoise();
              return () => stopNoise();
          }, [noiseEnabled, isPlaying]);

          const resetModes = () => { 
              setDiktatInput(""); setShowDiktatResult(false); 
              setSpokenText(""); setPronunciationScore(null); setGrammarPolizeiMsg(""); setPronunciationFeedback([]);
              setShowPuzzleResult(false); setPuzzleLastOk(null); setShowCurrentTranslation(false); 
              initPuzzle(guionData[getActualSceneIndex()]?.text || ""); 
          };
          
          const getActualSceneIndex = () => isReviewing ? userStats.failedDiktatScenes[reviewIndexPointer] : sceneIndex;

          const getNextPlaylistScript = () => {
              if (!savedScripts || savedScripts.length === 0) return null;
              if (isDefaultScript) return savedScripts[0];
              const i = savedScripts.findIndex((s) => String(s.id) === String(activeSavedScriptId));
              if (i < 0) return savedScripts[0];
              if (i + 1 < savedScripts.length) return savedScripts[i + 1];
              return null;
          };

          const proceedToNextStage = () => {
              if (isReviewing) {
                  if (reviewIndexPointer < userStats.failedDiktatScenes.length - 1) { setReviewIndexPointer(p => p + 1); setMode('dialogue'); resetModes(); } 
                  else { saveProgress({ failedDiktatScenes: [] }); setIsReviewing(false); stopAudio(); }
              } else {
                  if (sceneIndex < guionData.length - 1) { setSceneIndex(s => s + 1); setMode('dialogue'); resetModes(); } 
                  else {
                      if (historiaPlaylistAllScripts && !isReviewing) {
                          const nextScr = getNextPlaylistScript();
                          if (nextScr) {
                              loadSavedScript(nextScr);
                              return;
                          }
                      }
                      if (userStats.failedDiktatScenes.length > 0) {
                          alert("Â¡Historia terminada! Tienes fallos pendientes en Diktat. Iniciando Repaso.");
                          setIsReviewing(true); setReviewIndexPointer(0); setMode('dialogue'); resetModes();
                      } else {
                          stopAudio();
                          if (historiaPlaylistAllScripts && savedScripts.length > 0) {
                              alert('Â¡Has escuchado todos los guiones guardados en secuencia!');
                          } else {
                              alert("Â¡Has completado el guion!");
                          }
                      }
                  }
              }
          };

          const handleNext = () => { stopAudio(); proceedToNextStage(); };
          const handlePrev = () => { stopAudio(); if (!isReviewing && sceneIndex > 0) { setSceneIndex(s => s - 1); setMode('dialogue'); resetModes(); } };
          const togglePlay = () => { 
              if (userStats.hearts <= 0) { setShowDeathModal(true); return; }
              if (isPlaying) stopAudio(); else setIsPlaying(true); 
          };

          const initPuzzle = (text) => {
              if (!text) return;
              const words = text.split(/\s+/).map((w, i) => ({ id: i, text: w }));
              setPuzzleWords(words.sort(() => Math.random() - 0.5)); setPuzzleAnswer([]);
          };

          useEffect(() => { if (puzzleMode && activeTab === 'historia') initPuzzle(guionData[getActualSceneIndex()]?.text); }, [sceneIndex, isReviewing, puzzleMode, guionData, activeTab]);

          const handleSaveCustomVocab = () => {
              if (!vocabTitleInput.trim()) { alert("Por favor, dale un tÃ­tulo a la lecciÃ³n."); return; }
              if (!vocabTextInput.trim()) { alert("Por favor, pega el vocabulario."); return; }
              const lines = vocabTextInput.split(/\r?\n/);
              let parsedWords = [];
              const cleanStr = (str) => {
                  let s = str.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, ''); 
                  s = s.replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, ''); 
                  return s.trim();
              };
              lines.forEach(line => {
                  let text = line.trim().replace(/â€“/g, '-').replace(/â€”/g, '-');
                  if (!text) return;
                  let isDiff = false;
                  if (text.startsWith('1')) { isDiff = true; text = text.replace(/^1[.\-):\]]*\s*/, '').trim(); }
                  text = text.replace(/^[-*â¬¢+>]\s*/, '').trim();
                  text = text.replace(/^\d+[.\-):\]]+\s*/, '').trim();
                  let de = ""; let es = "";
                  const match = text.match(/(\s+-\s+|\s+=\s+|\t|\s{2,}|={1,})/);
                  if (match) {
                      const sepIndex = text.indexOf(match[0]);
                      de = cleanStr(text.substring(0, sepIndex));
                      es = cleanStr(text.substring(sepIndex + match[0].length));
                  } else {
                      const hyphenMatch = text.match(/(^|\s)-(?!\w)|(?<!\w)-(\s|$)/);
                      if (hyphenMatch) {
                          const sepIndex = text.indexOf(hyphenMatch[0]);
                          de = cleanStr(text.substring(0, sepIndex));
                          es = cleanStr(text.substring(sepIndex + hyphenMatch[0].length));
                      } else {
                          let words = text.split(' ');
                          let splitPoint = 1;
                          if (words.length > 2 && /^(sich|der|die|das|ein|eine)$/i.test(words[0])) splitPoint = 2;
                          if (words.length > splitPoint && words[splitPoint].startsWith('(')) splitPoint++;
                          de = cleanStr(words.slice(0, splitPoint).join(' '));
                          es = cleanStr(words.slice(splitPoint).join(' '));
                          if (!es) es = "???";
                      }
                  }
                  de = de.replace(/^1[.\-):\]]*\s*/, '').trim();
                  es = es.replace(/^1[.\-):\]]*\s*/, '').trim();
                  if (de) parsedWords.push({ de, es, diff: isDiff ? 1 : 0 });
              });
              if (parsedWords.length > 0) {
                  const newLesson = { id: Date.now().toString() + Math.random().toString(36).substring(7), title: vocabTitleInput, words: parsedWords };
                  const updatedLessons = [...customVocabLessons, newLesson];
                  setCustomVocabLessons(updatedLessons);
                  localStorage.setItem('mullerCustomVocab', JSON.stringify(updatedLessons));
                  setVocabTitleInput(""); setVocabTextInput("");
                  alert(`Â¡Genial! Se ha guardado la lecciÃ³n "${vocabTitleInput}" con ${parsedWords.length} palabras.`);
              } else { alert("No pude detectar vocabulario vÃ¡lido. Pega texto para guardar."); }
          };

  const handleSaveScript = () => {
    if (!newScriptTitle.trim()) { alert("Dale un tÃ­tulo al guion primero."); return; }
    try {
        const lines = scriptInput.split('\n');
        const newGuion = [];
        lines.forEach(line => {
            let cleanLine = line.trim();
            if (!cleanLine) return;

            // 1. Extraer Hablante (Nombre:)
            const speakerMatch = cleanLine.match(/^([^:]+):/);
            if (!speakerMatch) return;
            const speaker = speakerMatch[1].trim();
            let content = cleanLine.substring(speakerMatch[0].length).trim();

            // 2. Extraer Redemittel [R]
            let isRedemittel = false;
            if (content.includes('[R]')) {
                isRedemittel = true;
                content = content.replace('[R]', '').trim();
            }

            // 3. Extraer Vocabulario [...]
            let vocab = [];
            const vocabMatch = content.match(/\[(.*?)\]/);
            if (vocabMatch) {
                const vocabPairs = vocabMatch[1].split(',');
                vocabPairs.forEach(pair => {
                    const parts = pair.split('-');
                    if (parts.length >= 2) {
                        const cleanDe = parts[0].trim().replace(/[ðŸ”´ðŸ”µðŸŸ¢â€¢]/g, '');
                        vocab.push({ de: cleanDe, es: parts[1].trim(), diff: 1 });
                    }
                });
                content = content.replace(vocabMatch[0], '').trim();
            }

            // 4. Extraer TraducciÃ³n (...)
            let translation = "TraducciÃ³n no proporcionada";
            const transMatch = content.match(/\(([^)]+)\)/);
            if (transMatch) {
                translation = transMatch[1].trim();
                content = content.replace(transMatch[0], '').trim();
            }

            // 5. AlemÃ¡n (limpio de cÃ­rculos para el audio)
            const germanText = content.replace(/[ðŸ”´ðŸ”µðŸŸ¢]/g, '').trim();

            if (germanText) {
                newGuion.push({ speaker, text: germanText, translation, isRedemittel, vocab });
            }
        });

        if (newGuion.length === 0) throw new Error("Formato no reconocido");

        const scriptObj = { id: Date.now().toString(), title: newScriptTitle, data: JSON.stringify(newGuion), timestamp: Date.now() };
        const newSaved = [...savedScripts, scriptObj].sort((a,b)=>a.title.localeCompare(b.title));
        setSavedScripts(newSaved);
        localStorage.setItem('mullerScripts', JSON.stringify(newSaved));
        try {
            if (typeof caches !== 'undefined') {
                const meta = { lastScriptTitle: newScriptTitle, lastSceneCount: newGuion.length, savedAt: new Date().toISOString() };
                caches.open('muller-offline-user-v1').then((cache) => cache.put(
                    new Request(new URL('./.muller-offline-meta.json', window.location.href).toString()),
                    new Response(JSON.stringify(meta), { headers: { 'Content-Type': 'application/json' } })
                )).catch(function () {});
            }
        } catch (e) {}
        setGuionData(newGuion); setActiveScriptTitle(newScriptTitle); setIsDefaultScript(false);
        setActiveSavedScriptId(String(scriptObj.id));
        setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false);
        setNewScriptTitle(""); setActiveTab('historia');
    } catch (e) { 
        alert("Error al procesar. AsegÃºrate de usar el formato: Nombre: Texto AlemÃ¡n. (TraducciÃ³n) [vocab-trad]"); 
    }
};

          const handleBxDistribToLevels = (target) => {
              const text = (bxImportText || '').trim() || (scriptInput || '').trim();
              if (!text) { alert('Pega texto en el cuadro de â€œDistribuir a B1/B2â€ o en el guion de arriba.'); return; }
              const flat = mullerBibliotecaFlatItems(text);
              if (flat.length === 0) { alert('No se detectaron frases. Usa formato Nombre: AlemÃ¡n. (TraducciÃ³n) o listas â€œalemÃ¡n - espaÃ±olâ€ por lÃ­nea.'); return; }
              const z = () => ({ vocabulario: 0, verbos: 0, preposiciones: 0, conectores: 0, redemittel: 0 });
              let snap = null;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  const c1 = z();
                  const c2 = z();
                  let nuevos = 0;
                  flat.forEach(({ cat, item, seg }) => {
                      const lv = target === 'auto' ? mullerGuessBibliotecaItemLevel(item, seg) : target;
                      const trickBase = 'Biblioteca Â· ' + cat + (target === 'auto' ? ' Â· nivel estimado ' + lv.toUpperCase() : ' Â· heurÃ­stica local (sin IA)');
                      const it = { ...item, trick: trickBase };
                      const ky = mullerBxItemKey(item);
                      const exists = (base[lv][cat] || []).some((x) => mullerBxItemKey(x) === ky);
                      if (exists) return;
                      base[lv][cat].push({
                          ...it,
                          _mullerUser: true,
                          _mullerUid: 'bx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11),
                          _mullerCategory: cat,
                          ...(activeSavedScriptId ? { _mullerSourceScriptId: String(activeSavedScriptId) } : {})
                      });
                      if (lv === 'b2') c2[cat]++; else c1[cat]++;
                      nuevos++;
                  });
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  snap = { c1, c2, nuevos, target, detectados: flat.length };
                  return base;
              });
              const sum = (c) => `vocab ${c.vocabulario}, vb. ${c.verbos}, prep. ${c.preposiciones}, conn. ${c.conectores}, R ${c.redemittel}`;
              if (snap) {
                  if (snap.target === 'auto') {
                      setBxImportSummary(`Nivel automÃ¡tico Â· B1: ${sum(snap.c1)} Â· B2: ${sum(snap.c2)} Â· nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  } else {
                      const c = snap.target === 'b2' ? snap.c2 : snap.c1;
                      setBxImportSummary(`Todo a ${snap.target.toUpperCase()}: ${sum(c)} Â· nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  }
              }
          };

          const clearBxUserOverlay = () => {
              if (!window.confirm('Esto borra solo lo que aÃ±adiste con Â«Distribuir textoÂ» (tu biblioteca local). Las tarjetas del archivo b1-b2-database.json del proyecto no se quitan: seguirÃ¡n viÃ©ndose en B1/B2. Â¿Borrar tus aportaciones?')) return;
              const empty = normalizeBxPayload({});
              setBxUserOverlay(empty);
              try {
                  localStorage.removeItem(MULLER_BX_USER_OVERLAY_KEY);
                  localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(empty));
              } catch (e) {}
              setBxImportSummary('');
              setBxIndex(0);
          };

          const clearBxUserLevelAllCategories = (levelKey) => {
              const lab = levelKey === 'b1' ? 'B1' : 'B2';
              if (!window.confirm(`Â¿Seguro? Se borrarÃ¡n TODAS tus aportaciones en ${lab} (vocabulario, verbos, preposiciones, conectores y Redemittel). No se toca el archivo b1-b2-database.json.`)) return;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  Object.keys(BX_DB_EMPTY).forEach((cat) => { base[levelKey][cat] = []; });
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxIndex(0);
          };

          const clearBxUserOneCategory = (levelKey, catKey) => {
              const lab = levelKey === 'b1' ? 'B1' : 'B2';
              const name = { vocabulario: 'Vocabulario', verbos: 'Verbos', preposiciones: 'Preposiciones', conectores: 'Conectores', redemittel: 'Redemittel' }[catKey] || catKey;
              if (!window.confirm(`Â¿Seguro? Se borran solo tus aportaciones en Â«${name}Â» (${lab}). El resto de categorÃ­as y el JSON base no se tocan.`)) return;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  base[levelKey][catKey] = [];
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxIndex(0);
          };

          const mullerTranslateGtxFull = async (text, sl, tl) => {
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
              const r = await fetch(url);
              if (!r.ok) throw new Error('gtx');
              const data = await r.json();
              let out = '';
              if (data && data[0]) data[0].forEach((p) => { if (p && p[0]) out += p[0]; });
              const detected = data && data[2] != null ? String(data[2]) : '';
              return { text: out.trim(), detected };
          };

          const mullerTranslateViaGtx = async (text, sl, tl) => {
              const { text: out } = await mullerTranslateGtxFull(text, sl, tl);
              return out;
          };

          const mullerTranslateViaMyMemory = async (text, pair) => {
              const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`);
              const j = await r.json();
              const st = j && j.responseStatus;
              if (!r.ok || (st != null && Number(st) !== 200 && st !== '200')) throw new Error('mm');
              return String((j.responseData && j.responseData.translatedText) || '').trim();
          };

        const mullerStoryClean = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s([,.;:!?])/g, '$1').trim();
        const mullerStorySimplifyGerman = (txt) => {
            return String(txt || '')
                .replace(/\bjedoch\b/gi, 'aber')
                .replace(/\bdennoch\b/gi, 'trotzdem')
                .replace(/\baufgrund\b/gi, 'wegen')
                .replace(/\bbeziehungsweise\b/gi, 'oder')
                .replace(/\bauÃŸerdem\b/gi, 'auch')
                .replace(/\binsbesondere\b/gi, 'vor allem')
                .replace(/\ballerdings\b/gi, 'aber')
                .replace(/\bdaher\b/gi, 'deshalb');
        };
        const mullerStoryStylizeGerman = (txt, level, tone) => {
            let out = mullerStoryClean(txt);
            if (!out) return '';
            if (tone === 'natural') out = out.replace(/\s,\s/g, ', ');
            if (tone === 'formal') {
                out = out
                    .replace(/\bich\b/g, 'Ich')
                    .replace(/\bwir\b/g, 'Wir')
                    .replace(/\bman\b/g, 'man');
            }
            if (level === 'A2') out = mullerStorySimplifyGerman(out);
            if (level === 'B1') out = mullerStorySimplifyGerman(out).replace(/\bwelche[rnms]?\b/gi, 'die');
            return out;
        };
        const mullerStorySplitScenes = (deText, esText) => {
            const deParts = String(deText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const esParts = String(esText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const out = deParts.slice(0, 14).map((line, i) => ({
                speaker: i % 2 === 0 ? 'Lukas' : 'Elena',
                text: line,
                translation: esParts[i] || ''
            }));
            return out.length ? out : [{ speaker: 'Lukas', text: mullerStoryClean(deText), translation: mullerStoryClean(esText) }];
        };
        const mullerStoryGlossary = (deText) => {
            const words = String(deText || '')
                .toLowerCase()
                .replace(/[^a-zÃ¤Ã¶Ã¼ÃŸ\s-]/gi, ' ')
                .split(/\s+/)
                .map((w) => w.trim())
                .filter((w) => w.length >= 6 && !/^\d+$/.test(w));
            const unique = Array.from(new Set(words)).slice(0, 10);
            return unique.map((w) => ({ de: w, es: '(revÃ­salo en Lexikon)' }));
        };

          const mullerLexikonApplyPairsFromTranslate = (sourceText, translated, detectedLang, targetLang) => {
              const d = String(detectedLang || '').toLowerCase();
              const t = String(targetLang || '').toLowerCase();
              const outClean = String(translated || '').replace(/^\(sin resultado\)$/, '');
              const src = String(sourceText || '').trim();
              if (!outClean) return;
              if (t === 'de') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              } else if (t === 'es') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              }
          };

          const runLexikonDictionarySearch = async () => {
              const q = lexikonSearch.trim();
              if (!q) { alert('Escribe una palabra o inicio de palabra.'); return; }
              setLexikonDictLoading(true);
              setLexikonResults(null);
              try {
                  if (lexikonDictKind === 'tr-es-de' || lexikonDictKind === 'tr-de-es') {
                      const tl = lexikonDictKind === 'tr-es-de' ? 'de' : 'es';
                      let out = '';
                      let detected = '';
                      const r = await mullerTranslateGtxFull(q, 'auto', tl);
                      out = r.text;
                      detected = r.detected;
                      if (!out) {
                          try {
                              out = await mullerTranslateViaMyMemory(q, tl === 'de' ? 'es|de' : 'de|es');
                          } catch (eM) { /* ignore */ }
                      }
                      setLexikonResults({ dictTranslate: true, query: q, out: out || '', detected, tl, error: false });
                  } else {
                      const wiki = lexikonDictKind === 'wiki-es' ? 'es' : 'de';
                      const url = `https://${wiki}.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=14&namespace=0&format=json&origin=*`;
                      const r = await fetch(url);
                      if (!r.ok) throw new Error('wiki');
                      const data = await r.json();
                      setLexikonResults({ titles: data[1] || [], descriptions: data[2] || [], urls: data[3] || [], wiki });
                  }
              } catch (e) {
                  alert('No se pudo completar la bÃºsqueda (red o bloqueo). Prueba otra vez.');
                  setLexikonResults({ error: true });
              } finally {
                  setLexikonDictLoading(false);
              }
          };

          const runLexikonTranslate = async () => {
              const text = lexikonTransText.trim();
              if (!text) { alert('Escribe un texto o frase.'); return; }
              setLexikonTransLoading(true);
              setLexikonTransOut('');
              const tl = lexikonTransTarget === 'es' ? 'es' : 'de';
              try {
                  const { text: outRaw, detected } = await mullerTranslateGtxFull(text, 'auto', tl);
                  let out = outRaw;
                  if (!out) {
                      try {
                          out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'es|de' : 'de|es');
                      } catch (eM) { /* ignore */ }
                  }
                  const finalOut = out || '(sin resultado)';
                  setLexikonTransOut(finalOut);
                  mullerLexikonApplyPairsFromTranslate(text, finalOut, detected, tl);
              } catch (e1) {
                  try {
                      let out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'es|de' : 'de|es');
                      if (!out) out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'de|es' : 'es|de');
                      const finalOut = out || '(sin resultado)';
                      setLexikonTransOut(finalOut);
                      mullerLexikonApplyPairsFromTranslate(text, finalOut, tl === 'de' ? 'es' : 'de', tl);
                  } catch (e2) {
                      setLexikonTransOut('Error de traducciÃ³n. Comprueba la conexiÃ³n.');
                  }
              } finally {
                  setLexikonTransLoading(false);
              }
          };

          const runHistoriasProOcr = async (file) => {
              if (!file) return;
              if (typeof Tesseract === 'undefined') {
                  setStoriesProErr('No se pudo cargar OCR (Tesseract).');
                  return;
              }
              setStoriesProErr('');
              setStoriesProBusy(true);
              try {
                  const worker = await Tesseract.createWorker(storiesProOcrLang === 'de' ? 'deu' : 'spa', 1);
                  const { data: { text } } = await worker.recognize(file);
                  await worker.terminate();
                  const cleaned = mullerStoryClean(text);
                  setStoriesProSourceText(cleaned);
                  setStoriesProInputMode(storiesProOcrLang === 'de' ? 'de' : 'es');
              } catch (err) {
                  setStoriesProErr(err && err.message ? err.message : 'Error leyendo OCR');
              } finally {
                  setStoriesProBusy(false);
              }
          };

          const runHistoriasProGenerate = async () => {
              const src = mullerStoryClean(storiesProSourceText);
              if (!src) {
                  setStoriesProErr('Escribe o carga un texto antes de generar.');
                  return;
              }
              setStoriesProBusy(true);
              setStoriesProErr('');
              try {
                  let deNatural = '';
                  let esBase = '';
                  if (storiesProInputMode === 'es') {
                      esBase = src;
                      deNatural = await mullerTranslateViaGtx(src, 'auto', 'de');
                  } else {
                      deNatural = src;
                      esBase = await mullerTranslateViaGtx(src, 'auto', 'es');
                  }
                  deNatural = mullerStoryStylizeGerman(deNatural, storiesProLevel, storiesProTone);
                  const deSimple = mullerStorySimplifyGerman(deNatural);
                  const scenes = mullerStorySplitScenes(deNatural, esBase);
                  const glossary = mullerStoryGlossary(deNatural);
                  setStoriesProResult({
                      deNatural,
                      deSimple,
                      esBase,
                      scenes,
                      glossary,
                      mode: storiesProInputMode === 'de' ? 'correccion' : 'conversion'
                  });
              } catch (err) {
                  setStoriesProErr(err && err.message ? err.message : 'No se pudo generar la historia.');
              } finally {
                  setStoriesProBusy(false);
              }
          };

          const sendHistoriasProToHistoria = () => {
              if (!storiesProResult || !Array.isArray(storiesProResult.scenes) || storiesProResult.scenes.length === 0) {
                  setStoriesProErr('Primero genera la historia.');
                  return;
              }
              const title = `Historias Pro Â· ${storiesProLevel} Â· ${new Date().toLocaleDateString()}`;
              setGuionData(storiesProResult.scenes);
              setSceneIndex(0);
              setMode('dialogue');
              setShowCurrentTranslation(false);
              setIsDefaultScript(false);
              setActiveScriptTitle(title);
              setActiveSavedScriptId(null);
              setActiveTab('historia');
              stopAudio();
          };

          const appendPairToCustomLesson = (de, es) => {
              const d = String(de || '').trim();
              const e = String(es || '').trim();
              if (!d || !e) { alert('Falta alemÃ¡n o espaÃ±ol.'); return; }
              let lessonId = lexikonSaveLessonId;
              if (lessonId === '__new__') {
                  const t = (lexikonNewLessonTitle || '').trim() || `Lexikon ${new Date().toLocaleDateString()}`;
                  const newLesson = { id: Date.now().toString() + Math.random().toString(36).slice(2, 9), title: t, words: [{ de: d, es: e, diff: 0 }] };
                  const updated = [...customVocabLessons, newLesson];
                  setCustomVocabLessons(updated);
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(updated)); } catch (err) {}
                  setLexikonSaveLessonId(newLesson.id);
                  setLexikonNewLessonTitle('');
                  alert(`Guardado en nueva lecciÃ³n: Â«${t}Â». Puedes practicarla en Vocab.`);
                  return;
              }
              if (!lessonId) { alert('Elige una lecciÃ³n o Â«Nueva lecciÃ³nâ¬¦Â».'); return; }
              setCustomVocabLessons((prev) => {
                  let hit = false;
                  const next = prev.map((l) => {
                      if (l.id !== lessonId) return l;
                      hit = true;
                      if (l.words.some((w) => w.de === d && w.es === e)) return l;
                      return { ...l, words: [...l.words, { de: d, es: e, diff: 0 }] };
                  });
                  if (!hit) {
                      alert('No se encontrÃ³ esa lecciÃ³n.');
                      return prev;
                  }
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(next)); } catch (err) {}
                  return next;
              });
              alert('Palabra aÃ±adida a la lecciÃ³n.');
          };

          const handleBxUserCardDelete = () => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser || !item._mullerUid) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              let srcCat = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!srcCat) {
                  alert('No se encontrÃ³ la categorÃ­a de esta tarjeta.');
                  return;
              }
              if (!window.confirm('Â¿Eliminar esta tarjeta solo de tu biblioteca local?')) return;
              setBxUserOverlay((prev) => {
                  const base = JSON.parse(JSON.stringify(normalizeBxPayload(prev)));
                  base[level][srcCat] = (base[level][srcCat] || []).filter((x) => x._mullerUid !== item._mullerUid);
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
          };

          const handleBxUserCardMove = () => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser || !item._mullerUid) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              let srcCat = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!srcCat) {
                  alert('No se encontrÃ³ la categorÃ­a de origen.');
                  return;
              }
              const toCat = bxMoveTargetCat;
              if (srcCat === toCat) {
                  alert('Elige otra categorÃ­a distinta.');
                  return;
              }
              setBxUserOverlay((prev) => {
                  const base = JSON.parse(JSON.stringify(normalizeBxPayload(prev)));
                  const fromArr = base[level][srcCat] || [];
                  const fi = fromArr.findIndex((x) => x._mullerUid === item._mullerUid);
                  if (fi === -1) return prev;
                  const moved = { ...fromArr[fi], _mullerCategory: toCat };
                  fromArr.splice(fi, 1);
                  if (!base[level][toCat]) base[level][toCat] = [];
                  base[level][toCat].push(moved);
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
          };

          const fillChromeAiFromScene = () => {
              try {
                  const idx = getActualSceneIndex();
                  const scene = guionData[idx];
                  if (!scene || !scene.text) { alert('No hay texto en la escena actual de Historia.'); return; }
                  const block = [scene.text, scene.translation ? '(' + scene.translation + ')' : ''].filter(Boolean).join('\n');
                  setChromeAiText(block);
                  setChromeAiLine('Texto cargado desde la escena ' + (idx + 1) + '.');
              } catch (e) { alert('No se pudo leer el guion.'); }
          };

          const runChromeLocalSummarize = async () => {
              const text = (chromeAiText || '').trim();
              if (text.length < 40) {
                  alert('Pega un texto mÃ¡s largo o usa â€œCargar escena actualâ€.');
                  return;
              }
              if (!('Summarizer' in self)) {
                  setChromeAiLine('Tu navegador no expone la API Summarizer. Usa Google Chrome 138+ en escritorio con IA integrada (Gemini Nano). En Edge puede ir detrÃ¡s de flags; revisa la documentaciÃ³n de Built-in AI.');
                  setChromeAiOut('');
                  return;
              }
              setChromeAiBusy(true);
              setChromeAiOut('');
              setChromeAiLine('Comprobandoâ¬¦');
              try {
                  const Summarizer = self.Summarizer;
                  const availability = await Summarizer.availability();
                  if (availability === 'unavailable') {
                      setChromeAiLine('Gemini Nano no disponible en este equipo (requisitos de hardware, espacio ~22 GB libres en el perfil de Chrome, o polÃ­tica).');
                      setChromeAiBusy(false);
                      return;
                  }
                  setChromeAiLine('Preparando modelo local (la primera vez puede descargarse)â¬¦');
                  const summarizer = await Summarizer.create({
                      type: 'key-points',
                      format: 'markdown',
                      length: 'short',
                      expectedInputLanguages: ['de', 'en'],
                      outputLanguage: 'es',
                      sharedContext: 'Estudiante de alemÃ¡n TELC; resÃºmenes claros en espaÃ±ol.',
                      monitor(m) {
                          m.addEventListener('downloadprogress', (e) => {
                              const p = typeof e.loaded === 'number' ? Math.round(e.loaded * 100) : 0;
                              setChromeAiLine('Descarga del modelo en tu PCâ¬¦ ' + p + '%');
                          });
                      }
                  });
                  setChromeAiLine('Generando resumen (proceso local)â¬¦');
                  const summary = await summarizer.summarize(text, { context: 'Texto o diÃ¡logo en alemÃ¡n para estudio.' });
                  setChromeAiOut(typeof summary === 'string' ? summary : String(summary));
                  setChromeAiLine('Listo: sin enviar datos a los servidores de MÃ¼ller.');
                  try { if (typeof summarizer.destroy === 'function') summarizer.destroy(); } catch (e2) {}
              } catch (err) {
                  setChromeAiLine('Error: ' + (err && err.message ? err.message : String(err)));
              } finally {
                  setChromeAiBusy(false);
              }
          };

          const loadSavedScript = (script) => {
              setGuionData(JSON.parse(script.data)); setActiveScriptTitle(script.title); setIsDefaultScript(false);
              setActiveSavedScriptId(script && script.id != null ? String(script.id) : null);
              setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false); setActiveTab('historia');
          };

          const loadDefaultGuion = () => {
              try {
                  setGuionData(JSON.parse(JSON.stringify(DEFAULT_GUION)));
              } catch (e) {
                  setGuionData(DEFAULT_GUION);
              }
              setActiveScriptTitle('Lektion 17: Kunst');
              setIsDefaultScript(true);
              setActiveSavedScriptId(null);
              setSceneIndex(0);
              setMode('dialogue');
              stopAudio();
              resetModes();
              setIsReviewing(false);
              setActiveTab('historia');
          };

          const deleteSavedScript = (e, script) => {
              e.preventDefault();
              e.stopPropagation();
              const sid = script && script.id != null ? String(script.id) : '';
              if (!sid) {
                  alert('Este guion no tiene id interno; recarga la pÃ¡gina y prueba de nuevo.');
                  return;
              }
              if (!window.confirm('Â¿Eliminar este guion de la lista?')) return;
              const stripBx = window.confirm(
                  'Â¿Quitar tambiÃ©n de B1/B2 las frases que aÃ±adiste con Â«Distribuir textoÂ» mientras tenÃ­as cargado este guion en Historia?\n\n' +
                  '(Solo afecta a tarjetas nuevas vinculadas a este guion. Las que enviaste antes sin esta vinculaciÃ³n, o el contenido del archivo b1-b2-database.json, no se tocan.)'
              );
              setSavedScripts((prev) => {
                  const next = prev.filter((s) => String(s.id) !== sid);
                  try { localStorage.setItem('mullerScripts', JSON.stringify(next)); } catch (err) {}
                  return next;
              });
              if (stripBx) {
                  setBxUserOverlay((prev) => {
                      const stripped = mullerStripBxOverlayBySourceScriptId(prev, sid);
                      try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(stripped)); } catch (err) {}
                      return stripped;
                  });
                  setBxIndex(0);
                  setBxImportSummary('');
              }
              if (String(activeSavedScriptId) === sid) setActiveSavedScriptId(null);
          };

          const handleGenerateAIStory = () => {
              setIsGeneratingStory(true);
              setTimeout(() => {
                  let wordsArray = aiCustomWords.split(',').map(w => w.trim()).filter(w => w);
                  let mockLongStory = [
                      { speaker: 'ErzÃ¤hler', text: 'Es war ein kalter Morgen in der groÃŸen Stadt.', translation: 'Era una frÃ­a maÃ±ana en la gran ciudad.' },
                      { speaker: 'Lukas', text: 'Ich muss heute so viel erledigen. Wo fange ich an?', translation: 'Tengo tanto que hacer hoy. Â¿Por dÃ³nde empiezo?' },
                      { speaker: 'Anna', text: 'Vergiss nicht, dass wir spÃ¤ter zusammen essen gehen.', translation: 'No olvides que luego vamos a comer juntos.' },
                      { speaker: 'Lukas', text: 'NatÃ¼rlich nicht! Ich habe den Tisch schon reserviert.', translation: 'Â¡Por supuesto que no! Ya he reservado la mesa.' },
                      { speaker: 'Anna', text: 'Das ist wunderbar. Ich freue mich wirklich darauf.', translation: 'Eso es maravilloso. De verdad me alegro de ello.' },
                      { speaker: 'ErzÃ¤hler', text: 'SpÃ¤ter am Abend trafen sie sich im neuen Restaurant.', translation: 'MÃ¡s tarde en la noche se encontraron en el nuevo restaurante.' },
                      { speaker: 'Kellner', text: 'Guten Abend! Was darf ich Ihnen heute bringen?', translation: 'Â¡Buenas tardes! Â¿QuÃ© les puedo traer hoy?' },
                      { speaker: 'Lukas', text: 'Wir hÃ¤tten gerne die Speisekarte und ein Wasser, bitte.', translation: 'Nos gustarÃ­a la carta y un agua, por favor.' },
                      { speaker: 'Anna', text: 'Und ich hÃ¤tte gerne ein Glas Rotwein.', translation: 'Y a mÃ­ me gustarÃ­a una copa de vino tinto.' },
                      { speaker: 'Kellner', text: 'Kommt sofort! Haben Sie schon gewÃ¤hlt?', translation: 'Â¡Enseguida! Â¿Ya han elegido?' }
                  ];
                  if (wordsArray.length > 0) {
                      wordsArray.forEach((word, index) => {
                          let i = (index + 1) * 2; 
                          if (i >= mockLongStory.length) i = mockLongStory.length - 1;
                          mockLongStory.splice(i, 0, {
                              speaker: 'Anna', text: `Ãœbrigens, erinnerst du dich an ${word}? Das war eine interessante Erfahrung.`,
                              translation: `Por cierto, Â¿te acuerdas de ${word}? Fue una experiencia interesante.`,
                              vocab: [{ de: word, es: 'Palabra Custom', diff: 1 }]
                          });
                      });
                  }
                  setGuionData(mockLongStory); setActiveScriptTitle(`AI Generated: ${aiLevel} - ${aiTheme}`);
                  setIsDefaultScript(false); setActiveSavedScriptId(null); setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false);
                  setIsGeneratingStory(false); setActiveTab('historia'); setAiCustomWords(""); 
              }, 3000);
          };

          const sanitizeHistoriaSpeechText = (text) => {
              return String(text || '')
                  .replace(/\[R\]/gi, '')
                  .replace(/\bN[Ã¼u]tzlich\b\.?/gi, '')
                  .replace(/\b[ÃšU]TIL\b\.?/gi, '')
                  .replace(/\s{2,}/g, ' ')
                  .trim();
          };

          const playSceneAudio = (text, speaker) => {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'de-DE';
              if (speaker === 'Lukas') { utterance.voice = getVoice('de', 'male'); utterance.pitch = 1.1; } 
              else if (speaker === 'Elena' || speaker === 'Anna') { utterance.voice = getVoice('de', 'female'); utterance.pitch = 1.2; } 
              else if (speaker.includes('Weber') || speaker === 'Professor' || speaker === 'ErzÃ¤hler') { utterance.voice = getVoice('de', 'male', true); utterance.pitch = 0.8; } 
              else { utterance.voice = getVoice('de', 'male'); }
              utterance.rate = (speaker.includes('Weber') ? 0.9 : 1.0) * playbackRate;
              if (fluesternMode) { utterance.volume = 0.3; utterance.pitch = utterance.pitch * 0.8; } 
              else { utterance.volume = 1.0; }
              return utterance;
          };

          useEffect(() => {
            if (!isPlaying || !voicesLoaded || mode !== 'dialogue' || activeTab !== 'historia') return;
            window.speechSynthesis.cancel(); 
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const actualIdx = getActualSceneIndex();
            const currentScene = guionData[actualIdx];
            if ((currentScene.speaker === roleplayChar || roleplayChar === 'Todos') && mode === 'dialogue' && !podcastMode) {
                setMode('roleplay_wait'); setIsPlaying(false); return; 
            }
           // Limpiamos el texto de sÃ­mbolos que el motor de voz lee por error (.;)
const audioCleanText = sanitizeHistoriaSpeechText(currentScene.text).replace(/[.;;]/g, '.'); 
const sentenceUtterance = playSceneAudio(audioCleanText, currentScene.speaker);
            let utterances = [sentenceUtterance];
            if (currentScene.vocab && currentScene.vocab.length > 0 && !podcastMode && !diktatMode && !puzzleMode && !declinaMode && !artikelSniperMode) {
                currentScene.vocab.forEach(v => {
                    const uDe = new SpeechSynthesisUtterance(v.de);
                    uDe.lang = 'de-DE'; uDe.voice = getVoice('de', 'female'); uDe.rate = 0.85;
                    utterances.push(uDe);
                    const uEs = new SpeechSynthesisUtterance(v.es);
                    uEs.lang = 'es-ES'; uEs.voice = getVoice('es', 'male'); uEs.rate = 0.9;
                    utterances.push(uEs);
                });
            }
            if (podcastMode) {
                const esUtter = new SpeechSynthesisUtterance(currentScene.translation || "TraducciÃ³n no disponible");
                esUtter.lang = 'es-ES'; esUtter.voice = getVoice('es', 'male'); esUtter.rate = 1.0;
                utterances = [sentenceUtterance, esUtter];
            }
            utterances[utterances.length - 1].onend = () => {
                if (!isPlayingRef.current) return;
                if (diktatMode || puzzleMode || declinaMode || artikelSniperMode) { setIsPlaying(false); return; } 
                if (podcastMode) timeoutRef.current = setTimeout(() => proceedToNextStage(), 1500);
                else timeoutRef.current = setTimeout(() => proceedToNextStage(), 800);
            };
            utterances.forEach(u => window.speechSynthesis.speak(u));
            return () => { window.speechSynthesis.cancel(); if (timeoutRef.current) clearTimeout(timeoutRef.current); };
          }, [sceneIndex, mode, isPlaying, voicesLoaded, playbackRate, roleplayChar, diktatMode, puzzleMode, declinaMode, artikelSniperMode, isReviewing, fluesternMode, activeTab, podcastMode, ttsPrefsEpoch]);

          const trySaveGrammarStructure = () => {
              const text = guionData[getActualSceneIndex()].text;
              const translation = guionData[getActualSceneIndex()].translation || "";
              let found = false;
              let newGrammar = [...userStats.difficultGrammar];
              GRAMMAR_PATTERNS.forEach(p => {
                  if (text.match(p.regex)) {
                      if (!newGrammar.some(g => g.base === p.base)) { newGrammar.push({ base: p.base, exampleDe: text, exampleEs: translation }); found = true; }
                  }
              });
              if (found) { saveProgress({ difficultGrammar: newGrammar }); alert("Â¡Estructura automÃ¡tica detectada y guardada en tu mazo!"); } 
              else { setShowGrammarPrompt(true); }
          };

          const handleCustomGrammarSave = () => {
              if(!customGrammarInput.trim()) return;
              const text = guionData[getActualSceneIndex()].text;
              const translation = guionData[getActualSceneIndex()].translation || "";
              let newGrammar = [...userStats.difficultGrammar];
              newGrammar.push({ base: customGrammarInput, exampleDe: text, exampleEs: translation });
              saveProgress({ difficultGrammar: newGrammar });
              setShowGrammarPrompt(false); setCustomGrammarInput(""); alert("Â¡Estructura personalizada guardada con Ã©xito!");
          };

          const generateTutorFeedback = (text) => {
              let feedback = [];
              const tLower = text.toLowerCase();
              if (tLower.match(/\b(weil|dass|obwohl|wenn|als|damit|ob|bevor|nachdem)\b/i)) feedback.push("ðŸŸ£ **Nebensatz (Subordinada):** Has usado un conector subordinante. El verbo conjugado va a la Ãºltima posiciÃ³n de la frase.");
              if (tLower.match(/\b(deshalb|deswegen|darum|trotzdem|dann|danach|auÃŸerdem)\b/i)) feedback.push("ðŸŸ  **Hauptsatz (InversiÃ³n):** Conector en PosiciÃ³n 1. Inmediatamente despuÃ©s tiene que ir el verbo (Pos 2), y luego el sujeto.");
              if (tLower.match(/\b(und|aber|oder|denn|sondern)\b/i)) feedback.push("ðŸŸ¢ **Conector ADUSO (PosiciÃ³n 0):** Une dos frases sin alterar el orden normal (Sujeto + Verbo).");
              if (tLower.match(/\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b.*\b(ge[a-zÃ¤Ã¶Ã¼ÃŸ]+t|ge[a-zÃ¤Ã¶Ã¼ÃŸ]+en|.+[ie]rt)\b/i)) feedback.push("ðŸ•°ï¸ **Perfekt:** Auxiliar (haben/sein) en PosiciÃ³n 2 y Participio al final.");
              if (tLower.match(/\b(wurde|wurdest|wurden|wurdet|war|warst|waren|wart|hatte|hattest|hatten|hattet|gab|musste|konnte|wollte|sollte|durfte)\b/i) && !tLower.match(/\b(worden)\b/i)) feedback.push("ðŸ“– **PrÃ¤teritum:** Pasado simple. Usado para verbos auxiliares, modales o narraciÃ³n.");
              if (tLower.match(/\b(wurde|worden)\b/i) || (tLower.match(/\b(werden|wird|werden|werdet)\b/i) && tLower.match(/\b(ge[a-zÃ¤Ã¶Ã¼ÃŸ]+t|ge[a-zÃ¤Ã¶Ã¼ÃŸ]+en)\b/i))) feedback.push("ðŸ›ï¸ **Passiv:** 'Werden' + Participio II. Lo importante es la acciÃ³n, no el sujeto.");
              if (tLower.match(/\b(muss|musst|mÃ¼ssen|kann|kannst|kÃ¶nnen|darf|darfst|dÃ¼rfen|soll|sollst|sollen|will|willst|wollen|mÃ¶chte|mÃ¶chtest|mÃ¶chten)\b/i)) feedback.push("ðŸ’ª **Modalverben:** Verbo modal en Pos 2, obliga al verbo principal en Infinitivo al final.");
              if (tLower.match(/\b(an|ein|auf|zu|mit|aus|vor|nach|ab|her|hin|los|teil)\s*[.,!?]*$/i)) feedback.push("âœ‚ï¸ **Trennbare Verben:** El prefijo del verbo se ha separado al final de la frase.");
              if (tLower.match(/\b(aus|bei|mit|nach|seit|von|zu|ab)\b/i)) feedback.push("ðŸ”µ **Dativo (PreposiciÃ³n):** PreposiciÃ³n que rige Dativo estricto.");
              if (tLower.match(/\b(durch|fÃ¼r|gegen|ohne|um)\b/i)) feedback.push("ðŸ”´ **Acusativo (PreposiciÃ³n):** PreposiciÃ³n que rige Acusativo estricto.");
              if (tLower.match(/\b(in|an|auf|neben|hinter|Ã¼ber|unter|vor|zwischen)\b/i)) feedback.push("ðŸŸ¡ **WechselprÃ¤position:** Rige Dativo (Wo?) o Acusativo (Wohin?).");
              GRAMMAR_PATTERNS.forEach(p => { if (text.match(p.regex)) feedback.push(`ðŸŒŸ **Verbo con PreposiciÃ³n Fija:** ${p.tooltip}.`); });
              return feedback.join("\n\n") || "ðŸŸ¢ **Hauptsatz:** Estructura estÃ¡ndar perfecta.";
          };

          const showAITutor = () => {
              setTutorMessage(generateTutorFeedback(guionData[getActualSceneIndex()].text));
              setShowTutor(true);
          };

          const handleDiktatCheck = () => {
              if (!diktatInput.trim()) { alert("Por favor, escribe lo que has escuchado primero."); return; }
              setShowDiktatResult(true);
              const cleanText = (t) => t.toLowerCase().replace(/Ã¤/g, 'ae').replace(/Ã¶/g, 'oe').replace(/Ã¼/g, 'ue').replace(/ÃŸ/g, 'ss').replace(/[.,!?]/g, '').trim();
              const originalText = cleanText(guionData[getActualSceneIndex()].text);
              const typedText = cleanText(diktatInput);
              if (originalText !== typedText) {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
                  setDiktatMotivationMsg(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Sigue intentÃ¡ndolo.');
                  if (!isReviewing && !userStats.failedDiktatScenes.includes(sceneIndex)) {
                      saveProgress({ failedDiktatScenes: [...userStats.failedDiktatScenes, sceneIndex], diktatAttempts: userStats.diktatAttempts + 1, activityByDay: mergeActivityPoints(6) });
                  }
                  deductHeart();
              } else {
                  setDiktatMotivationMsg('');
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
                  saveProgress({ coins: userStats.coins + 5, diktatCorrect: userStats.diktatCorrect + 1, diktatAttempts: userStats.diktatAttempts + 1, activityByDay: mergeActivityPoints(25) });
              }
          };

          const handleVoiceStart = async (targetText = null, evalOpts = {}) => {
              if (userStats.hearts <= 0 && evalOpts.mode !== 'shadow') { setShowDeathModal(true); return; }
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert("Tu navegador no soporta esta funciÃ³n. Usa Google Chrome."); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) {
                  setGrammarPolizeiMsg('Sin permiso de micrÃ³fono. Puedes seguir con texto y audio.');
                  return;
              }
              if (recognitionRef.current) {
                  try { recognitionRef.current.stop(); } catch (e) {}
              }
              const recognition = new SpeechRecognition();
              recognition.lang = 'de-DE';
              const mobileStt = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || ''));
              /* continuous: una sola sesiÃ³n por pulsaciÃ³n; en mÃ³vil interimResults=false reduce duplicados del motor */
              recognition.continuous = true;
              recognition.interimResults = !mobileStt;
              recognition.maxAlternatives = mobileStt ? 1 : 3;
              recognitionRef.current = recognition;
              spokenTextRef.current = "";
              speechFinalRef.current = "";
              const opts = { mode: evalOpts.mode || 'default' };
              const pickAlt = (res) => {
                  let alt = res[0];
                  for (let j = 1; j < res.length; j++) {
                      const cj = res[j].confidence;
                      const cb = alt.confidence;
                      if (typeof cj === 'number' && (typeof cb !== 'number' || cj >= cb)) alt = res[j];
                  }
                  return alt;
              };
              recognition.onstart = () => {
                  setIsListening(true);
                  setSpokenText("");
                  speechFinalRef.current = "";
                  spokenTextRef.current = "";
                  setPronunciationScore(null);
                  setGrammarPolizeiMsg("");
                  setPronunciationFeedback([]);
              };
              recognition.onresult = (event) => {
                  const finals = [];
                  let interim = "";
                  for (let i = event.resultIndex; i < event.results.length; i++) {
                      const res = event.results[i];
                      const alt = pickAlt(res);
                      const raw = (alt.transcript || "").trim();
                      if (!raw) continue;
                      if (res.isFinal) finals.push(raw);
                      else interim = raw;
                  }
                  if (finals.length) {
                      if (mobileStt) {
                          if (finals.length === 1) {
                              const f = finals[0];
                              const cur = speechFinalRef.current || "";
                              if (!cur) speechFinalRef.current = f;
                              else if (f.startsWith(cur.trim())) speechFinalRef.current = f;
                              else if (cur.startsWith(f) && f.length < cur.length) { /* mantener frase mÃ¡s larga */ }
                              else if (f.length >= cur.length && (f.indexOf(cur) >= 0 || cur.indexOf(f) >= 0)) speechFinalRef.current = f.length >= cur.length ? f : cur;
                              else speechFinalRef.current = mergeSpeechFinalChunk(cur, f);
                          } else {
                              const chunk = finals.join(" ").trim();
                              speechFinalRef.current = mergeSpeechFinalChunk(speechFinalRef.current, chunk);
                          }
                      } else {
                          for (const f of finals) {
                              speechFinalRef.current = mergeSpeechFinalChunk(speechFinalRef.current, f);
                          }
                      }
                  }
                  const display = (speechFinalRef.current + (interim ? (speechFinalRef.current ? " " : "") + interim : "")).trim();
                  const cleaned = collapseStutterRepeats(display);
                  spokenTextRef.current = cleaned;
                  setSpokenText(cleaned);
              };
              recognition.onerror = (event) => {
                  console.error("Error de micro:", event.error);
                  setIsListening(false);
                  if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                      alert("Permiso de micrÃ³fono denegado. Activa el mic en la barra del navegador.");
                  }
              };
              recognition.onend = () => {
                  setIsListening(false);
                  evaluatePronunciation(targetText, spokenTextRef.current || "", opts);
              };
              try { recognition.start(); } catch (e) {}
          };

          const handleVoiceStop = () => {
              const r = recognitionRef.current;
              if (!r) return;
              try { r.stop(); } catch (e) {}
          };

          const micMouseDownGuard = (fn) => () => {
              if (Date.now() < micIgnoreMouseUntilRef.current) return;
              fn();
          };
          const micTouchStartGuard = (fn) => () => {
              micIgnoreMouseUntilRef.current = Date.now() + 450;
              fn();
          };

          const evaluatePronunciation = (targetText, transcript, opts = {}) => {
              const mode = opts.mode || 'default';
              if (!transcript || transcript.trim() === "") {
                  if (mode === 'shadow') {
                      setGrammarPolizeiMsg("No se detectÃ³ voz. Comprueba el micrÃ³fono o habla mÃ¡s cerca.");
                      setPronunciationScore(null);
                      setPronunciationFeedback([]);
                      if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
                  }
                  return;
              }
              const textToCompare = sanitizeHistoriaSpeechText(targetText || guionData[getActualSceneIndex()].text);
              const cleanOrig = normalizeGermanSpeechText(textToCompare);
              const cleanSpoken = normalizeGermanSpeechText(collapseStutterRepeats(transcript));
              if (!cleanOrig) return;
              const distance = levenshteinDistance(cleanOrig, cleanSpoken);
              const maxLength = Math.max(cleanOrig.length, cleanSpoken.length, 1);
              let scorePhrase = Math.round(((maxLength - distance) / maxLength) * 100);
              const origWords = cleanOrig.split(/\s+/).filter(Boolean);
              const spokenWords = cleanSpoken.split(/\s+/).filter(Boolean);
              const feedbackArr = matchGermanWordsSequential(origWords, spokenWords);
              const correctN = feedbackArr.filter((f) => f.correct).length;
              const wordRatio = origWords.length ? correctN / origWords.length : 1;
              let scoreWords = Math.round(wordRatio * 100);
              let score = Math.round(scorePhrase * 0.45 + scoreWords * 0.55);
              let polizeiMsg = "";
              let penalty = false;
              if (mode !== 'shadow' && cleanOrig.includes("wegen des") && cleanSpoken.includes("wegen dem")) {
                  score -= 20;
                  polizeiMsg = "ðŸš¨ Grammatik-Polizei: Has external DATIVO en vez de GENITIVO. -1 â¤ï¸";
                  penalty = true;
              }
              const finalScore = score > 100 ? 100 : score < 0 ? 0 : score;
              if (mode === 'shadow') setGrammarPolizeiMsg("");
              else setGrammarPolizeiMsg(polizeiMsg);
              setPronunciationScore(finalScore);
              setPronunciationFeedback(feedbackArr);
              if (mode === 'shadow') {
                  saveProgress({
                      pronunciationAttempts: (userStats.pronunciationAttempts || 0) + 1,
                      pronunciationTotalScore: (userStats.pronunciationTotalScore || 0) + finalScore,
                      ...(finalScore >= 85 ? { coins: userStats.coins + 2, activityByDay: mergeActivityPoints(8) } : {}),
                  });
                  if (window.__mullerNotifyExerciseOutcome) {
                      window.__mullerNotifyExerciseOutcome(finalScore >= 75);
                  }
                  return;
              }
              if (penalty || finalScore < 50) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false); deductHeart(); }
              else {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
                  if (finalScore >= 90) saveProgress({ coins: userStats.coins + 5, activityByDay: mergeActivityPoints(12) });
              }
          };

          const playVocabAudio = () => {
              if(vocabDisplayList.length === 0) return;
              window.speechSynthesis.cancel();
              const currentVocab = vocabDisplayList[vocabReviewIndex];
              const cleanDeAudio = currentVocab.de.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-ZÃ¤Ã¶Ã¼ÃŸÃ„Ã–Ãœ]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
              const cleanEsAudio = currentVocab.es.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-ZÃ±Ã‘Ã¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“Ãš]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
              const utterDe = new SpeechSynthesisUtterance(cleanDeAudio);
              utterDe.lang = 'de-DE'; utterDe.voice = getVoice('de', 'female'); utterDe.rate = 0.85;
              utterDe.onend = () => {
                  setTimeout(() => { setShowVocabTranslation(true);
                     const utterEs = new SpeechSynthesisUtterance(cleanEsAudio);
                     utterEs.lang = 'es-ES'; utterEs.voice = getVoice('es', 'male'); utterEs.rate = 0.9;
                     window.speechSynthesis.speak(utterEs); }, 500); 
              };
              window.speechSynthesis.speak(utterDe);
          };

          const handleVocabDifficulty = (level) => {
            const currentWord = vocabDisplayList[vocabReviewIndex];
            if (!currentWord) return;
            let newDiff = [...userStats.difficultVocab];
            let newNorm = [...userStats.normalVocab];
            if (level === 'hard') { if (!newDiff.some(w => w.de === currentWord.de)) newDiff.push(currentWord); } 
            else if (level === 'normal') { if (!newNorm.some(w => w.de === currentWord.de)) newNorm.push(currentWord); }
            if (window.__mullerNotifyExerciseOutcome) {
                window.__mullerNotifyExerciseOutcome(level === 'easy' || level === 'normal');
            }
            mullerBumpVocabStreakRating();
            saveProgress({ difficultVocab: newDiff, normalVocab: newNorm, activityByDay: mergeActivityPoints(15) });
            try {
                const nextMap = mullerApplyVocabSrsRating(mullerGetVocabSrsMap(), currentWord, level);
                mullerSetVocabSrsMap(nextMap);
                setVocabSrsEpoch((e) => e + 1);
            } catch (e) {}
            if (vocabReviewIndex < vocabDisplayList.length - 1) { setVocabReviewIndex(prev => prev + 1); setShowVocabTranslation(false); } 
            else {
                window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
                setCelebrationModal({ title: 'Â¡Lista completada!', subtitle: 'Has repasado todas las tarjetas de esta sesiÃ³n.', xp: 15, coins: 10 });
                saveProgress({ xp: userStats.xp + 15, coins: userStats.coins + 10, activityByDay: mergeActivityPoints(35) });
                setActiveTab('guiones');
            }
          };

          const startPractice = (type) => {
              if (type === 'diff' && (!userStats.difficultVocab || userStats.difficultVocab.length === 0)) { alert("Tu mazo de Vocabulario DifÃ­cil estÃ¡ vacÃ­o."); return; }
              if (type === 'norm' && (!userStats.normalVocab || userStats.normalVocab.length === 0)) { alert("Tu mazo de Vocabulario Normal estÃ¡ vacÃ­o."); return; }
              if (type === 'grammar' && (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0)) { alert("Tu mazo de GramÃ¡tica estÃ¡ vacÃ­o."); return; }
              setPracticeActive(type); setPracticeIndex(0); setPracticeShowTrans(false);
          };

          const playPracticeAudio = (text) => {
              window.speechSynthesis.cancel();
              const utterDe = new SpeechSynthesisUtterance(text);
              utterDe.lang = 'de-DE'; utterDe.voice = getVoice('de', 'male'); utterDe.rate = 0.9;
              window.speechSynthesis.speak(utterDe);
          };

          const nextPracticeWord = () => {
              if (practiceShowTrans && window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
              const list = practiceActive === 'diff' ? userStats.difficultVocab : (practiceActive === 'norm' ? userStats.normalVocab : userStats.difficultGrammar);
              if (practiceIndex < list.length - 1) { setPracticeIndex(practiceIndex + 1); setPracticeShowTrans(false); saveProgress({ activityByDay: mergeActivityPoints(6) }); } 
              else {
                  window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
                  setCelebrationModal({ title: 'Â¡SesiÃ³n de mazos!', subtitle: '+20 XP Â· +5 monedas', xp: 20, coins: 5 });
                  saveProgress({ xp: userStats.xp + 20, coins: userStats.coins + 5, activityByDay: mergeActivityPoints(30) });
                  setPracticeActive(null);
              }
          };

          const getArticleVisual = (word) => {
            if (!word) return null;
            if (word.startsWith('der ')) return <span className="text-blue-400 mr-2">ðŸ”µ</span>;
            if (word.startsWith('die ')) return <span className="text-red-400 mr-2">ðŸ”´</span>;
            if (word.startsWith('das ')) return <span className="text-green-400 mr-2">ðŸŸ¢</span>;
            return null;
          };

          const renderHighlightedText = (text, vocabList) => {
            let htmlText = text;
            if (artikelSniperMode) { const artRegex = /\b(der|die|das|den|dem|des)\b/gi; htmlText = htmlText.replace(artRegex, `<span class="bg-red-800/40 text-red-200 border-b border-red-500/60 px-2 mx-0.5 rounded-sm font-bold shadow-sm">[ ??? ]</span>`); }
            if (declinaMode) { const declRegex = /\b(d|ein|kein|mein|dein|sein|ihr|unser|euer)(er|en|em|es|e|as|ie)\b/gi; htmlText = htmlText.replace(declRegex, `$1<span class="text-pink-300 font-mono bg-pink-800/30 border-b border-pink-500/60 px-1 mx-0.5 rounded shadow-sm">[ _ ]</span>`); }
            if (vocabList && vocabList.length > 0) {
                const sortedVocab = [...vocabList].sort((a, b) => b.de.length - a.de.length);
                sortedVocab.forEach(v => {
                   let searchWord = v.de.replace(/^(der|die|das|sich)\s/i, '').trim();
                   const safeWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                   const regex = new RegExp(`(?![^<]*>)(^|[^a-zÃ¤Ã¶Ã¼ÃŸA-ZÃ„Ã–ÃœÃ¡ÂºÅ¾])(${safeWord})([^a-zÃ¤Ã¶Ã¼ÃŸA-ZÃ„Ã–ÃœÃ¡ÂºÅ¾]|$)`, 'gi');
                   if (lueckentextMode) htmlText = htmlText.replace(regex, `$1<span class="bg-gray-800 text-transparent border-b border-yellow-500/70 rounded px-3 mx-1 select-none" title="${v.es}">[ ??? ]</span>$3`);
                   else htmlText = htmlText.replace(regex, `$1<span class="bg-amber-500/20 text-amber-100 border-b border-amber-400/60 px-1 mx-0.5 rounded-sm font-bold shadow-sm" title="TraducciÃ³n: ${v.es}">$2</span>$3`);
                });
            }
            GRAMMAR_PATTERNS.forEach(p => { htmlText = htmlText.replace(p.regex, `<span class="bg-cyan-800/40 text-cyan-200 border-b border-cyan-400/60 px-1 mx-0.5 rounded-sm shadow-sm" title="${p.tooltip}">$1</span>`); });
            if (tempusMode) {
                Object.keys(TEMPUS_DICT).forEach(verb => {
                    const safeVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(?![^<]*>)\\b(${safeVerb})\\b`, 'gi');
                    htmlText = htmlText.replace(regex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
                });
                const genericInfRegex = /(?![^<]*>)\b([a-zÃ¤Ã¶Ã¼ÃŸ]{4,}(?:en|eln|ern))\b/gi;
                htmlText = htmlText.replace(genericInfRegex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
            }
            const connRegex = new RegExp(`(?![^<]*>)\\b(${CONN_LIST.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(connRegex, `<span class="text-purple-300 font-bold underline decoration-purple-500/70 decoration-2 underline-offset-4" title="Conector">$1</span>`);
            const datRegex = new RegExp(`(?![^<]*>)\\b(${PREP_DAT.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(datRegex, `<span class="text-blue-300 font-bold underline decoration-blue-500/70 decoration-2 underline-offset-4" title="PreposiciÃ³n Dativo (EstÃ¡tico)">$1</span>`);
            const akkRegex = new RegExp(`(?![^<]*>)\\b(${PREP_AKK.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(akkRegex, `<span class="text-red-300 font-bold underline decoration-red-500/70 decoration-2 underline-offset-4" title="PreposiciÃ³n Acusativo (Movimiento)">$1</span>`);
            const wechRegex = new RegExp(`(?![^<]*>)\\b(${PREP_WECHSEL.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(wechRegex, `<span class="text-yellow-500/90 font-bold underline decoration-yellow-600/70 decoration-2 underline-offset-4" title="WechselprÃ¤position (Mixta)">$1</span>`);
            return (
                <div
                    className="leading-loose inline"
                    onClick={(e) => {
                        if (!tempusMode) return;
                        const t = e && e.target && e.target.closest ? e.target.closest('[data-tempus-verb]') : null;
                        if (!t) return;
                        const picked = t.getAttribute('data-tempus-verb');
                        const info = resolveTempusVerbInfo(picked);
                        if (info) setTempusSelectedVerb(info);
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlText }}
                />
            );
          };

          const renderDiktatDiff = (original, typed) => {
              const cleanWord = (w) => w.toLowerCase().replace(/Ã¤/g, 'ae').replace(/Ã¶/g, 'oe').replace(/Ã¼/g, 'ue').replace(/ÃŸ/g, 'ss').replace(/[.,!?]/g, '').trim();
              const origWords = original.split(/\s+/).filter(w=>w);
              const typedWords = typed.split(/\s+/).filter(w=>w);
              return (
                  <div className="flex flex-wrap gap-2 text-2xl md:text-3xl font-medium justify-center bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-700 leading-loose w-full">
                      {origWords.map((word, i) => {
                          const tWord = typedWords[i] || "";
                          const isCorrect = cleanWord(word) === cleanWord(tWord);
                          if (isCorrect) return <span key={i} className="text-green-400">{word}</span>;
                          else return (
                              <div key={i} className="flex flex-col items-center mx-1">
                                  <span className="text-red-400 line-through decoration-red-500 text-base md:text-xl opacity-70">{tWord || "___"}</span>
                                  <span className="text-green-300 border-b border-green-500 font-bold bg-green-900/30 px-1 rounded text-sm md:text-base">{word}</span>
                              </div>
                          );
                      })}
                  </div>
              );
          };

          const exportToAnki = (type) => {
            let csvContent = "data:text/csv;charset=utf-8,";
            if (type === 'vocab_diff') {
                if (!userStats.difficultVocab || userStats.difficultVocab.length === 0) { alert("VacÃ­o."); return; }
                userStats.difficultVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Dificil"\r\n`; });
            } else if (type === 'vocab_norm') {
                if (!userStats.normalVocab || userStats.normalVocab.length === 0) { alert("VacÃ­o."); return; }
                userStats.normalVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Repaso"\r\n`; });
            } else {
                if (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0) { alert("VacÃ­o."); return; }
                userStats.difficultGrammar.forEach((g) => { csvContent += `"${g.base} (Verbo+Prep)","${g.exampleDe}<br><small>${g.exampleEs}</small>","Dificil"\r\n`; });
            }
            const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); 
            link.setAttribute("download", `Anki_${type}_B1.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
          };

          const exportScriptPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert("Permite las ventanas emergentes para generar el PDF."); return; }
            const escPdf = (s) => String(s ?? '')
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const genDate = new Date().toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
            const totalScenes = guionData.length;
            let htmlContent = `
                <html>
                <head>
                    <title>Guion: ${escPdf(activeScriptTitle)}</title>
                    <style>
                        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 28px; line-height: 1.55; max-width: 920px; margin: 0 auto; }
                        h1 { color: #b91c1c; text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 12px; font-size: 26px; }
                        .meta { text-align: center; color: #64748b; margin-bottom: 8px; font-size: 13px; }
                        .meta strong { color: #475569; }
                        h2 { color: #1e3a8a; border-bottom: 2px solid #93c5fd; padding-bottom: 5px; margin-top: 36px; font-size: 18px; }
                        .scene { margin-bottom: 28px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.06); page-break-inside: avoid; }
                        .scene-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
                        .scene-num { font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 0.06em; text-transform: uppercase; }
                        .speaker { font-weight: 900; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; }
                        .badge-redem { font-size: 11px; background: linear-gradient(90deg,#f97316,#eab308); color: white; padding: 3px 10px; border-radius: 999px; font-weight: 800; }
                        .block-de { margin-bottom: 14px; }
                        .label-row { font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
                        .label-es { color: #047857; }
                        .text-de { font-size: 19px; font-weight: 700; margin: 0; color: #0f172a; line-height: 1.45; }
                        .block-es { background: linear-gradient(90deg, #ecfdf5 0%, #f8fafc 100%); border-left: 4px solid #059669; padding: 12px 14px; border-radius: 0 8px 8px 0; margin-top: 4px; }
                        .text-es { font-size: 16px; color: #166534; margin: 0; line-height: 1.5; font-style: normal; font-weight: 500; }
                        .text-es-empty { color: #94a3b8; font-style: italic; font-weight: 400; }
                        .vocab-box { font-size: 12px; color: #92400e; background: #fffbeb; padding: 8px 12px; border-radius: 6px; margin-top: 12px; font-weight: 600; border: 1px solid #fcd34d; line-height: 1.4; }
                        .hl-vocab { background-color: #fef08a; border-bottom: 2px solid #eab308; padding: 0 4px; border-radius: 2px; }
                        .hl-conn { color: #7e22ce; text-decoration: underline; text-decoration-color: #a855f7; text-decoration-thickness: 2px; }
                        .hl-dat { color: #1d4ed8; text-decoration: underline; text-decoration-color: #3b82f6; text-decoration-thickness: 2px; }
                        .hl-akk { color: #b91c1c; text-decoration: underline; text-decoration-color: #ef4444; text-decoration-thickness: 2px; }
                        .hl-wech { color: #d97706; text-decoration: underline; text-decoration-color: #f59e0b; text-decoration-thickness: 2px; }
                        .hl-verbprep { background-color: #cffafe; border-bottom: 2px solid #06b6d4; padding: 0 4px; border-radius: 2px; color: #0891b2; }
                        .tempus-tag { font-size: 10px; color: #4338ca; font-family: ui-monospace, monospace; background: #e0e7ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #a5b4fc; margin-left: 4px; font-weight: 500; }
                        .grammar-summary { background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 28px; page-break-inside: avoid; }
                        .legend { background: #f1f5f9; padding: 16px 18px; border-radius: 10px; margin-top: 32px; font-size: 12px; color: #475569; border: 1px solid #e2e8f0; page-break-inside: avoid; }
                        .legend h3 { margin: 0 0 10px 0; font-size: 14px; color: #0f172a; }
                        .legend ul { margin: 0; padding-left: 18px; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #64748b; }
                        @media print { body { padding: 16px; } .scene { box-shadow: none; } }
                    </style>
                </head>
                <body>
                    <h1>ðŸ“ ${escPdf(activeScriptTitle)}</h1>
                    <p class="meta"><strong>MÃ¼ller</strong> Â· Entrenador alemÃ¡n TELC Â· ${escPdf(genDate)} Â· ${totalScenes} escena${totalScenes === 1 ? '' : 's'}</p>
            `;
            let uniqueGrammarRules = new Set();
            guionData.forEach((scene, sceneIdx) => {
                let deText = scene.text;
                const feedback = generateTutorFeedback(deText);
                if (feedback && !feedback.includes("Estructura estÃ¡ndar perfecta")) {
                    feedback.split('\n\n').forEach(f => uniqueGrammarRules.add(f));
                }
                if (scene.vocab) {
                    const sortedVocab = [...scene.vocab].sort((a, b) => b.de.length - a.de.length);
                    sortedVocab.forEach(v => {
                        let searchWord = v.de.replace(/^(der|die|das|sich)\s/i, '').trim();
                        const safeWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(`(?![^<]*>)(^|[^a-zÃ¤Ã¶Ã¼ÃŸA-ZÃ„Ã–ÃœÃ¡ÂºÅ¾])(${safeWord})([^a-zÃ¤Ã¶Ã¼ÃŸA-ZÃ„Ã–ÃœÃ¡ÂºÅ¾]|$)`, 'gi');
                        deText = deText.replace(regex, `$1<span class="hl-vocab">$2</span>$3`);
                    });
                }
                GRAMMAR_PATTERNS.forEach(p => { deText = deText.replace(p.regex, `<span class="hl-verbprep">$1</span>`); });
                Object.keys(TEMPUS_DICT).forEach(verb => {
                    const safeVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(?![^<]*>)\\b(${safeVerb})\\b`, 'gi');
                    deText = deText.replace(regex, `$1 <span class="tempus-tag">(${TEMPUS_DICT[verb]})</span>`);
                });
                const connRegex = new RegExp(`(?![^<]*>)\\b(${CONN_LIST.join('|')})\\b`, 'gi');
                deText = deText.replace(connRegex, `<span class="hl-conn">$1</span>`);
                const datRegex = new RegExp(`(?![^<]*>)\\b(${PREP_DAT.join('|')})\\b`, 'gi');
                deText = deText.replace(datRegex, `<span class="hl-dat">$1</span>`);
                const akkRegex = new RegExp(`(?![^<]*>)\\b(${PREP_AKK.join('|')})\\b`, 'gi');
                deText = deText.replace(akkRegex, `<span class="hl-akk">$1</span>`);
                const wechRegex = new RegExp(`(?![^<]*>)\\b(${PREP_WECHSEL.join('|')})\\b`, 'gi');
                deText = deText.replace(wechRegex, `<span class="hl-wech">$1</span>`);
                const tr = scene.translation && String(scene.translation).trim();
                const trBlock = tr
                    ? `<div class="block-es"><div class="label-row label-es">EspaÃ±ol Â· traducciÃ³n</div><p class="text-es">${escPdf(tr)}</p></div>`
                    : `<div class="block-es"><div class="label-row label-es">EspaÃ±ol Â· traducciÃ³n</div><p class="text-es text-es-empty">(Sin traducciÃ³n en esta lÃ­nea del guion â€” puedes aÃ±adirla en Biblioteca al editar.)</p></div>`;
                const vocabHtml = scene.vocab && scene.vocab.length > 0
                    ? `<div class="vocab-box">ðŸ“– Vocabulario: ${scene.vocab.map((v) => `${escPdf(v.de)} â†’ ${escPdf(v.es)}`).join(' Â· ')}</div>`
                    : '';
                htmlContent += `
                    <div class="scene">
                        <div class="scene-head">
                            <span class="scene-num">Szene ${sceneIdx + 1} / ${totalScenes}</span>
                            <span class="speaker">${escPdf(scene.speaker)}</span>
                            ${scene.isRedemittel ? '<span class="badge-redem">Redemittel</span>' : ''}
                        </div>
                        <div class="block-de">
                            <div class="label-row">Deutsch</div>
                            <div class="text-de">${deText}</div>
                        </div>
                        ${trBlock}
                        ${vocabHtml}
                    </div>
                `;
            });
            if (uniqueGrammarRules.size > 0) {
                htmlContent += `<div class="grammar-summary"><h2>ðŸ§  AnÃ¡lisis Gramatical del Guion</h2><ul>`;
                uniqueGrammarRules.forEach(rule => { let cleanRule = rule.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); htmlContent += `<li>${cleanRule}</li>`; });
                htmlContent += `</ul></div>`;
            }
            htmlContent += `
                <div class="legend">
                    <h3>Leyenda de marcas en el alemÃ¡n</h3>
                    <ul>
                        <li><strong>Resaltado amarillo:</strong> Ã­tems del vocabulario de la escena.</li>
                        <li><strong>Cyan (fondo):</strong> verbos con preposiciÃ³n detectados.</li>
                        <li><strong>Subrayados de color:</strong> conectores; preposiciones con Dativ / Akkusativ / Wechsel.</li>
                        <li><strong>Etiquetas moradas (Tempus):</strong> referencia de formas verbales (PrÃ¤t/Perf).</li>
                    </ul>
                </div>
                <div class="footer">MÃ¼ller Â· TELC Â· Â¡Viel Erfolg beim Deutschlernen!</div>
                <script>window.onload = function() { window.print(); }<\/script></body></html>`;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
          };

          const exportProgressPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert("Por favor, permite las ventanas emergentes (pop-ups) en tu navegador para generar el PDF."); return; }
            const htmlContent = `
                <html><head><title>Mi Resumen de AlemÃ¡n - Profesor MÃ¼ller</title><style>body { font-family: 'Segoe UI', sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; } h1 { color: #2563eb; text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; } h2 { color: #0f172a; margin-top: 40px; } table { width: 100%; border-collapse: collapse; margin-top: 15px; } th, td { border: 1px solid #94a3b8; padding: 12px; } th { background-color: #f1f5f9; } .diff { color: #dc2626; font-weight: bold; } .norm { color: #2563eb; } .grammar-base { color: #0891b2; }</style></head><body>
                <h1>ðŸ“š Resumen de Estudio - B1/B2</h1>
                <div><h2>ðŸ”´ Vocabulario DifÃ­cil</h2>${userStats.difficultVocab?.length ? `<table><tr><th>AlemÃ¡n</th><th>EspaÃ±ol</th></tr>${userStats.difficultVocab.map(v => `<tr><td class="diff">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>VacÃ­o.</p>'}</div>
                <div><h2>ðŸ”µ Vocabulario Normal</h2>${userStats.normalVocab?.length ? `<table><tr><th>AlemÃ¡n</th><th>EspaÃ±ol</th></tr>${userStats.normalVocab.map(v => `<tr><td class="norm">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>VacÃ­o.</p>'}</div>
                <div><h2>ðŸ§  Reglas Gramaticales</h2>${userStats.difficultGrammar?.length ? `<table><tr><th>Regla</th><th>Ejemplo</th><th>TraducciÃ³n</th></tr>${userStats.difficultGrammar.map(g => `<tr><td class="grammar-base">${g.base}</td><td><i>"${g.exampleDe}"</i></td><td>${g.exampleEs}</td></tr>`).join('')}</table>` : '<p>VacÃ­o.</p>'}</div>
                <script>window.onload = function() { window.print(); }<\/script></body></html>
            `;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
          };

          // COLORES DE FONDO SUAVIZADOS (CorrecciÃ³n) + temas UI
          const getBgColor = () => {
              if (uiTheme === 'light') {
                  if (activeTab === 'inicio') return 'bg-slate-100';
                  if (activeTab === 'ruta') return 'bg-fuchsia-50';
                  if (activeTab === 'progreso') return 'bg-indigo-100';
                  if (activeTab === 'guiones') return 'bg-slate-100';
                  if (activeTab === 'vocabulario') return 'bg-amber-50';
                  if (activeTab === 'entrenamiento') return 'bg-fuchsia-50';
                  if (activeTab === 'lexikon') return 'bg-slate-100';
                  if (activeTab === 'bxbank') return 'bg-slate-100';
                  if (activeTab === 'storybuilder') return 'bg-indigo-100';
                  if (activeTab === 'historiaspro') return 'bg-emerald-50';
                  if (activeTab === 'shadowing') return 'bg-teal-50';
                  if (activeTab === 'lectura') return 'bg-sky-50';
                  if (activeTab === 'escritura') return 'bg-stone-100';
                  if (activeTab === 'telc') return 'bg-slate-100';
                  if (activeTab === 'comunidad') return 'bg-violet-50';
                  return 'bg-slate-50';
              }
              if (uiTheme === 'hc') return 'bg-black';
              if (activeTab === 'ruta') return 'bg-fuchsia-950/90';
              if (activeTab === 'comunidad') return 'bg-violet-950';
              if (activeTab === 'telc') return 'bg-slate-950';
              if (activeTab === 'inicio') return 'bg-slate-950';
              if (activeTab === 'progreso') return 'bg-indigo-950';
              if (activeTab === 'guiones') return 'bg-slate-900';
              if (activeTab === 'vocabulario') return 'bg-amber-950/70'; // Suavizado
              if (activeTab === 'entrenamiento') return 'bg-fuchsia-950/85';
              if (activeTab === 'lexikon') return 'bg-slate-900';
              if (activeTab === 'bxbank') return 'bg-slate-900'; // Suavizado
              if (activeTab === 'storybuilder') return 'bg-indigo-950'; // Suavizado
              if (activeTab === 'historiaspro') return 'bg-emerald-950/80';
              if (activeTab === 'shadowing') return 'bg-teal-950/90';
              if (activeTab === 'lectura') return 'bg-sky-950/90';
              if (activeTab === 'escritura') return 'bg-stone-950';
              if (fluesternMode) return 'bg-zinc-900 filter contrast-125 sepia-50'; 
              if (isReviewing || practiceActive) return 'bg-gray-900'; // Suavizado
              const speaker = guionData[getActualSceneIndex()]?.speaker;
              if (speaker === 'Lukas') return 'bg-slate-900';
              if (speaker === 'Elena' || speaker === 'Anna') return 'bg-slate-800'; // Suavizado
              if (speaker?.includes('Weber') || speaker === 'Professor') return 'bg-emerald-950';
              return 'bg-gray-900'; 
          };
