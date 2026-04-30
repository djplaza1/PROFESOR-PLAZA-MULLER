window.ShortcutsModal = function({ setShowShortcutsModal }) {
  return (
    <div className="fixed inset-0 z-[129] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowShortcutsModal(false)} role="presentation">
      <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-black text-white mb-3">Atajos de teclado</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">?</kbd> — esta ayuda</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">I</kbd> — Inicio</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">R</kbd> — Ruta (A0→C1)</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">H</kbd> — Historia</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">V</kbd> — Vocabulario</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">P</kbd> — Progreso</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">M</kbd> — Centro Müller</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">O</kbd> — Comunidad (cuenta, directorio, liga)</li>
          <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">Esc</kbd> — cerrar modales</li>
        </ul>
        <button type="button" className="mt-4 w-full py-2 rounded-xl bg-slate-700 font-bold text-sm" onClick={() => setShowShortcutsModal(false)}>Cerrar</button>
      </div>
    </div>
  );
};
