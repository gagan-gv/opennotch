<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Play, Pause, SkipForward, SkipBack, Music, 
  Clock, FileText, Settings, Download, Github, 
  ExternalLink, Check, Copy, Layers, Shield, RefreshCw, 
  Sparkles, Monitor
} from 'lucide-vue-next'

// State for interactive simulator
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
  }, 280) // 280ms leave debounce, matching Linux app's leave_debounce_ms
}

const activeTab = ref<'dashboard' | 'drops' | 'clipboard' | 'pomodoro' | 'notes' | 'settings'>('dashboard')
const isPlaying = ref(true)
const playbackProgress = ref(42)
const pomodoroSeconds = ref(25 * 60)
const isPomoRunning = ref(false)
const copiedSnippet = ref(false)
const updateStatus = ref<'idle' | 'checking' | 'latest'>('latest')
const noteText = ref('Meeting notes with core team:\n- Finalize OpenNotch v0.2.0\n- Launch web presence\n- Review Wayland layer-shell PR')

// Clipboard mock items
const clipItems = ref([
  { id: 1, text: 'sudo apt install ./open-notch_0.2.0_amd64.deb', time: '2m ago' },
  { id: 2, text: 'https://github.com/gagan-gv/open-notch', time: '14m ago' },
  { id: 3, text: 'CARGO_PKG_VERSION=0.2.0', time: '1h ago' }
])

// Drop shelf mock items
const dropFiles = ref([
  { name: 'otty_mascot_contour.svg', size: '14.2 KB', type: 'vector' },
  { name: 'release_v0.2.0_amd64.deb', size: '4.8 MB', type: 'package' },
  { name: 'wayland_spec.pdf', size: '320 KB', type: 'document' }
])

function copyText(txt: string) {
  navigator.clipboard.writeText(txt)
  copiedSnippet.value = true
  setTimeout(() => copiedSnippet.value = false, 2000)
}

function simulateUpdateCheck() {
  updateStatus.value = 'checking'
  setTimeout(() => {
    updateStatus.value = 'latest'
  }, 1200)
}
</script>

