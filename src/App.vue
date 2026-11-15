<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Play, Pause, SkipForward, SkipBack, Music, 
  Clock, FileText, Settings, Download, Github, 
  ExternalLink, Check, Copy, Layers, RefreshCw, 
  Sparkles, Monitor, HardDrive, WifiOff, ShieldCheck, Database, Zap,
  ChevronDown, HelpCircle, Terminal, Volume2
} from 'lucide-vue-next'

// Notch Hover & Expansion State
const isHovered = ref(false)
const isPinned = ref(false)
const isExpanded = computed(() => isHovered.value || isPinned.value)
let leaveTimeout: number | null = null

function onNotchEnter() {
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
    leaveTimeout = null
  }
  isHovered.value = true
}

function onNotchLeave() {
  leaveTimeout = window.setTimeout(() => {
    isHovered.value = false
  }, 280) // 280ms leave debounce, matching Linux app
}

// Active Shelf Tab
const activeTab = ref<'dashboard' | 'drops' | 'clipboard' | 'pomodoro' | 'notes' | 'settings'>('dashboard')

// Media Player Simulator
const isPlaying = ref(true)
const playbackProgress = ref(42)

function scrub(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  playbackProgress.value = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)))
}

// Pomodoro Timer Simulator
const pomodoroSeconds = ref(25 * 60)
const isPomoRunning = ref(false)
let pomoInterval: number | null = null

function togglePomo() {
  isPomoRunning.value = !isPomoRunning.value
  if (isPomoRunning.value) {
    pomoInterval = window.setInterval(() => {
      if (pomodoroSeconds.value > 0) {
        pomodoroSeconds.value--
      } else {
        isPomoRunning.value = false
        if (pomoInterval) clearInterval(pomoInterval)
      }
    }, 1000)
  } else if (pomoInterval) {
    clearInterval(pomoInterval)
    pomoInterval = null
  }
}

function resetPomo() {
  isPomoRunning.value = false
  if (pomoInterval) clearInterval(pomoInterval)
  pomodoroSeconds.value = 25 * 60
}

// Notes Simulator
const noteText = ref('Meeting notes with core team:\n- OpenNotch v0.2.0 released\n- Added Otty the River Otter mascot\n- Verified Wayland layer-shell protocol')

// Clipboard Simulator
const clipItems = ref([
  { id: 1, text: 'sudo apt install ./open-notch_0.2.0_amd64.deb', time: '2m ago' },
  { id: 2, text: 'https://github.com/gagan-gv/open-notch', time: '14m ago' },
  { id: 3, text: 'CARGO_PKG_VERSION=0.2.0', time: '1h ago' }
])

// Drop Shelf Simulator
const dropFiles = ref([
  { name: 'otty_mascot_contour.svg', size: '14.2 KB', type: 'vector' },
  { name: 'open-notch_0.2.0_amd64.deb', size: '4.8 MB', type: 'package' },
  { name: 'wayland_layer_spec.pdf', size: '320 KB', type: 'document' }
])

// Settings Simulator
const autostartActive = ref(true)
const updateStatus = ref<'idle' | 'checking' | 'latest'>('latest')

function simulateUpdateCheck() {
  updateStatus.value = 'checking'
  setTimeout(() => {
    updateStatus.value = 'latest'
  }, 1200)
}

// Installation Snippets Tab
const installTab = ref<'deb' | 'source' | 'systemd'>('deb')
const copiedSnippet = ref(false)

function copyText(txt: string) {
  navigator.clipboard.writeText(txt)
  copiedSnippet.value = true
  setTimeout(() => copiedSnippet.value = false, 2000)
}

// Frequently Asked Questions
const faqs = ref([
  {
    q: "Is it free?",
    a: "Yes, 100% free for a lifetime under the permissive MIT open-source license. There are no subscriptions, no paid tiers, and no features locked behind paywalls.",
    open: true
  },
  {
    q: "Where is my data stored?",
    a: "Always stored locally on your machine. All your notes, clipboard clippings, drop shelf items, and configurations remain strictly inside your local user directory (~/.config/open-notch/). Zero cloud servers, zero telemetry.",
    open: false
  },
  {
    q: "Does it support both Wayland and X11?",
    a: "Yes! OpenNotch supports modern Wayland compositors (Hyprland, Sway, River) using the native wlr-layer-shell protocol, as well as X11 / XWayland environments (GNOME, XFCE, i3, KWin) via standard EWMH dock hints.",
    open: false
  },
  {
    q: "How does it impact battery life and system performance?",
    a: "Virtually zero impact. Compiled in native Rust and GTK4 with no Electron or Chromium bloat, OpenNotch consumes under 25MB of RAM and remains completely dormant at 0% CPU until you hover over the top bezel.",
    open: false
  },
  {
    q: "Which media players can I control?",
    a: "Any media player that adheres to the standard Linux MPRIS D-Bus specification. This includes Spotify, Firefox, Google Chrome, Brave, VLC, MPV, Rhythmbox, and local audio players.",
    open: false
  },
  {
    q: "How do software updates work?",
    a: "OpenNotch includes a built-in background update engine. It checks GitHub's public releases API daily and notifies you directly in the in-shelf Settings tab with release notes and a one-click .deb download link.",
    open: false
  }
])

