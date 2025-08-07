#!/bin/bash
set -e
cd /var/www/kizazi

echo "--- Backing up App.jsx ---"
cp src/App.jsx src/App.jsx.bak.$(date +%s)

echo "--- Replacing LanguageToggle with mobile-friendly, scrollable, high z-index version ---"
awk '
  BEGIN { copy=1 }
  /^\/\/ Language Toggle Component/ { copy=0; print "// Language Toggle Component (replaced)"; print "const LanguageToggle = () => {"; print "  const { language, languages, setLanguage, currentLanguage } = useLanguage();"; print "  const [isOpen, setIsOpen] = useState(false);"; print "  const [isMobile, setIsMobile] = useState(false);"; print ""; print "  useEffect(() => {"; print "    const onResize = () => setIsMobile(window.innerWidth < 640);"; print "    onResize();"; print "    window.addEventListener(\"resize\", onResize);"; print "    return () => window.removeEventListener(\"resize\", onResize);"; print "  }, []);"; print ""; print "  const LangList = () => ("; print "    <div className=\\"max-h-64 overflow-y-auto w-56 bg-white rounded-lg shadow-2xl border border-gray-200 py-2\\">"; print "      {Object.entries(languages).map(([code, lang]) => ("; print "        <button"; print "          key={code}"; print "          onClick={() => { setLanguage(code); setIsOpen(false); }}"; print "          className={\`w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3 \${language === code ? 'bg-pink-50 text-pink-600' : ''}\`}"; print "        >"; print "          <span className=\\"text-lg\\">{lang.flag}</span>"; print "          <span className=\\"text-sm\\">{lang.name}</span>"; print "        </button>"; print "      ))}"; print "    </div>"; print "  );"; print ""; print "  return ("; print "    <div className=\\"relative z-[60]\\">"; print "      <button"; print "        onClick={() => setIsOpen(!isOpen)}"; print "        className=\\"flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition\\""; print "      >"; print "        <Globe size={20} />"; print "        <span className=\\"text-sm\\">{currentLanguage?.flag}</span>"; print "        <span className=\\"hidden sm:block text-sm\\">{currentLanguage?.name}</span>"; print "      </button>"; print ""; print "      {/* Desktop dropdown: fixed to escape overflow, very high z-index */}"; print "      {!isMobile && isOpen && ("; print "        <div className=\\"fixed top-16 right-4 sm:absolute sm:top-auto sm:right-0 mt-2 z-[10000]\\">"; print "          <LangList />"; print "        </div>"; print "      )}"; print ""; print "      {/* Mobile: Fullscreen sheet */}"; print "      {isMobile && isOpen && ("; print "        <div className=\\"fixed inset-0 z-[10000]\\">"; print "          <div"; print "            className=\\"absolute inset-0 bg-black/50\\""; print "            onClick={() => setIsOpen(false)}"; print "          />"; print "          <div className=\\"absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl p-4\\">"; print "            <div className=\\"flex items-center justify-between mb-3\\">"; print "              <div className=\\"flex items-center gap-2\\">"; print "                <Globe size={18} />"; print "                <span className=\\"font-semibold\\">Select Language</span>"; print "              </div>"; print "              <button onClick={() => setIsOpen(false)} className=\\"text-gray-500 hover:text-gray-700\\"><X size={22} /></button>"; print "            </div>"; print "            <LangList />"; print "          </div>"; print "        </div>"; print "      )}"; print "    </div>"; print "  );"; print "};"; next }
  /^\/\/ Social Media Icon Component/ { copy=1 }
  copy { print $0 }
' src/App.jsx > src/App.jsx.tmp && mv src/App.jsx.tmp src/App.jsx

echo "--- Ensuring header has stacking context above content (avoids clipping) ---"
sed -i 's/<header className="/<header className="relative z-40 /' src/App.jsx

echo "--- Building the app ---"
npm run build --silent || (echo "Build failed"; exit 1)

echo "✅ Language dropdown fixed (scrollable, visible, mobile-friendly)"
echo "✅ Header z-index adjusted to avoid being covered"
echo "📱 Mobile: Language list opens as a bottom sheet with proper scrolling"