<template>
  <div class="min-h-screen bg-cyber-canvas text-cyber-bright font-sans relative">
    <!-- Ambient background neon glows (safely clipped so sticky navbar works) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyber-mint/10 blur-[130px] rounded-full"></div>
      <div class="absolute top-96 right-10 w-[450px] h-[450px] bg-cyber-teal/10 blur-[150px] rounded-full"></div>
    </div>

    <!-- Navigation Bar -->
    <header class="border-b border-cyber-border/80 sticky top-0 z-50 backdrop-blur-xl bg-cyber-canvas/90 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img src="/otty.png" alt="OpenNotch Mascot Otty" class="w-9 h-9 rounded-lg border border-cyber-mint/30 shadow-glow-mint/40" />
          <span class="font-bold text-lg tracking-tight text-white flex items-center gap-2">
            OpenNotch
          </span>
        </div>

        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-cyber-muted">
          <a href="#simulator" class="hover:text-cyber-mint transition-colors">Interactive Demo</a>
          <a href="#features" class="hover:text-cyber-mint transition-colors">Features</a>
          <a href="#install" class="hover:text-cyber-mint transition-colors">Install</a>
        </nav>

        <div class="flex items-center space-x-3">
          <a 
            href="https://github.com/gagan-gv/open-notch" 
            target="_blank"
            class="p-2 rounded-lg border border-cyber-border hover:border-cyber-mint/50 hover:bg-cyber-card transition-all text-cyber-muted hover:text-white"
            title="GitHub Repository"
          >
            <Github class="w-5 h-5" />
          </a>
          <a 
            href="#install" 
            class="px-4 py-2 rounded-lg bg-cyber-mint text-cyber-canvas font-semibold text-sm hover:bg-cyber-mint/90 transition-all shadow-glow-mint flex items-center gap-2"
          >
            <Download class="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-card border border-cyber-border text-xs font-medium text-cyber-muted mb-8">
        <Sparkles class="w-3.5 h-3.5 text-cyber-mint" />
        <span>Meet <b>Otty the River Otter</b> — New mascot & v0.2.0 release</span>
      </div>

      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
        The Fluid, Dynamic Notch for <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-mint via-teal-300 to-cyber-teal">Linux Desktops</span>
      </h1>

      <p class="mt-6 text-lg sm:text-xl text-cyber-muted max-w-2xl mx-auto">
        Rests discreetly as a top-screen pill, expanding on hover into an all-in-one productivity shelf. Built with Rust, GTK4, and native MPRIS D-Bus integration.
      </p>

      <!-- Action Buttons -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a 
          href="https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb"
          class="px-6 py-3.5 rounded-xl bg-cyber-mint text-cyber-canvas font-bold text-base hover:bg-cyber-mint/90 transition-all shadow-glow-mint flex items-center gap-2.5"
        >
          <Download class="w-5 h-5" />
          <span>Download .deb (v0.2.0)</span>
        </a>

        <a 
          href="#simulator"
          class="px-6 py-3.5 rounded-xl bg-cyber-card border border-cyber-border text-white font-semibold text-base hover:border-cyber-mint/50 hover:bg-cyber-card/80 transition-all flex items-center gap-2"
        >
          <Monitor class="w-5 h-5 text-cyber-mint" />
          <span>Try Interactive Demo</span>
        </a>
      </div>

      <!-- Quick terminal snippet -->
      <div class="mt-8 max-w-xl mx-auto">
        <div class="glass-panel p-2.5 rounded-xl flex items-center justify-between font-mono text-xs text-cyber-muted border border-cyber-border">
          <div class="flex items-center gap-2 truncate pl-2">
            <span class="text-cyber-mint select-none">$</span>
            <span class="truncate">sudo apt install ./open-notch_0.2.0_amd64.deb</span>
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
        <h2 class="text-2xl sm:text-3xl font-bold text-white">Experience the Shelf Live</h2>
        <p class="text-sm text-cyber-muted mt-2">Hover over the notch pill at the top of the monitor to see the shelf slide down beneath it, just like on Linux.</p>
      </div>

      <!-- Desktop Shell Frame -->
      <div class="rounded-2xl border border-cyber-border/90 bg-[#070A0F] shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col select-none">
        <!-- Top Screen Bezel -->
        <div class="h-8 bg-[#0a0f16] border-b border-cyber-border/40 flex items-center justify-between px-4 text-xs font-mono text-cyber-muted/70 relative z-20">
          <div class="flex items-center gap-3">
            <span class="text-white font-sans font-medium text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyber-mint"></span>
              Activities
            </span>
            <span class="hidden sm:inline">Files</span>
            <span class="hidden sm:inline">Terminal</span>
          </div>

          <div class="flex items-center gap-3">
            <span>Sun Nov 15</span>
            <span class="text-white font-semibold">16:30</span>
          </div>
        </div>

        <!-- Top Bezel Center Anchor for OpenNotch -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
          <!-- 1. The Notch Pill (ALWAYS VISIBLE at the top edge!) -->
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
            <!-- Left: Audio waveform visualization -->
            <div class="flex items-end gap-0.5 h-3">
              <span class="w-0.5 bg-cyber-mint rounded-full animate-pulse h-2"></span>
              <span class="w-0.5 bg-cyber-mint rounded-full animate-pulse h-3" style="animation-delay: 150ms"></span>
              <span class="w-0.5 bg-cyber-mint rounded-full animate-pulse h-1.5" style="animation-delay: 300ms"></span>
            </div>

            <!-- Center: Hardware Camera Lens with Emerald Privacy Dot -->
            <div class="flex items-center justify-center">
              <div class="w-3.5 h-3.5 rounded-full bg-[#11161F] border border-[#212B36] flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-cyber-mint shadow-[0_0_5px_#00FF9D]"></div>
              </div>
            </div>

            <!-- Right: Battery & Status -->
            <div class="flex items-center gap-1 text-[11px] font-mono text-cyber-muted">
              <span class="text-white font-medium">98%</span>
            </div>
          </div>

          <!-- 2. The Sliding Drop-Down Box (Shelf) -->
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

              <!-- Right controls: Settings & Pin -->
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
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-card to-cyber-border flex items-center justify-center border border-cyber-border/80">
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
                      class="p-2 rounded-xl bg-cyber-mint text-cyber-canvas hover:bg-cyber-mint/90 transition-transform active:scale-95 shadow-glow-mint/50"
                    >
                      <Pause v-if="isPlaying" class="w-4 h-4" />
                      <Play v-else class="w-4 h-4 fill-current" />
                    </button>
                    <button class="p-1.5 rounded-lg hover:bg-cyber-card text-cyber-muted hover:text-white">
                      <SkipForward class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Scrubber bar -->
                <div class="space-y-1">
                  <div class="w-full bg-cyber-border/70 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-gradient-to-r from-cyber-mint to-cyber-teal h-full rounded-full transition-all duration-300" :style="{ width: `${playbackProgress}%` }"></div>
                  </div>
                  <div class="flex justify-between text-[10px] font-mono text-cyber-muted">
                    <span>1:28</span>
                    <span>3:32</span>
                  </div>
                </div>
              </div>

              <!-- 2. Drops View -->
              <div v-else-if="activeTab === 'drops'" class="space-y-2">
                <div class="border border-dashed border-cyber-border/90 rounded-xl p-3 text-center text-xs text-cyber-muted hover:border-cyber-mint/50 transition-colors cursor-pointer">
                  <span class="text-cyber-mint font-medium">+ Drop files here</span> to stage for other apps
                </div>
                <div class="space-y-1 max-h-[110px] overflow-y-auto">
                  <div v-for="f in dropFiles" :key="f.name" class="flex items-center justify-between p-1.5 rounded-lg bg-cyber-card/60 text-xs text-cyber-bright border border-cyber-border/50">
                    <span class="truncate font-mono">{{ f.name }}</span>
                    <span class="text-[10px] text-cyber-muted">{{ f.size }}</span>
                  </div>
                </div>
              </div>

              <!-- 3. Clipboard View -->
              <div v-else-if="activeTab === 'clipboard'" class="space-y-1.5">
                <div v-for="item in clipItems" :key="item.id" class="p-2 rounded-lg bg-cyber-card/80 border border-cyber-border/60 hover:border-cyber-mint/40 flex items-center justify-between group transition-all">
                  <span class="text-xs font-mono truncate text-left text-cyber-bright">{{ item.text }}</span>
                  <span class="text-[10px] text-cyber-muted group-hover:text-cyber-mint shrink-0 ml-2">Click to copy</span>
                </div>
              </div>

              <!-- 4. Focus / Pomodoro View -->
              <div v-else-if="activeTab === 'pomodoro'" class="text-center py-2 space-y-3">
                <div class="text-3xl font-mono font-bold text-white tracking-widest">
                  {{ Math.floor(pomodoroSeconds / 60) }}:{{ (pomodoroSeconds % 60).toString().padStart(2, '0') }}
                </div>
                <div class="flex justify-center gap-2">
                  <button 
                    @click="isPomoRunning = !isPomoRunning"
                    class="px-4 py-1 rounded-lg bg-cyber-mint text-cyber-canvas text-xs font-bold hover:bg-cyber-mint/90 shadow-glow-mint/40"
                  >
                    {{ isPomoRunning ? 'Pause' : 'Start Focus' }}
                  </button>
                  <button 
                    @click="pomodoroSeconds = 25 * 60; isPomoRunning = false"
                    class="px-3 py-1 rounded-lg border border-cyber-border text-xs text-cyber-muted hover:text-white"
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
                  class="w-full bg-cyber-card/70 border border-cyber-border/80 rounded-lg p-2 text-xs font-mono text-cyber-bright focus:outline-none focus:border-cyber-mint/60 resize-none"
                  placeholder="Scratchpad for temporary thoughts..."
                ></textarea>
              </div>

              <!-- 6. Settings View -->
              <div v-else-if="activeTab === 'settings'" class="space-y-3 text-left">
                <div class="flex items-center justify-between p-2 rounded-lg bg-cyber-card/60 border border-cyber-border/60">
                  <div>
                    <h5 class="text-xs font-semibold text-white">Start at Login</h5>
                    <p class="text-[10px] text-cyber-muted">Launch OpenNotch automatically on boot</p>
                  </div>
                  <div class="w-8 h-4 rounded-full bg-cyber-mint/30 border border-cyber-mint relative cursor-pointer">
                    <div class="w-3.5 h-3.5 rounded-full bg-cyber-mint absolute top-0 right-0"></div>
                  </div>
                </div>

                <div class="flex items-center justify-between p-2 rounded-lg bg-cyber-card/60 border border-cyber-border/60">
                  <div>
                    <h5 class="text-xs font-semibold text-white">Software Updates</h5>
                    <p class="text-[10px] text-cyber-mint font-medium">v0.2.0 • Up to date</p>
                  </div>
                  <button 
                    @click="simulateUpdateCheck"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyber-border/80 hover:bg-cyber-border text-white transition-colors"
                  >
                    <span v-if="updateStatus === 'checking'">Checking...</span>
                    <span v-else>Check Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulated Desktop Workspace -->
        <div class="flex-1 cyber-grid flex flex-col items-center justify-center p-8 text-center min-h-[460px]">
          <div class="max-w-md space-y-3 mt-16">
            <img src="/otty.png" alt="Otty" class="w-16 h-16 mx-auto rounded-2xl opacity-75 shadow-glow-mint/30" />
            <h3 class="text-sm font-semibold text-white">Simulated Linux Desktop</h3>
            <p class="text-xs text-cyber-muted">
              Hover over the notch pill at the very top of the display to slide the shelf down smoothly beneath it.
            </p>
            <div class="pt-2 flex items-center justify-center gap-2">
              <button 
                @click="isPinned = !isPinned" 
                :class="[
                  'text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium',
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
    <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div class="text-center mb-14">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Designed for Linux Power Users</h2>
        <p class="mt-3 text-base text-cyber-muted max-w-2xl mx-auto">
          Combining the fluidity of modern hardware interfaces with standard Unix conventions and desktop protocols.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card 1: In-App Updates -->
        <div class="glass-panel p-6 rounded-2xl border border-cyber-border/80 hover:border-cyber-mint/40 transition-all space-y-3">
          <div class="w-10 h-10 rounded-xl bg-cyber-mint/10 border border-cyber-mint/30 flex items-center justify-center text-cyber-mint">
            <RefreshCw class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-white">In-App Update Engine</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Automatic background release checks via GitHub's API. Receive instant notification badges, changelogs, and one-click `.deb` download links right in your settings.
          </p>
        </div>

        <!-- Card 2: MPRIS Media Control -->
        <div class="glass-panel p-6 rounded-2xl border border-cyber-border/80 hover:border-cyber-mint/40 transition-all space-y-3">
          <div class="w-10 h-10 rounded-xl bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal">
            <Music class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-white">Universal MPRIS Integration</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Seamlessly connects to Spotify, web browsers, VLC, and local players using standard Linux D-Bus protocols. Displays track art, controls, and live scrubbers.
          </p>
        </div>

        <!-- Card 3: Drop Shelf & Clipboard -->
        <div class="glass-panel p-6 rounded-2xl border border-cyber-border/80 hover:border-cyber-mint/40 transition-all space-y-3">
          <div class="w-10 h-10 rounded-xl bg-cyber-mint/10 border border-cyber-mint/30 flex items-center justify-center text-cyber-mint">
            <Layers class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-white">Drop Shelf & Clipboard</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Drag files to the notch to stage them while switching workspaces, or quickly retrieve recently copied text snippets without a full-blown clipboard app.
          </p>
        </div>

        <!-- Card 4: Wayland & X11 -->
        <div class="glass-panel p-6 rounded-2xl border border-cyber-border/80 hover:border-cyber-mint/40 transition-all space-y-3">
          <div class="w-10 h-10 rounded-xl bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal">
            <Monitor class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-white">Wayland & X11 Native</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Supports `gtk4-layer-shell` overlays on Wayland compositors (Hyprland, Sway) and standard EWMH dock hints on X11 / XWayland (GNOME, XFCE, i3).
          </p>
        </div>

        <!-- Card 5: Focus & Pomodoro -->
        <div class="glass-panel p-6 rounded-2xl border border-cyber-border/80 hover:border-cyber-mint/40 transition-all space-y-3">
          <div class="w-10 h-10 rounded-xl bg-cyber-mint/10 border border-cyber-mint/30 flex items-center justify-center text-cyber-mint">
            <Clock class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-white">Productivity Timers</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            An unobtrusive focus and pomodoro interval timer that counts down from the top edge of your screen, helping you maintain deep work sessions.
          </p>
        </div>

        <!-- Card 6: Mascot & Open Source -->
        <div class="glass-panel p-6 rounded-2xl border border-cyber-border/80 hover:border-cyber-mint/40 transition-all space-y-3">
          <div class="w-10 h-10 rounded-xl bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal">
            <Shield class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-white">100% Free & Open Source</h3>
          <p class="text-sm text-cyber-muted leading-relaxed">
            Released under the permissive MIT license. Complete with vector FreeDesktop standard icons, systemd user services, and no tracking or telemetry.
          </p>
        </div>
      </div>
    </section>

    <!-- Installation Section -->
    <section id="install" class="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-extrabold text-white">Install OpenNotch</h2>
        <p class="text-sm text-cyber-muted mt-2">Choose your preferred installation method below.</p>
      </div>

      <div class="glass-panel rounded-2xl p-6 sm:p-8 border border-cyber-border space-y-6">
        <div>
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-cyber-mint text-cyber-canvas text-xs flex items-center justify-center font-mono font-bold">1</span>
            Pre-Built Debian Package (.deb)
          </h3>
          <p class="text-xs text-cyber-muted mt-1 ml-8">Recommended for Ubuntu, Debian, Zorin OS, and Linux Mint.</p>

          <div class="mt-3 ml-8 bg-cyber-canvas p-3 rounded-xl border border-cyber-border font-mono text-xs text-cyber-bright space-y-1">
            <div class="text-cyber-muted"># Download and install v0.2.0 release</div>
            <div>wget https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb</div>
            <div>sudo apt install ./open-notch_0.2.0_amd64.deb</div>
          </div>
        </div>

        <div class="border-t border-cyber-border/70 pt-6">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-cyber-teal text-cyber-canvas text-xs flex items-center justify-center font-mono font-bold">2</span>
            User Installation from Source (No sudo)
          </h3>
          <p class="text-xs text-cyber-muted mt-1 ml-8">Builds and installs directly to <code class="text-cyber-mint">~/.local/bin/open-notch</code>.</p>

          <div class="mt-3 ml-8 bg-cyber-canvas p-3 rounded-xl border border-cyber-border font-mono text-xs text-cyber-bright space-y-1">
            <div>git clone https://github.com/gagan-gv/open-notch.git</div>
            <div>cd open-notch && make install-user</div>
          </div>
        </div>

        <div class="border-t border-cyber-border/70 pt-6">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-cyber-border text-cyber-muted text-xs flex items-center justify-center font-mono font-bold">3</span>
            Enable Background Autostart
          </h3>
          <div class="mt-3 ml-8 bg-cyber-canvas p-3 rounded-xl border border-cyber-border font-mono text-xs text-cyber-bright">
            <div>systemctl --user enable --now open-notch.service</div>
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