function toggleFaq(index: number) {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<template>
  <div class="min-h-screen bg-[#080B10] text-cyber-bright font-sans relative selection:bg-cyber-mint/30 selection:text-cyber-mint">
    <!-- Ambient background neon glows safely clipped so sticky navbar functions -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyber-mint/10 blur-[140px] rounded-full"></div>
      <div class="absolute top-96 right-10 w-[500px] h-[500px] bg-cyber-teal/10 blur-[160px] rounded-full"></div>
      <div class="absolute top-[1200px] left-10 w-[600px] h-[600px] bg-cyber-mint/5 blur-[180px] rounded-full"></div>
    </div>

    <!-- Navigation Bar (Sticky with glassmorphism blur) -->
    <header class="border-b border-cyber-border/70 sticky top-0 z-50 backdrop-blur-2xl bg-[#080B10]/85 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" class="flex items-center space-x-3 group">
          <div class="relative">
            <img src="/otty.png" alt="OpenNotch Mascot Otty" class="w-9 h-9 rounded-xl border border-cyber-mint/40 shadow-glow-mint/40 group-hover:scale-105 transition-transform" />
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-cyber-mint rounded-full border-2 border-[#080B10]"></div>
          </div>
          <span class="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 group-hover:text-cyber-mint transition-colors">
            OpenNotch
          </span>
        </a>

        <!-- Clean Reordered Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-cyber-muted">
          <a href="#simulator" class="hover:text-cyber-mint transition-colors flex items-center gap-1.5">
            <Monitor class="w-4 h-4 text-cyber-mint" />
            <span>Interactive Demo</span>
          </a>
          <a href="#features" class="hover:text-cyber-mint transition-colors flex items-center gap-1.5">
            <Sparkles class="w-4 h-4 text-cyber-teal" />
            <span>Features</span>
          </a>
          <a href="#install" class="hover:text-cyber-mint transition-colors flex items-center gap-1.5">
            <Terminal class="w-4 h-4 text-cyber-mint" />
            <span>Install</span>
          </a>
        </nav>

        <div class="flex items-center space-x-3">
          <a 
            href="https://github.com/gagan-gv/open-notch" 
            target="_blank"
            class="p-2 rounded-xl border border-cyber-border hover:border-cyber-mint/50 hover:bg-cyber-card transition-all text-cyber-muted hover:text-white"
            title="GitHub Repository"
          >
            <Github class="w-5 h-5" />
          </a>
          <a 
            href="#install" 
            class="px-4 py-2 rounded-xl bg-cyber-mint text-[#080B10] font-bold text-sm hover:bg-cyber-mint/90 transition-all shadow-glow-mint flex items-center gap-2 active:scale-95"
          >
            <Download class="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <!-- Release Announcement Pill -->
      <a 
        href="https://github.com/gagan-gv/open-notch/releases/tag/v0.2.0" 
        target="_blank"
        class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyber-card/90 border border-cyber-border hover:border-cyber-mint/50 text-xs font-medium text-cyber-muted mb-8 transition-all hover:scale-105 shadow-sm group"
      >
        <span class="w-2 h-2 rounded-full bg-cyber-mint animate-pulse"></span>
        <span class="text-white font-semibold">OpenNotch v0.2.0 is out!</span>
        <span class="text-cyber-muted group-hover:text-cyber-mint transition-colors">Featuring Otty mascot & In-app updates →</span>
      </a>

      <!-- Headline -->
      <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
        The Fluid, Dynamic Notch for <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-mint via-teal-300 to-cyber-teal">Linux Desktops</span>
      </h1>

      <p class="mt-6 text-lg sm:text-xl text-cyber-muted max-w-2xl mx-auto leading-relaxed">
        Resting discreetly as a top-screen pill, expanding on hover into an all-in-one productivity shelf. Built with Rust, GTK4, and native MPRIS D-Bus integration.
      </p>

      <!-- Architecture Pills Strip -->
      <div class="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono text-cyber-muted">
        <span class="px-3 py-1 rounded-full bg-cyber-card/80 border border-cyber-border/80 text-cyber-bright">🦀 100% Native Rust</span>
        <span class="px-3 py-1 rounded-full bg-cyber-card/80 border border-cyber-border/80 text-cyber-bright">⚡ GTK4 Layer-Shell</span>
        <span class="px-3 py-1 rounded-full bg-cyber-card/80 border border-cyber-border/80 text-cyber-bright">🎧 D-Bus MPRIS</span>
        <span class="px-3 py-1 rounded-full bg-cyber-card/80 border border-cyber-border/80 text-cyber-bright">📴 100% Offline</span>
        <span class="px-3 py-1 rounded-full bg-cyber-card/80 border border-cyber-border/80 text-cyber-bright">🚫 Zero Electron</span>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a 
          href="https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb"
          class="px-7 py-3.5 rounded-xl bg-cyber-mint text-[#080B10] font-extrabold text-base hover:bg-cyber-mint/90 transition-all shadow-glow-mint flex items-center gap-2.5 active:scale-95"
        >
          <Download class="w-5 h-5" />
          <span>Download .deb (v0.2.0)</span>
        </a>

        <a 
          href="#simulator"
          class="px-7 py-3.5 rounded-xl bg-cyber-card/90 border border-cyber-border text-white font-bold text-base hover:border-cyber-mint/50 hover:bg-cyber-card transition-all flex items-center gap-2 active:scale-95 shadow-sm"
        >
          <Monitor class="w-5 h-5 text-cyber-mint" />
          <span>Try Interactive Demo</span>
        </a>
      </div>

      <!-- Quick Command Bar -->
      <div class="mt-8 max-w-lg mx-auto">
        <div class="glass-panel p-2 rounded-xl flex items-center justify-between font-mono text-xs text-cyber-muted border border-cyber-border/80">
          <div class="flex items-center gap-2 truncate pl-2.5">
            <span class="text-cyber-mint select-none font-bold">$</span>
            <span class="truncate text-cyber-bright">sudo apt install ./open-notch_0.2.0_amd64.deb</span>
          </div>
          <button 
            @click="copyText('sudo apt install ./open-notch_0.2.0_amd64.deb')"
            class="p-2 rounded-lg hover:bg-cyber-border/50 text-cyber-muted hover:text-white transition-colors shrink-0"
            title="Copy command"
          >
            <Check v-if="copiedSnippet" class="w-4 h-4 text-cyber-mint" />
            <Copy v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>

    <!-- Interactive Notch Live Simulator -->
    <section id="simulator" class="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-24">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs font-semibold text-cyber-mint font-mono mb-2">
          <Monitor class="w-3.5 h-3.5" />
          <span>AUTHENTIC DESKTOP EXPERIENCE</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Experience the Shelf Live</h2>
        <p class="text-sm text-cyber-muted mt-1.5">Hover your cursor over the notch pill at the top of the monitor to see the shelf slide down beneath it, exactly like on Linux.</p>
      </div>

      <!-- Desktop Shell Frame (Curved Bezel Frame) -->
      <div class="rounded-3xl border border-cyber-border/90 bg-[#070A0F] shadow-2xl overflow-hidden relative min-h-[520px] flex flex-col select-none">
        
        <!-- Top Screen Bezel with GNOME / Wayland Status Bar -->
        <div class="h-8 bg-[#090D14] border-b border-cyber-border/40 flex items-center justify-between px-4 text-xs font-mono text-cyber-muted/70 relative z-20">
          <div class="flex items-center gap-3">
            <span class="text-white font-sans font-medium text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyber-mint"></span>
              Activities
            </span>
            <span class="hidden sm:inline">Files</span>
            <span class="hidden sm:inline">Terminal</span>
          </div>

          <div class="flex items-center gap-3.5 text-xs">
            <span>Sun Nov 15</span>
            <span class="text-white font-semibold">16:30</span>
            <div class="flex items-center gap-1.5 text-cyber-muted">
              <Volume2 class="w-3.5 h-3.5 text-cyber-mint" />
              <span>98%</span>
            </div>
          </div>
        </div>

        <!-- NOTCH & SLIDING SHELF (Anchored firmly to top-center) -->
        <div 
          class="absolute top-0 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
        >
          <!-- 1. The Top Notch Pill (ALWAYS VISIBLE at the top edge!) -->
          <div 
            @mouseenter="onNotchEnter"
            @mouseleave="onNotchLeave"
            @click="isPinned = !isPinned"
            :class="[
              'h-7 px-4 rounded-b-2xl bg-[#05070B] border-x border-b transition-all duration-300 flex items-center justify-between cursor-pointer shadow-lg select-none pointer-events-auto',
              isExpanded 
                ? 'border-cyber-mint/60 shadow-glow-mint/30 w-[240px]' 
                : 'border-cyber-border/80 hover:border-cyber-mint/50 w-[190px]'
            ]"
            title="Hover to slide shelf down, or click to pin open"
          >
            <!-- Left: Live Rhythmic Audio Equalizer Bars -->
            <div class="flex items-end gap-1 h-3.5">
              <span class="w-0.5 bg-cyber-mint rounded-full anim-bar-1"></span>
              <span class="w-0.5 bg-cyber-mint rounded-full anim-bar-2"></span>
              <span class="w-0.5 bg-cyber-mint rounded-full anim-bar-3"></span>
            </div>

            <!-- Center: Hardware Camera Lens with Emerald Privacy Dot -->
            <div class="flex items-center justify-center">
              <div class="w-3.5 h-3.5 rounded-full bg-[#11161F] border border-[#212B36] flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-cyber-mint shadow-[0_0_6px_#00FF9D]"></div>
              </div>
            </div>

            <!-- Right: Battery & Status -->
            <div class="flex items-center gap-1 text-[11px] font-mono text-cyber-muted">
              <span class="text-white font-medium">98%</span>
            </div>
          </div>

          <!-- 2. The Sliding Drop-Down Box (Shelf) -->
          <!-- Slides down smoothly right beneath the top notch pill -->
          <div 
            @mouseenter="onNotchEnter"
            @mouseleave="onNotchLeave"
            :class="[
              'w-[500px] max-w-[92vw] glass-panel rounded-2xl border border-cyber-border/90 p-4 shadow-2xl transition-all duration-300 transform origin-top mt-1.5 pointer-events-auto',
              isExpanded 
                ? 'translate-y-0 opacity-100 scale-100' 
                : '-translate-y-4 opacity-0 scale-95 !pointer-events-none'
            ]"
          >
            <!-- Shelf Top Navigation Strip -->
            <div class="flex items-center justify-between pb-3 border-b border-cyber-border/60">
              <!-- Tab switchers -->
              <div class="flex items-center gap-1">
                <button 
                  @click="activeTab = 'dashboard'"
                  :class="['px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5', activeTab === 'dashboard' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
                >
                  <Music class="w-3.5 h-3.5" />
                  <span>Media</span>
                </button>
                <button 
                  @click="activeTab = 'drops'"
                  :class="['px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5', activeTab === 'drops' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
                >
                  <Layers class="w-3.5 h-3.5" />
                  <span>Drops</span>
                </button>
                <button 
                  @click="activeTab = 'clipboard'"
                  :class="['px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5', activeTab === 'clipboard' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
                >
                  <FileText class="w-3.5 h-3.5" />
                  <span>Clip</span>
                </button>
                <button 
                  @click="activeTab = 'pomodoro'"
                  :class="['px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5', activeTab === 'pomodoro' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
                >
                  <Clock class="w-3.5 h-3.5" />
                  <span>Focus</span>
                </button>
                <button 
                  @click="activeTab = 'notes'"
                  :class="['px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5', activeTab === 'notes' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
                >
                  <FileText class="w-3.5 h-3.5" />
                  <span>Notes</span>
                </button>
              </div>

              <!-- Right controls: Settings & Pin Button -->
              <div class="flex items-center gap-2">
                <button 
                  @click="activeTab = 'settings'"
                  :class="['p-1.5 rounded-lg transition-colors', activeTab === 'settings' ? 'bg-cyber-mint/20 text-cyber-mint' : 'text-cyber-muted hover:text-white']"
                  title="Settings & Updates"
                >
                  <Settings class="w-3.5 h-3.5" />
                </button>
                <button 
                  @click="isPinned = !isPinned"
                  :class="[
                    'text-xs px-2 py-0.5 rounded border transition-colors',
                    isPinned ? 'bg-cyber-mint/20 text-cyber-mint border-cyber-mint/40 font-medium' : 'text-cyber-muted border-cyber-border hover:text-white'
                  ]"
                  :title="isPinned ? 'Shelf is pinned open. Click to unpin' : 'Pin shelf open'"
                >
                  {{ isPinned ? 'Pinned' : 'Pin' }}
                </button>
              </div>
            </div>

            <!-- Shelf Body Views -->
            <div class="pt-4 min-h-[160px]">
              <!-- 1. Media Dashboard -->
              <div v-if="activeTab === 'dashboard'" class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-card to-cyber-border flex items-center justify-center border border-cyber-border/80 shadow-md">
                    <Music class="w-6 h-6 text-cyber-mint" />
                  </div>
                  <div class="flex-1 min-w-0 text-left">
                    <h4 class="text-sm font-bold text-white truncate">Resonance (Odyssey VIP)</h4>
                    <p class="text-xs text-cyber-muted truncate">HOME — Electronic Synthwave</p>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button class="p-1.5 rounded-lg hover:bg-cyber-card text-cyber-muted hover:text-white">
                      <SkipBack class="w-4 h-4" />
                    </button>
                    <button 
                      @click="isPlaying = !isPlaying"
                      class="p-2 rounded-xl bg-cyber-mint text-[#080B10] hover:bg-cyber-mint/90 transition-transform active:scale-95 shadow-glow-mint/50"
                    >
                      <Pause v-if="isPlaying" class="w-4 h-4" />
                      <Play v-else class="w-4 h-4 fill-current" />
                    </button>
                    <button class="p-1.5 rounded-lg hover:bg-cyber-card text-cyber-muted hover:text-white">
                      <SkipForward class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Interactive Scrubber bar -->
                <div class="space-y-1">
                  <div 
                    @click="scrub"
                    class="w-full bg-cyber-border/70 rounded-full h-2 overflow-hidden cursor-pointer hover:h-2.5 transition-all"
                    title="Click to seek"
                  >
                    <div class="bg-gradient-to-r from-cyber-mint to-cyber-teal h-full rounded-full transition-all duration-150" :style="{ width: `${playbackProgress}%` }"></div>
                  </div>
                  <div class="flex justify-between text-[10px] font-mono text-cyber-muted">
                    <span>1:28</span>
                    <span>3:32</span>
                  </div>
                </div>
              </div>

              <!-- 2. Drops View -->
              <div v-else-if="activeTab === 'drops'" class="space-y-2">
                <div class="border border-dashed border-cyber-border/90 rounded-xl p-3 text-center text-xs text-cyber-muted hover:border-cyber-mint/50 transition-colors cursor-pointer bg-cyber-card/30">
                  <span class="text-cyber-mint font-medium">+ Drop files here</span> to stage across workspaces
                </div>
                <div class="space-y-1.5 max-h-[110px] overflow-y-auto">
                  <div v-for="f in dropFiles" :key="f.name" class="flex items-center justify-between p-2 rounded-lg bg-cyber-card/60 text-xs text-cyber-bright border border-cyber-border/50">
                    <span class="truncate font-mono">{{ f.name }}</span>
                    <span class="text-[10px] text-cyber-muted font-mono">{{ f.size }}</span>
                  </div>
                </div>
              </div>

              <!-- 3. Clipboard View -->
              <div v-else-if="activeTab === 'clipboard'" class="space-y-1.5">
                <div 
                  v-for="item in clipItems" 
                  :key="item.id" 
                  @click="copyText(item.text)"
                  class="p-2.5 rounded-lg bg-cyber-card/80 border border-cyber-border/60 hover:border-cyber-mint/40 flex items-center justify-between group transition-all cursor-pointer"
                >
                  <span class="text-xs font-mono truncate text-left text-cyber-bright">{{ item.text }}</span>
                  <span class="text-[10px] text-cyber-muted group-hover:text-cyber-mint shrink-0 ml-2 font-medium">Click to copy</span>
                </div>
              </div>

              <!-- 4. Focus / Pomodoro View -->
              <div v-else-if="activeTab === 'pomodoro'" class="text-center py-2 space-y-3">
                <div class="text-3xl font-mono font-extrabold text-white tracking-widest text-shadow">
                  {{ Math.floor(pomodoroSeconds / 60) }}:{{ (pomodoroSeconds % 60).toString().padStart(2, '0') }}
                </div>
                <div class="flex justify-center gap-2">
                  <button 
                    @click="togglePomo"
                    class="px-5 py-1.5 rounded-lg bg-cyber-mint text-[#080B10] text-xs font-bold hover:bg-cyber-mint/90 shadow-glow-mint/40 active:scale-95 transition-all"
                  >
                    {{ isPomoRunning ? 'Pause' : 'Start Focus' }}
                  </button>
                  <button 
                    @click="resetPomo"
                    class="px-4 py-1.5 rounded-lg border border-cyber-border text-xs text-cyber-muted hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <!-- 5. Notes View -->
              <div v-else-if="activeTab === 'notes'" class="space-y-1">
                <textarea 
                  v-model="noteText"
                  rows="4"
                  class="w-full bg-cyber-card/70 border border-cyber-border/80 rounded-xl p-2.5 text-xs font-mono text-cyber-bright focus:outline-none focus:border-cyber-mint/60 resize-none"
                  placeholder="Scratchpad for temporary thoughts..."
                ></textarea>
              </div>

              <!-- 6. Settings View -->
              <div v-else-if="activeTab === 'settings'" class="space-y-3 text-left">
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-cyber-card/60 border border-cyber-border/60">
                  <div>
                    <h5 class="text-xs font-semibold text-white">Start at Login</h5>
                    <p class="text-[10px] text-cyber-muted">Launch OpenNotch automatically on boot</p>
                  </div>
                  <div 
                    @click="autostartActive = !autostartActive"
                    :class="['w-9 h-5 rounded-full border transition-colors relative cursor-pointer', autostartActive ? 'bg-cyber-mint/30 border-cyber-mint' : 'bg-cyber-border/40 border-cyber-border']"
                  >
                    <div :class="['w-4 h-4 rounded-full bg-cyber-mint absolute top-0.5 transition-all', autostartActive ? 'right-0.5' : 'left-0.5 bg-cyber-muted']"></div>
                  </div>
                </div>

                <div class="flex items-center justify-between p-2.5 rounded-xl bg-cyber-card/60 border border-cyber-border/60">
                  <div>
                    <h5 class="text-xs font-semibold text-white">Software Updates</h5>
                    <p class="text-[10px] text-cyber-mint font-medium">v0.2.0 • Up to date</p>
                  </div>
                  <button 
                    @click="simulateUpdateCheck"
                    class="px-3 py-1 rounded-lg text-xs font-semibold bg-cyber-border/80 hover:bg-cyber-border text-white transition-colors"
                  >
                    <span v-if="updateStatus === 'checking'">Checking...</span>
                    <span v-else>Check Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulated Desktop Workspace (Wallpaper) -->
        <div class="flex-1 desktop-wallpaper cyber-grid flex flex-col items-center justify-center p-8 text-center min-h-[460px]">
          <div class="max-w-md space-y-3 mt-16">
            <img src="/otty.png" alt="Otty" class="w-16 h-16 mx-auto rounded-2xl opacity-75 shadow-glow-mint/30" />
            <h3 class="text-sm font-semibold text-white">Simulated Linux Desktop</h3>
            <p class="text-xs text-cyber-muted">
              Hover over the top notch pill to see the shelf slide down beneath it, or pin it open while testing.
            </p>
            <div class="pt-2 flex items-center justify-center gap-2">
              <button 
                @click="isPinned = !isPinned" 
                :class="[
                  'text-xs px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-medium',
                  isPinned 
                    ? 'bg-cyber-mint/20 border-cyber-mint text-cyber-mint shadow-glow-mint/30' 
                    : 'bg-cyber-card border-cyber-border text-cyber-muted hover:text-white hover:border-cyber-mint/40'
                ]"
              >
                <span>{{ isPinned ? 'Shelf Pinned Open' : 'Click to Pin Open' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Grid Features Section -->
    <section id="features" class="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs font-semibold text-cyber-teal font-mono mb-3">
          <Sparkles class="w-3.5 h-3.5" />
          <span>CAPABILITIES & ARCHITECTURE</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">Engineered for Linux Power Users</h2>
        <p class="mt-3 text-base text-cyber-muted max-w-2xl mx-auto">
          Combining the fluidity of modern hardware interfaces with standard Unix conventions and desktop protocols.
        </p>
      </div>

      <!-- Modern Bento Grid (Asymmetrical Layout) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Bento Card 1 (Wide 2-Columns): MPRIS Media Control -->
        <div class="md:col-span-2 glow-card p-8 rounded-3xl space-y-4 text-left">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-cyber-mint/10 border border-cyber-mint/30 flex items-center justify-center text-cyber-mint">
              <Music class="w-6 h-6" />
            </div>
            <span class="text-xs font-mono px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-cyber-muted font-medium">Standard D-Bus MPRIS</span>
          </div>
          <h3 class="text-xl font-bold text-white">Universal MPRIS Media Controller</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Directly queries the Linux D-Bus session bus to connect seamlessly with Spotify, Firefox, Google Chrome, Brave, VLC, and local players. Displays album cover art, live scrubbers, and responsive play/pause/skip actions.
          </p>
          <div class="pt-2 flex items-center gap-2 text-xs font-mono text-cyber-mint">
            <span>org.mpris.MediaPlayer2</span>
            <span>•</span>
            <span>Real-time track scrubber</span>
          </div>
        </div>

        <!-- Bento Card 2 (1-Column): In-App Update Engine -->
        <div class="glow-card p-8 rounded-3xl space-y-4 text-left">
          <div class="w-12 h-12 rounded-2xl bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal">
            <RefreshCw class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-white">In-App Update Engine</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Checks GitHub's public releases API daily in the background. Get clean release notes and one-click `.deb` download links directly inside your settings.
          </p>
          <div class="text-xs font-mono text-cyber-teal">
            <span>v0.2.0 SemVer Engine</span>
          </div>
        </div>

        <!-- Bento Card 3 (1-Column): Drop Shelf & Staging -->
        <div class="glow-card p-8 rounded-3xl space-y-4 text-left">
          <div class="w-12 h-12 rounded-2xl bg-cyber-mint/10 border border-cyber-mint/30 flex items-center justify-center text-cyber-mint">
            <Layers class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-white">File Drop Shelf</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Drag files to the notch to stage them while switching between workspaces, then drag them into emails, chats, or folders without window clutter.
          </p>
        </div>

        <!-- Bento Card 4 (2-Columns): Wayland & X11 Native Integration -->
        <div class="md:col-span-2 glow-card p-8 rounded-3xl space-y-4 text-left">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal">
              <Monitor class="w-6 h-6" />
            </div>
            <span class="text-xs font-mono px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-cyber-muted font-medium">Wayland + X11 Dual Protocol</span>
          </div>
          <h3 class="text-xl font-bold text-white">Wayland & X11 Native Layering</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Operates natively via <code class="text-cyber-mint">gtk4-layer-shell</code> overlay protocol on modern Wayland compositors (Hyprland, Sway, River) while falling back cleanly to standard EWMH dock hints on X11 / XWayland (GNOME, XFCE, i3).
          </p>
          <div class="pt-2 flex flex-wrap gap-2 text-xs font-mono text-cyber-muted">
            <span class="px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-cyber-bright">wlr-layer-shell top layer</span>
            <span class="px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-cyber-bright">_NET_WM_WINDOW_TYPE_DOCK</span>
          </div>
        </div>

        <!-- Bento Card 5 (Full-Width 3-Columns Spotlight): Local-First Architecture -->
        <div class="md:col-span-3 glow-card p-8 sm:p-10 rounded-3xl relative overflow-hidden group">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div class="space-y-3 max-w-xl text-left">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-mint/10 border border-cyber-mint/30 text-xs font-semibold text-cyber-mint font-mono">
                <HardDrive class="w-3.5 h-3.5" />
                <span>LOCAL-FIRST BY DESIGN</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your Desktop. Your Files. Zero Cloud Lock-In.</h3>
              <p class="text-sm text-cyber-muted leading-relaxed">
                OpenNotch is engineered around the principle that desktop utilities should be 100% offline, privacy-focused, and instant. No external accounts, no cloud sync lock-in, and zero background analytics or tracking.
              </p>
            </div>

            <!-- Pillars Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:w-auto shrink-0 text-left">
              <div class="p-3.5 rounded-2xl bg-[#090D14]/90 border border-cyber-border/70 flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyber-mint/10 text-cyber-mint shrink-0 mt-0.5">
                  <WifiOff class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">100% Offline Capable</h4>
                  <p class="text-[11px] text-cyber-muted mt-0.5">Operates with zero internet connection or remote servers.</p>
                </div>
              </div>

              <div class="p-3.5 rounded-2xl bg-[#090D14]/90 border border-cyber-border/70 flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyber-teal/10 text-cyber-teal shrink-0 mt-0.5">
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Zero Telemetry</h4>
                  <p class="text-[11px] text-cyber-muted mt-0.5">No metrics, tracking cookies, or data collection of any kind.</p>
                </div>
              </div>

              <div class="p-3.5 rounded-2xl bg-[#090D14]/90 border border-cyber-border/70 flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyber-teal/10 text-cyber-teal shrink-0 mt-0.5">
                  <Database class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Plain Files & D-Bus</h4>
                  <p class="text-[11px] text-cyber-muted mt-0.5">Stored locally in standard paths like <code class="text-cyber-mint">~/.config/open-notch</code>.</p>
                </div>
              </div>

              <div class="p-3.5 rounded-2xl bg-[#090D14]/90 border border-cyber-border/70 flex items-start gap-3">
                <div class="p-2 rounded-xl bg-cyber-mint/10 text-cyber-mint shrink-0 mt-0.5">
                  <Zap class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Sub-Millisecond Speed</h4>
                  <p class="text-[11px] text-cyber-muted mt-0.5">Native compiled Rust with zero web-engine or cloud latency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Installation Section -->
    <section id="install" class="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24">
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs font-semibold text-cyber-mint font-mono mb-2">
          <Terminal class="w-3.5 h-3.5" />
          <span>EASY DISTRIBUTION</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Install OpenNotch</h2>
        <p class="text-sm text-cyber-muted mt-2">Get up and running in under a minute with pre-built packages or compile from source.</p>
      </div>

      <!-- Installation Tab Switcher -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-cyber-border space-y-6">
        <div class="flex items-center gap-2 border-b border-cyber-border/80 pb-4 overflow-x-auto">
          <button 
            @click="installTab = 'deb'"
            :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2', installTab === 'deb' ? 'bg-cyber-mint text-[#080B10] shadow-glow-mint/40' : 'text-cyber-muted hover:text-white hover:bg-cyber-card']"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Debian Package (.deb)</span>
          </button>
          <button 
            @click="installTab = 'source'"
            :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2', installTab === 'source' ? 'bg-cyber-mint text-[#080B10] shadow-glow-mint/40' : 'text-cyber-muted hover:text-white hover:bg-cyber-card']"
          >
            <Terminal class="w-3.5 h-3.5" />
            <span>Build from Source (make)</span>
          </button>
          <button 
            @click="installTab = 'systemd'"
            :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2', installTab === 'systemd' ? 'bg-cyber-mint text-[#080B10] shadow-glow-mint/40' : 'text-cyber-muted hover:text-white hover:bg-cyber-card']"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            <span>Systemd Service</span>
          </button>
        </div>

        <!-- Tab 1: Debian Package -->
        <div v-if="installTab === 'deb'" class="space-y-3 text-left">
          <p class="text-xs text-cyber-muted">Recommended for Ubuntu, Debian, Zorin OS, and Linux Mint.</p>
          <div class="bg-[#05070A] p-4 rounded-2xl border border-cyber-border/80 font-mono text-xs text-cyber-bright space-y-2 relative group">
            <button 
              @click="copyText('wget https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb && sudo apt install ./open-notch_0.2.0_amd64.deb')"
              class="absolute top-3 right-3 p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white transition-colors"
              title="Copy commands"
            >
              <Check v-if="copiedSnippet" class="w-4 h-4 text-cyber-mint" />
              <Copy v-else class="w-4 h-4" />
            </button>
            <div class="text-cyber-muted"># 1. Download v0.2.0 Debian package</div>
            <div class="text-cyber-mint">wget https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb</div>
            <div class="text-cyber-muted pt-2"># 2. Install package</div>
            <div class="text-cyber-bright">sudo apt install ./open-notch_0.2.0_amd64.deb</div>
          </div>
        </div>

        <!-- Tab 2: Build from Source -->
        <div v-else-if="installTab === 'source'" class="space-y-3 text-left">
          <p class="text-xs text-cyber-muted">Builds with Cargo and installs to <code class="text-cyber-mint">~/.local/bin/open-notch</code> without root permissions.</p>
          <div class="bg-[#05070A] p-4 rounded-2xl border border-cyber-border/80 font-mono text-xs text-cyber-bright space-y-2 relative group">
            <button 
              @click="copyText('git clone https://github.com/gagan-gv/open-notch.git && cd open-notch && make install-user')"
              class="absolute top-3 right-3 p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white transition-colors"
              title="Copy commands"
            >
              <Check v-if="copiedSnippet" class="w-4 h-4 text-cyber-mint" />
              <Copy v-else class="w-4 h-4" />
            </button>
            <div class="text-cyber-mint">git clone https://github.com/gagan-gv/open-notch.git</div>
            <div>cd open-notch && make install-user</div>
            <div class="text-cyber-muted pt-1"># Installed to ~/.local/bin/open-notch</div>
          </div>
        </div>

        <!-- Tab 3: Systemd Service -->
        <div v-else-if="installTab === 'systemd'" class="space-y-3 text-left">
          <p class="text-xs text-cyber-muted">Enable background autostart across your user sessions.</p>
          <div class="bg-[#05070A] p-4 rounded-2xl border border-cyber-border/80 font-mono text-xs text-cyber-bright space-y-2 relative group">
            <button 
              @click="copyText('systemctl --user enable --now open-notch.service')"
              class="absolute top-3 right-3 p-2 rounded-lg bg-cyber-card border border-cyber-border text-cyber-muted hover:text-white transition-colors"
              title="Copy command"
            >
              <Check v-if="copiedSnippet" class="w-4 h-4 text-cyber-mint" />
              <Copy v-else class="w-4 h-4" />
            </button>
            <div class="text-cyber-mint">systemctl --user enable --now open-notch.service</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Frequently Asked Questions Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs font-semibold text-cyber-mint font-mono mb-4">
          <HelpCircle class="w-3.5 h-3.5" />
          <span>QUESTIONS & ANSWERS</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
        <p class="text-sm text-cyber-muted mt-2">Everything you need to know about OpenNotch, privacy, and compatibility.</p>
      </div>

      <div class="space-y-3.5">
        <div 
          v-for="(faq, idx) in faqs" 
          :key="faq.q"
          class="glass-panel rounded-2xl border border-cyber-border/80 overflow-hidden transition-all duration-200"
          :class="{ 'border-cyber-mint/40 bg-cyber-card/90 shadow-glow-mint/10': faq.open }"
        >
          <button 
            @click="toggleFaq(idx)"
            class="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-base text-white hover:text-cyber-mint transition-colors"
          >
            <span>{{ faq.q }}</span>
            <ChevronDown 
              class="w-5 h-5 text-cyber-muted transition-transform duration-200 shrink-0" 
              :class="{ 'rotate-180 text-cyber-mint': faq.open }"
            />
          </button>
          
          <div 
            v-if="faq.open"
            class="px-5 pb-5 text-sm text-cyber-muted leading-relaxed border-t border-cyber-border/40 pt-3 text-left"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-cyber-border/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-cyber-muted gap-4">
      <div class="flex items-center gap-3">
        <img src="/otty.png" alt="Otty" class="w-6 h-6 rounded-md" />
        <span>OpenNotch is open-source software licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" class="text-cyber-mint hover:underline">MIT License</a>.</span>
      </div>

      <div class="flex items-center gap-6">
        <a href="https://github.com/gagan-gv/open-notch" target="_blank" class="hover:text-cyber-mint transition-colors flex items-center gap-1">
          <Github class="w-4 h-4" />
          <span>GitHub</span>
        </a>
        <a href="https://github.com/gagan-gv/open-notch/releases" target="_blank" class="hover:text-cyber-mint transition-colors flex items-center gap-1">
          <ExternalLink class="w-4 h-4" />
          <span>Releases</span>
        </a>
      </div>
    </footer>
  </div>
</template>
