<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Play, Pause, SkipForward, SkipBack, Music, 
  Clock, FileText, Settings, Download, Github, 
  ExternalLink, Check, Copy, Layers, RefreshCw, 
  Sparkles, Monitor, HardDrive, WifiOff, ShieldCheck, Database, Zap,
  ChevronDown, HelpCircle, Terminal, Volume2, Disc, Trash2, Plus,
  Radio, BatteryCharging
} from 'lucide-vue-next'

// Real-time clock for simulated top bar
const currentTime = ref('16:30')
let clockInterval: number | null = null

function updateClock() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

onMounted(() => {
  updateClock()
  clockInterval = window.setInterval(updateClock, 10000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

// Desktop Simulator Wallpaper Themes
const currentWallpaper = ref<'mint' | 'aurora' | 'minimal'>('mint')

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

// Simulator Notch Island Mode (what shows in the resting pill)
const notchMode = ref<'media' | 'focus' | 'privacy'>('media')

// Media Player Simulator
interface Song {
  title: string
  artist: string
  album: string
  durationSec: number
}

const playlist: Song[] = [
  { title: 'Resonance', artist: 'HOME', album: 'Odyssey VIP', durationSec: 212 },
  { title: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', durationSec: 259 },
  { title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', durationSec: 243 }
]

const currentTrackIndex = ref(0)
const currentSong = computed(() => playlist[currentTrackIndex.value])
const isPlaying = ref(true)
const currentSeconds = ref(88)

const playbackProgress = computed(() => {
  return Math.round((currentSeconds.value / currentSong.value.durationSec) * 100)
})

const formattedElapsed = computed(() => {
  const m = Math.floor(currentSeconds.value / 60)
  const s = (currentSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const formattedDuration = computed(() => {
  const m = Math.floor(currentSong.value.durationSec / 60)
  const s = (currentSong.value.durationSec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

let mediaTimer: number | null = null

function startMediaTimer() {
  if (mediaTimer) clearInterval(mediaTimer)
  mediaTimer = window.setInterval(() => {
    if (isPlaying.value) {
      if (currentSeconds.value < currentSong.value.durationSec) {
        currentSeconds.value++
      } else {
        nextTrack()
      }
    }
  }, 1000)
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function nextTrack() {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.length
  currentSeconds.value = 0
}

function prevTrack() {
  if (currentSeconds.value > 3) {
    currentSeconds.value = 0
  } else {
    currentTrackIndex.value = (currentTrackIndex.value - 1 + playlist.length) % playlist.length
    currentSeconds.value = 0
  }
}

function scrub(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, clickX / rect.width))
  currentSeconds.value = Math.round(ratio * currentSong.value.durationSec)
}

onMounted(() => {
  startMediaTimer()
})

onUnmounted(() => {
  if (mediaTimer) clearInterval(mediaTimer)
})

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

const formattedPomoTime = computed(() => {
  const m = Math.floor(pomodoroSeconds.value / 60)
  const s = (pomodoroSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

// Notes Simulator
const noteText = ref('Meeting notes with Linux team:\n- OpenNotch v0.2.0 released\n- Added Otty the River Otter mascot\n- Verified Wayland wlr-layer-shell protocol\n- Sub-4ms D-Bus latency achieved')

const noteStats = computed(() => {
  const words = noteText.value.trim() ? noteText.value.trim().split(/\s+/).length : 0
  return { words, chars: noteText.value.length }
})

// Clipboard Simulator
const clipItems = ref([
  { id: 1, text: 'sudo apt install ./open-notch_0.2.0_amd64.deb', time: '2m ago' },
  { id: 2, text: 'https://github.com/gagan-gv/open-notch', time: '14m ago' },
  { id: 3, text: 'CARGO_PKG_VERSION=0.2.0', time: '1h ago' }
])

// Drop Shelf Simulator
const dropFiles = ref([
  { id: 1, name: 'otty_mascot_contour.svg', size: '14.2 KB', type: 'vector' },
  { id: 2, name: 'open-notch_0.2.0_amd64.deb', size: '4.8 MB', type: 'package' },
  { id: 3, name: 'wayland_layer_spec.pdf', size: '320 KB', type: 'document' }
])

let fileSeed = 4
function addDemoFile() {
  const samples = [
    { name: `screenshot_${Date.now().toString().slice(-4)}.png`, size: '1.4 MB', type: 'image' },
    { name: 'config_backup.toml', size: '2.8 KB', type: 'code' },
    { name: 'hyprland_keybinds.conf', size: '8.1 KB', type: 'config' }
  ]
  const sample = samples[Math.floor(Math.random() * samples.length)]
  dropFiles.value.unshift({ id: fileSeed++, ...sample })
}

function removeFile(id: number) {
  dropFiles.value = dropFiles.value.filter(f => f.id !== id)
}

// Settings Simulator
const autostartActive = ref(true)
const soundEffectsActive = ref(false)
const updateStatus = ref<'idle' | 'checking' | 'latest'>('latest')

function simulateUpdateCheck() {
  updateStatus.value = 'checking'
  setTimeout(() => {
    updateStatus.value = 'latest'
    showToast('OpenNotch v0.2.0 is up to date!')
  }, 1200)
}

// Global Toast Notifications
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer: number | null = null

function showToast(msg: string) {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastVisible.value = false
  }, 2400)
}

// Clipboard copying helper
const copiedSnippet = ref(false)
function copyText(txt: string, label: string = 'Copied to clipboard!') {
  navigator.clipboard.writeText(txt)
  copiedSnippet.value = true
  showToast(label)
  setTimeout(() => copiedSnippet.value = false, 2000)
}

// Installation Snippets Tab
const installTab = ref<'deb' | 'source'>('deb')

// Interactive FAQ Accordion
const faqs = ref([
  {
    q: "Is OpenNotch completely free?",
    a: "Yes, 100% free for a lifetime under the permissive MIT open-source license. There are no subscriptions, no premium paywalls, and no hidden features.",
    open: true
  },
  {
    q: "Where is my data stored?",
    a: "Strictly and exclusively local on your machine. All your notes, clipboard items, drop shelf staging files, and user preferences remain inside your standard Linux directory (~/.config/open-notch/). Zero cloud servers, zero analytics, zero telemetry.",
    open: false
  },
  {
    q: "Does it support both Wayland and X11?",
    a: "Yes! OpenNotch supports modern Wayland compositors (Hyprland, Sway, River) using the native wlr-layer-shell protocol, as well as X11 / XWayland environments (GNOME, XFCE, i3, KWin) via standard EWMH dock hints.",
    open: false
  },
  {
    q: "How does it impact battery life and system performance?",
    a: "Virtually zero impact. Compiled in native Rust and GTK4 with no Electron or Chromium runtime, OpenNotch consumes under 25MB of RAM and stays completely dormant at 0% CPU until you hover over the top bezel.",
    open: false
  },
  {
    q: "How do I trigger OpenNotch with keyboard shortcuts?",
    a: "By default, simply hovering your cursor at the top screen edge opens the shelf. You can also bind any hotkey (e.g. Super + N or F12) in your compositor (Hyprland, Sway, or GNOME Keyboard Settings) to toggle OpenNotch instantly via CLI or D-Bus.",
    open: false
  },
  {
    q: "Which media players can I control?",
    a: "Any media player that adheres to the standard Linux MPRIS D-Bus specification. This includes Spotify, Firefox, Google Chrome, Brave, VLC, MPV, Rhythmbox, and local music daemons.",
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

// Mouse spotlight tracking for bento cards
function handleMouseMove(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<template>
  <div class="min-h-screen bg-[#07090E] text-cyber-bright font-sans relative selection:bg-cyber-mint/30 selection:text-cyber-mint">
    
    <!-- Horizon Light Beam Accent at the very top -->
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyber-mint/50 to-transparent z-50"></div>

    <!-- Ambient background neon glows safely clipped so sticky navbar functions -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-cyber-mint/10 blur-[150px] rounded-full"></div>
      <div class="absolute top-96 right-10 w-[550px] h-[550px] bg-cyber-teal/10 blur-[170px] rounded-full"></div>
      <div class="absolute top-[1300px] left-10 w-[650px] h-[650px] bg-cyber-mint/5 blur-[190px] rounded-full"></div>
      
      <!-- Subtle dot matrix pattern overlay -->
      <div class="absolute inset-0 cyber-dots opacity-40 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_60%,transparent_100%)]"></div>
    </div>

    <!-- Floating Toast Notification -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-3 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-2 opacity-0 scale-95"
    >
      <div 
        v-if="toastVisible" 
        class="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl glass-pill flex items-center gap-2.5 shadow-2xl text-xs font-medium text-white pointer-events-none"
      >
        <div class="w-2 h-2 rounded-full bg-cyber-mint animate-pulse"></div>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Navigation Bar (Sticky with glassmorphism blur) -->
    <header class="border-b border-white/[0.08] sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Logo & Mascot -->
        <a href="#" class="flex items-center space-x-3 group">
          <div class="relative">
            <img 
              src="/otty.png" 
              alt="OpenNotch Mascot Otty" 
              class="w-9 h-9 rounded-xl border border-cyber-mint/40 shadow-glow-mint/40 group-hover:scale-105 group-hover:border-cyber-mint transition-all" 
            />
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-cyber-mint rounded-full border-2 border-[#07090E]"></div>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-lg tracking-tight text-white group-hover:text-cyber-mint transition-colors">
              OpenNotch
            </span>
            <span class="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyber-mint/10 text-cyber-mint border border-cyber-mint/30">
              v0.2.0
            </span>
          </div>
        </a>

        <!-- Clean Navigation Links (Ordered: Interactive Demo, Features, Install) -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-cyber-muted">
          <a href="#simulator" class="hover:text-cyber-mint transition-colors flex items-center gap-2 py-1 relative group">
            <Monitor class="w-4 h-4 text-cyber-mint transition-transform group-hover:scale-110" />
            <span>Interactive Demo</span>
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-mint transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#features" class="hover:text-cyber-mint transition-colors flex items-center gap-2 py-1 relative group">
            <Sparkles class="w-4 h-4 text-cyber-teal transition-transform group-hover:scale-110" />
            <span>Features</span>
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-teal transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#install" class="hover:text-cyber-mint transition-colors flex items-center gap-2 py-1 relative group">
            <Terminal class="w-4 h-4 text-cyber-mint transition-transform group-hover:scale-110" />
            <span>Install</span>
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-mint transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        <!-- Right Side CTA Actions -->
        <div class="flex items-center space-x-3">
          <a 
            href="https://github.com/gagan-gv/open-notch" 
            target="_blank"
            class="px-3 py-1.5 rounded-xl border border-white/[0.1] hover:border-cyber-mint/50 hover:bg-white/[0.04] transition-all text-cyber-muted hover:text-white flex items-center gap-2 text-xs font-medium"
            title="Star OpenNotch on GitHub"
          >
            <Github class="w-4 h-4" />
            <span class="hidden sm:inline">Star on GitHub</span>
          </a>

          <a 
            href="https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb" 
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyber-mint to-teal-400 text-[#07090E] font-bold text-sm hover:opacity-95 transition-all shadow-glow-mint flex items-center gap-2 active:scale-95"
          >
            <Download class="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      
      <!-- Release Announcement Pill -->
      <a 
        href="https://github.com/gagan-gv/open-notch/releases/tag/v0.2.0" 
        target="_blank"
        class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyber-card/90 border border-white/[0.1] hover:border-cyber-mint/50 text-xs font-medium text-cyber-muted mb-8 transition-all hover:scale-105 shadow-sm group"
      >
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-mint opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-cyber-mint"></span>
        </span>
        <span class="text-white font-semibold">OpenNotch v0.2.0 is out!</span>
        <span class="text-cyber-muted group-hover:text-cyber-mint transition-colors">Featuring Otty mascot & In-app updates →</span>
      </a>

      <!-- Headline -->
      <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
        The Fluid, Dynamic Notch for <br class="hidden sm:inline"/>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-mint via-teal-300 to-cyber-teal">
          Linux Desktops
        </span>
      </h1>

      <p class="mt-6 text-lg sm:text-xl text-cyber-muted max-w-2xl mx-auto leading-relaxed">
        Resting discreetly as a top-screen pill, expanding on hover into an all-in-one productivity shelf. Built with native Rust, GTK4, and standard MPRIS D-Bus integration.
      </p>

      <!-- Architecture Pills Strip -->
      <div class="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono text-cyber-muted">
        <span class="px-3.5 py-1.5 rounded-full bg-cyber-card/90 border border-white/[0.08] text-cyber-bright flex items-center gap-1.5">
          <span>🦀</span>
          <span>100% Native Rust</span>
        </span>
        <span class="px-3.5 py-1.5 rounded-full bg-cyber-card/90 border border-white/[0.08] text-cyber-bright flex items-center gap-1.5">
          <span>⚡</span>
          <span>GTK4 Layer-Shell</span>
        </span>
        <span class="px-3.5 py-1.5 rounded-full bg-cyber-card/90 border border-white/[0.08] text-cyber-bright flex items-center gap-1.5">
          <span>🎧</span>
          <span>D-Bus MPRIS</span>
        </span>
        <span class="px-3.5 py-1.5 rounded-full bg-cyber-card/90 border border-white/[0.08] text-cyber-bright flex items-center gap-1.5">
          <span>📴</span>
          <span>100% Local-First</span>
        </span>
        <span class="px-3.5 py-1.5 rounded-full bg-cyber-card/90 border border-white/[0.08] text-cyber-bright flex items-center gap-1.5">
          <span>🚫</span>
          <span>Zero Electron</span>
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a 
          href="https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb"
          class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyber-mint to-teal-400 text-[#07090E] font-extrabold text-base hover:opacity-95 transition-all shadow-glow-mint flex items-center gap-2.5 active:scale-95"
        >
          <Download class="w-5 h-5" />
          <span>Download .deb (v0.2.0)</span>
        </a>

        <a 
          href="#simulator"
          class="px-8 py-3.5 rounded-xl bg-cyber-card/90 border border-white/[0.12] text-white font-bold text-base hover:border-cyber-mint/50 hover:bg-cyber-card transition-all flex items-center gap-2.5 active:scale-95 shadow-lg"
        >
          <Monitor class="w-5 h-5 text-cyber-mint" />
          <span>Try Interactive Demo</span>
        </a>
      </div>

      <!-- Quick Command Bar -->
      <div class="mt-8 max-w-lg mx-auto">
        <div class="glass-panel p-2 rounded-2xl flex items-center justify-between font-mono text-xs text-cyber-muted border border-white/[0.1]">
          <div class="flex items-center gap-2 truncate pl-2.5">
            <span class="text-cyber-mint select-none font-bold">$</span>
            <span class="truncate text-cyber-bright">sudo apt install ./open-notch_0.2.0_amd64.deb</span>
          </div>
          <button 
            @click="copyText('sudo apt install ./open-notch_0.2.0_amd64.deb', 'Debian command copied!')"
            class="p-2 rounded-xl hover:bg-white/[0.06] text-cyber-muted hover:text-white transition-colors shrink-0"
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
      
      <!-- Section Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-card border border-white/[0.1] text-xs font-semibold text-cyber-mint font-mono mb-2">
          <Monitor class="w-3.5 h-3.5" />
          <span>AUTHENTIC DESKTOP EXPERIENCE</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Experience the Shelf Live</h2>
        <p class="text-sm text-cyber-muted mt-2 max-w-xl mx-auto">
          Hover over the top notch pill to watch the shelf slide down beneath it. Click to pin it open, switch media tracks, drop simulated files, and test live local features.
        </p>

        <!-- Simulator Controls Bar: Island Mode & Wallpaper Switcher -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
          <!-- Notch Pill Mode Switcher -->
          <div class="inline-flex items-center p-1 rounded-xl glass-panel border border-white/[0.08]">
            <span class="text-[11px] font-mono text-cyber-muted px-2.5">Pill Preview:</span>
            <button 
              @click="notchMode = 'media'"
              :class="['px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5', notchMode === 'media' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
            >
              <Music class="w-3 h-3" />
              <span>Media</span>
            </button>
            <button 
              @click="notchMode = 'focus'"
              :class="['px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5', notchMode === 'focus' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
            >
              <Clock class="w-3 h-3" />
              <span>Focus</span>
            </button>
            <button 
              @click="notchMode = 'privacy'"
              :class="['px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5', notchMode === 'privacy' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
            >
              <Radio class="w-3 h-3" />
              <span>Privacy</span>
            </button>
          </div>

          <!-- Wallpaper Switcher -->
          <div class="inline-flex items-center p-1 rounded-xl glass-panel border border-white/[0.08]">
            <span class="text-[11px] font-mono text-cyber-muted px-2.5">Theme:</span>
            <button 
              @click="currentWallpaper = 'mint'"
              :class="['px-2.5 py-1 rounded-lg transition-all font-medium', currentWallpaper === 'mint' ? 'bg-cyber-mint/20 text-cyber-mint border border-cyber-mint/30' : 'text-cyber-muted hover:text-white']"
            >
              Cyber Mint
            </button>
            <button 
              @click="currentWallpaper = 'aurora'"
              :class="['px-2.5 py-1 rounded-lg transition-all font-medium', currentWallpaper === 'aurora' ? 'bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/30' : 'text-cyber-muted hover:text-white']"
            >
              Nordic Aurora
            </button>
            <button 
              @click="currentWallpaper = 'minimal'"
              :class="['px-2.5 py-1 rounded-lg transition-all font-medium', currentWallpaper === 'minimal' ? 'bg-white/[0.1] text-white border border-white/[0.2]' : 'text-cyber-muted hover:text-white']"
            >
              Minimal Dark
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Shell Frame (Curved Bezel Monitor Frame) -->
      <div class="rounded-3xl border border-white/[0.1] bg-[#07090E] shadow-2xl overflow-hidden relative min-h-[550px] flex flex-col select-none">
        
        <!-- Top Screen Bezel with GNOME / Wayland Status Bar -->
        <div class="h-8 bg-[#080B10] border-b border-white/[0.06] flex items-center justify-between px-4 text-xs font-mono text-cyber-muted relative z-20">
          <div class="flex items-center gap-3">
            <span class="text-white font-sans font-medium text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-cyber-mint shadow-[0_0_8px_#00FF9D]"></span>
              Activities
            </span>
            <span class="hidden sm:inline hover:text-white transition-colors cursor-pointer">Files</span>
            <span class="hidden sm:inline hover:text-white transition-colors cursor-pointer">Terminal</span>
          </div>

          <div class="flex items-center gap-3.5 text-xs">
            <span>Sun Nov 15</span>
            <span class="text-white font-semibold">{{ currentTime }}</span>
            <div class="flex items-center gap-2 text-cyber-muted">
              <Volume2 class="w-3.5 h-3.5 text-cyber-mint" />
              <span>98%</span>
              <BatteryCharging class="w-3.5 h-3.5 text-cyber-mint" />
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
              'h-7 px-4 rounded-b-2xl bg-[#05070A] border-x border-b transition-all duration-300 flex items-center justify-between cursor-pointer shadow-xl select-none pointer-events-auto',
              isExpanded 
                ? 'border-cyber-mint/70 shadow-glow-mint/30 w-[260px]' 
                : 'border-white/[0.12] hover:border-cyber-mint/60 w-[205px]'
            ]"
            title="Hover to slide shelf down, or click to pin open"
          >
            <!-- Mode A: Media Player Island -->
            <template v-if="notchMode === 'media'">
              <!-- Left: Live Rhythmic Audio Equalizer Bars -->
              <div class="flex items-end gap-1 h-3.5">
                <span :class="['w-0.5 bg-cyber-mint rounded-full', isPlaying ? 'anim-bar-1' : 'h-1.5']"></span>
                <span :class="['w-0.5 bg-cyber-mint rounded-full', isPlaying ? 'anim-bar-2' : 'h-2.5']"></span>
                <span :class="['w-0.5 bg-cyber-mint rounded-full', isPlaying ? 'anim-bar-3' : 'h-1']"></span>
                <span :class="['w-0.5 bg-cyber-mint rounded-full', isPlaying ? 'anim-bar-4' : 'h-2']"></span>
              </div>

              <!-- Center: Track name snippet or hardware camera -->
              <div class="flex items-center gap-1.5 text-[10px] font-mono text-white/90 truncate max-w-[95px]">
                <span class="truncate">{{ currentSong.title }}</span>
              </div>

              <!-- Right: Battery & Status -->
              <div class="flex items-center gap-1 text-[11px] font-mono text-cyber-muted">
                <span class="text-white font-medium">98%</span>
              </div>
            </template>

            <!-- Mode B: Focus / Pomodoro Island -->
            <template v-else-if="notchMode === 'focus'">
              <div class="flex items-center gap-1 text-cyber-mint">
                <Clock class="w-3 h-3 animate-spin" v-if="isPomoRunning" />
                <Clock class="w-3 h-3" v-else />
                <span class="text-[10px] font-mono font-bold">{{ formattedPomoTime }}</span>
              </div>
              <div class="text-[10px] font-mono text-cyber-muted">Focus</div>
              <div class="w-2 h-2 rounded-full bg-cyber-mint"></div>
            </template>

            <!-- Mode C: Hardware Privacy Island -->
            <template v-else>
              <div class="w-2 h-2 rounded-full bg-cyber-mint shadow-[0_0_8px_#00FF9D]"></div>
              <div class="text-[10px] font-mono text-white flex items-center gap-1">
                <span>Camera Active</span>
              </div>
              <div class="w-1.5 h-1.5 rounded-full bg-cyber-teal"></div>
            </template>
          </div>

          <!-- 2. The Sliding Drop-Down Box (Shelf) -->
          <!-- Slides down smoothly right beneath the top notch pill -->
          <div 
            @mouseenter="onNotchEnter"
            @mouseleave="onNotchLeave"
            :class="[
              'w-[520px] max-w-[92vw] glass-panel rounded-2xl border border-white/[0.12] p-4 shadow-2xl transition-all duration-300 transform origin-top mt-1.5 pointer-events-auto',
              isExpanded 
                ? 'translate-y-0 opacity-100 scale-100' 
                : '-translate-y-4 opacity-0 scale-95 !pointer-events-none'
            ]"
          >
            <!-- Shelf Top Navigation Strip -->
            <div class="flex items-center justify-between pb-3 border-b border-white/[0.08]">
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
                  <span class="w-4 h-4 rounded-full bg-cyber-card border border-white/[0.1] text-[10px] flex items-center justify-center font-mono">{{ dropFiles.length }}</span>
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
                    'text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-medium',
                    isPinned ? 'bg-cyber-mint/20 text-cyber-mint border-cyber-mint/50 shadow-glow-mint/30' : 'text-cyber-muted border-white/[0.1] hover:text-white'
                  ]"
                  :title="isPinned ? 'Shelf is pinned open. Click to unpin' : 'Pin shelf open'"
                >
                  <span>{{ isPinned ? 'Pinned' : 'Pin' }}</span>
                </button>
              </div>
            </div>

            <!-- Shelf Body Views -->
            <div class="pt-4 min-h-[160px]">
              
              <!-- 1. Media Dashboard -->
              <div v-if="activeTab === 'dashboard'" class="space-y-3.5">
                <div class="flex items-center gap-3.5">
                  <!-- Vinyl Album Art with spinning effect -->
                  <div class="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-card to-cyber-border flex items-center justify-center border border-white/[0.1] shadow-md overflow-hidden group">
                    <Disc :class="['w-7 h-7 text-cyber-mint', isPlaying ? 'animate-spin' : '']" style="animation-duration: 4s;" />
                  </div>

                  <div class="flex-1 min-w-0 text-left">
                    <h4 class="text-sm font-bold text-white truncate">{{ currentSong.title }}</h4>
                    <p class="text-xs text-cyber-muted truncate">{{ currentSong.artist }} — {{ currentSong.album }}</p>
                  </div>

                  <!-- Controls -->
                  <div class="flex items-center gap-1.5">
                    <button @click="prevTrack" class="p-1.5 rounded-lg hover:bg-white/[0.08] text-cyber-muted hover:text-white transition-colors" title="Previous Track">
                      <SkipBack class="w-4 h-4" />
                    </button>
                    <button 
                      @click="togglePlay"
                      class="p-2 rounded-xl bg-gradient-to-r from-cyber-mint to-teal-400 text-[#07090E] hover:opacity-95 transition-transform active:scale-95 shadow-glow-mint"
                      :title="isPlaying ? 'Pause' : 'Play'"
                    >
                      <Pause v-if="isPlaying" class="w-4 h-4" />
                      <Play v-else class="w-4 h-4 fill-current" />
                    </button>
                    <button @click="nextTrack" class="p-1.5 rounded-lg hover:bg-white/[0.08] text-cyber-muted hover:text-white transition-colors" title="Next Track">
                      <SkipForward class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Interactive Scrubber bar -->
                <div class="space-y-1">
                  <div 
                    @click="scrub"
                    class="w-full bg-white/[0.1] rounded-full h-2 overflow-hidden cursor-pointer hover:h-2.5 transition-all group"
                    title="Click to seek"
                  >
                    <div 
                      class="bg-gradient-to-r from-cyber-mint to-cyber-teal h-full rounded-full transition-all duration-150 relative" 
                      :style="{ width: `${playbackProgress}%` }"
                    ></div>
                  </div>
                  <div class="flex justify-between text-[10px] font-mono text-cyber-muted">
                    <span>{{ formattedElapsed }}</span>
                    <span>{{ formattedDuration }}</span>
                  </div>
                </div>
              </div>

              <!-- 2. Drops View -->
              <div v-else-if="activeTab === 'drops'" class="space-y-2">
                <div 
                  @click="addDemoFile"
                  class="border border-dashed border-white/[0.15] hover:border-cyber-mint/50 rounded-xl p-2.5 text-center text-xs text-cyber-muted transition-all cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] flex items-center justify-center gap-2"
                >
                  <Plus class="w-3.5 h-3.5 text-cyber-mint" />
                  <span>Click to <strong class="text-cyber-mint">Simulate File Drop</strong> to stage across workspaces</span>
                </div>
                
                <div class="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                  <div 
                    v-for="f in dropFiles" 
                    :key="f.id" 
                    class="flex items-center justify-between p-2 rounded-lg bg-cyber-card/70 text-xs text-cyber-bright border border-white/[0.06] hover:border-cyber-mint/30 transition-all"
                  >
                    <div class="flex items-center gap-2 truncate">
                      <Layers class="w-3.5 h-3.5 text-cyber-teal shrink-0" />
                      <span class="truncate font-mono">{{ f.name }}</span>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span class="text-[10px] text-cyber-muted font-mono">{{ f.size }}</span>
                      <button 
                        @click.stop="removeFile(f.id)" 
                        class="p-1 rounded text-cyber-muted hover:text-red-400 hover:bg-white/[0.06] transition-colors"
                        title="Remove file"
                      >
                        <Trash2 class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. Clipboard View -->
              <div v-else-if="activeTab === 'clipboard'" class="space-y-1.5">
                <div 
                  v-for="item in clipItems" 
                  :key="item.id" 
                  @click="copyText(item.text, 'Copied snippet to clipboard!')"
                  class="p-2.5 rounded-xl bg-cyber-card/70 border border-white/[0.08] hover:border-cyber-mint/50 flex items-center justify-between group transition-all cursor-pointer"
                >
                  <span class="text-xs font-mono truncate text-left text-cyber-bright">{{ item.text }}</span>
                  <span class="text-[10px] text-cyber-muted group-hover:text-cyber-mint shrink-0 ml-2 font-medium flex items-center gap-1">
                    <Copy class="w-3 h-3" />
                    <span>Copy</span>
                  </span>
                </div>
              </div>

              <!-- 4. Focus / Pomodoro View -->
              <div v-else-if="activeTab === 'pomodoro'" class="text-center py-2 space-y-3">
                <div class="text-3xl font-mono font-extrabold text-white tracking-widest text-shadow">
                  {{ formattedPomoTime }}
                </div>
                <div class="flex justify-center gap-2">
                  <button 
                    @click="togglePomo"
                    class="px-5 py-1.5 rounded-xl bg-cyber-mint text-[#07090E] text-xs font-bold hover:bg-cyber-mint/90 shadow-glow-mint/40 active:scale-95 transition-all"
                  >
                    {{ isPomoRunning ? 'Pause' : 'Start Focus' }}
                  </button>
                  <button 
                    @click="resetPomo"
                    class="px-4 py-1.5 rounded-xl border border-white/[0.1] text-xs text-cyber-muted hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <!-- 5. Notes View -->
              <div v-else-if="activeTab === 'notes'" class="space-y-1.5">
                <textarea 
                  v-model="noteText"
                  rows="3"
                  class="w-full bg-cyber-card/80 border border-white/[0.1] rounded-xl p-2.5 text-xs font-mono text-cyber-bright focus:outline-none focus:border-cyber-mint/60 resize-none"
                  placeholder="Scratchpad for temporary thoughts..."
                ></textarea>
                <div class="flex items-center justify-between text-[10px] font-mono text-cyber-muted">
                  <span class="text-cyber-mint flex items-center gap-1">
                    <Check class="w-3 h-3" />
                    <span>Saved locally to ~/.config/open-notch/notes.txt</span>
                  </span>
                  <span>{{ noteStats.words }} words • {{ noteStats.chars }} chars</span>
                </div>
              </div>

              <!-- 6. Settings View -->
              <div v-else-if="activeTab === 'settings'" class="space-y-2.5 text-left">
                <!-- Autostart switch -->
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-cyber-card/60 border border-white/[0.06]">
                  <div>
                    <h5 class="text-xs font-semibold text-white">Start at Login</h5>
                    <p class="text-[10px] text-cyber-muted">Launch OpenNotch daemon automatically on user session</p>
                  </div>
                  <div 
                    @click="autostartActive = !autostartActive"
                    :class="['w-9 h-5 rounded-full border transition-colors relative cursor-pointer', autostartActive ? 'bg-cyber-mint/30 border-cyber-mint' : 'bg-white/[0.1] border-white/[0.2]']"
                  >
                    <div :class="['w-4 h-4 rounded-full bg-cyber-mint absolute top-0.5 transition-all', autostartActive ? 'right-0.5' : 'left-0.5 bg-cyber-muted']"></div>
                  </div>
                </div>

                <!-- Sound Effects switch -->
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-cyber-card/60 border border-white/[0.06]">
                  <div>
                    <h5 class="text-xs font-semibold text-white">Interaction Audio</h5>
                    <p class="text-[10px] text-cyber-muted">Subtle tactile click feedback on notch expansion</p>
                  </div>
                  <div 
                    @click="soundEffectsActive = !soundEffectsActive"
                    :class="['w-9 h-5 rounded-full border transition-colors relative cursor-pointer', soundEffectsActive ? 'bg-cyber-mint/30 border-cyber-mint' : 'bg-white/[0.1] border-white/[0.2]']"
                  >
                    <div :class="['w-4 h-4 rounded-full bg-cyber-mint absolute top-0.5 transition-all', soundEffectsActive ? 'right-0.5' : 'left-0.5 bg-cyber-muted']"></div>
                  </div>
                </div>

                <!-- Update checker row -->
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-cyber-card/60 border border-white/[0.06]">
                  <div>
                    <h5 class="text-xs font-semibold text-white">Software Updates</h5>
                    <p class="text-[10px] text-cyber-mint font-medium">v0.2.0 • Up to date</p>
                  </div>
                  <button 
                    @click="simulateUpdateCheck"
                    class="px-3 py-1 rounded-lg text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw :class="['w-3 h-3', updateStatus === 'checking' ? 'animate-spin' : '']" />
                    <span v-if="updateStatus === 'checking'">Checking...</span>
                    <span v-else>Check Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulated Desktop Workspace (Wallpaper) -->
        <div 
          :class="[
            'flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[480px] transition-all duration-500 cyber-grid',
            currentWallpaper === 'mint' ? 'desktop-wallpaper-mint' : currentWallpaper === 'aurora' ? 'desktop-wallpaper-aurora' : 'desktop-wallpaper-minimal'
          ]"
        >
          <div class="max-w-md space-y-3.5 mt-16">
            <div class="relative inline-block">
              <img src="/otty.png" alt="Otty" class="w-16 h-16 mx-auto rounded-2xl shadow-glow-mint/40 border border-cyber-mint/30" />
              <div class="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-cyber-mint text-[#07090E] text-[9px] font-mono font-bold">
                Linux GTK4
              </div>
            </div>
            
            <h3 class="text-base font-bold text-white tracking-tight">Interactive Linux Desktop Demo</h3>
            <p class="text-xs text-cyber-muted leading-relaxed">
              Hover over the top notch pill to slide the shelf down. Open files, pause audio, or pin it open while working across your workspaces.
            </p>
            
            <div class="pt-2 flex items-center justify-center gap-3">
              <button 
                @click="isPinned = !isPinned" 
                :class="[
                  'text-xs px-4 py-2 rounded-xl border transition-all flex items-center gap-2 font-medium',
                  isPinned 
                    ? 'bg-cyber-mint/20 border-cyber-mint text-cyber-mint shadow-glow-mint/30' 
                    : 'bg-cyber-card border-white/[0.1] text-cyber-muted hover:text-white hover:border-cyber-mint/40'
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
      
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-card border border-white/[0.1] text-xs font-semibold text-cyber-teal font-mono mb-3">
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
        <div 
          @mousemove="handleMouseMove"
          class="md:col-span-2 glow-card p-8 rounded-3xl space-y-5 text-left group"
        >
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-cyber-mint/10 border border-cyber-mint/30 flex items-center justify-center text-cyber-mint group-hover:scale-105 transition-transform">
              <Music class="w-6 h-6" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono px-3 py-1 rounded-full bg-cyber-card border border-white/[0.08] text-cyber-mint font-medium flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyber-mint animate-pulse"></span>
                <span>Sub-0.2ms D-Bus</span>
              </span>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-white group-hover:text-cyber-mint transition-colors">
            Universal MPRIS Media Controller
          </h3>
          
          <p class="text-sm text-cyber-muted leading-relaxed">
            Directly queries the Linux D-Bus session bus to connect seamlessly with Spotify, Firefox, Google Chrome, Brave, VLC, and local players. Displays album cover art, live scrubbers, and responsive play/pause/skip actions.
          </p>

          <!-- Interactive Graphic: Supported players chips + live visualizer -->
          <div class="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span class="px-2.5 py-1 rounded-lg bg-cyber-card border border-white/[0.08] text-cyber-bright">Spotify</span>
              <span class="px-2.5 py-1 rounded-lg bg-cyber-card border border-white/[0.08] text-cyber-bright">Firefox</span>
              <span class="px-2.5 py-1 rounded-lg bg-cyber-card border border-white/[0.08] text-cyber-bright">Chrome</span>
              <span class="px-2.5 py-1 rounded-lg bg-cyber-card border border-white/[0.08] text-cyber-bright">VLC / MPV</span>
            </div>

            <!-- Mini Live Audio Spectrum -->
            <div class="flex items-end gap-1 h-5 px-3 py-1 rounded-lg bg-cyber-card/60 border border-white/[0.06]">
              <span class="w-1 bg-cyber-mint rounded-full anim-bar-1"></span>
              <span class="w-1 bg-cyber-mint rounded-full anim-bar-2"></span>
              <span class="w-1 bg-cyber-mint rounded-full anim-bar-3"></span>
              <span class="w-1 bg-cyber-mint rounded-full anim-bar-4"></span>
              <span class="w-1 bg-cyber-mint rounded-full anim-bar-5"></span>
            </div>
          </div>
        </div>

        <!-- Bento Card 2 (1-Column): In-App Update Engine -->
        <div 
          @mousemove="handleMouseMove"
          class="glow-card p-8 rounded-3xl space-y-5 text-left group"
        >
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal group-hover:scale-105 transition-transform">
              <RefreshCw class="w-6 h-6" />
            </div>
            <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyber-card border border-white/[0.08] text-cyber-teal">
              SemVer Engine
            </span>
          </div>

          <h3 class="text-2xl font-bold text-white group-hover:text-cyber-teal transition-colors">
            In-App Update Engine
          </h3>
          
          <p class="text-sm text-cyber-muted leading-relaxed">
            Checks GitHub's public releases API daily with a zero-dependency JSON parser. Get clean release notes and one-click `.deb` download links directly inside your settings.
          </p>

          <div class="pt-2 flex items-center gap-2 text-xs font-mono text-cyber-teal">
            <span class="w-2 h-2 rounded-full bg-cyber-teal"></span>
            <span>24h Background Cache</span>
          </div>
        </div>

        <!-- Bento Card 3 (1-Column): Drop Shelf & Staging -->
        <div 
          @mousemove="handleMouseMove"
          class="glow-card p-8 rounded-3xl space-y-5 text-left group"
        >
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-cyber-mint/10 border border-cyber-mint/30 flex items-center justify-center text-cyber-mint group-hover:scale-105 transition-transform">
              <Layers class="w-6 h-6" />
            </div>
            <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyber-card border border-white/[0.08] text-cyber-muted">
              GTK4 Drag & Drop
            </span>
          </div>

          <h3 class="text-2xl font-bold text-white group-hover:text-cyber-mint transition-colors">
            File Drop Shelf
          </h3>
          
          <p class="text-sm text-cyber-muted leading-relaxed">
            Drag files to the notch to stage them while switching between workspaces, then drag them into emails, chats, or folders without desktop window clutter.
          </p>
        </div>

        <!-- Bento Card 4 (2-Columns): Wayland & X11 Native Integration -->
        <div 
          @mousemove="handleMouseMove"
          class="md:col-span-2 glow-card p-8 rounded-3xl space-y-5 text-left group"
        >
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal group-hover:scale-105 transition-transform">
              <Monitor class="w-6 h-6" />
            </div>
            <span class="text-xs font-mono px-3 py-1 rounded-full bg-cyber-card border border-white/[0.08] text-cyber-muted font-medium">
              Dual Protocol Overlay
            </span>
          </div>

          <h3 class="text-2xl font-bold text-white group-hover:text-cyber-teal transition-colors">
            Wayland & X11 Native Layering
          </h3>
          
          <p class="text-sm text-cyber-muted leading-relaxed">
            Operates natively via <code class="text-cyber-mint">gtk4-layer-shell</code> overlay protocol on modern Wayland compositors (Hyprland, Sway, River) while falling back cleanly to standard EWMH dock hints on X11 / XWayland (GNOME, XFCE, i3, KWin).
          </p>

          <div class="pt-2 flex flex-wrap gap-2 text-xs font-mono text-cyber-muted">
            <span class="px-2.5 py-1 rounded-lg bg-cyber-card border border-white/[0.08] text-cyber-bright">wlr-layer-shell top layer</span>
            <span class="px-2.5 py-1 rounded-lg bg-cyber-card border border-white/[0.08] text-cyber-bright">_NET_WM_WINDOW_TYPE_DOCK</span>
            <span class="px-2.5 py-1 rounded-lg bg-cyber-card border border-white/[0.08] text-cyber-bright">Hyprland & Sway ready</span>
          </div>
        </div>

        <!-- Bento Card 5 (Full-Width 3-Columns Spotlight): Local-First Architecture -->
        <div 
          @mousemove="handleMouseMove"
          class="md:col-span-3 glow-card p-8 sm:p-10 rounded-3xl relative overflow-hidden group"
        >
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div class="space-y-4 max-w-xl text-left">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-mint/10 border border-cyber-mint/30 text-xs font-semibold text-cyber-mint font-mono">
                <HardDrive class="w-3.5 h-3.5" />
                <span>LOCAL-FIRST BY DESIGN</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your Desktop. Your Files. Zero Cloud Lock-In.</h3>
              <p class="text-sm text-cyber-muted leading-relaxed">
                OpenNotch is engineered around the core Unix philosophy: desktop utilities should be 100% offline, privacy-respecting, and lightning fast. No external user accounts, no telemetry beaconing, and zero cloud lock-in.
              </p>
            </div>

            <!-- Pillars Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:w-auto shrink-0 text-left">
              <div class="p-4 rounded-2xl bg-[#090D14]/90 border border-white/[0.08] flex items-start gap-3.5 hover:border-cyber-mint/40 transition-colors">
                <div class="p-2 rounded-xl bg-cyber-mint/10 text-cyber-mint shrink-0 mt-0.5">
                  <WifiOff class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">100% Offline Capable</h4>
                  <p class="text-[11px] text-cyber-muted mt-0.5">Operates with zero internet connection or remote servers.</p>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-[#090D14]/90 border border-white/[0.08] flex items-start gap-3.5 hover:border-cyber-teal/40 transition-colors">
                <div class="p-2 rounded-xl bg-cyber-teal/10 text-cyber-teal shrink-0 mt-0.5">
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Zero Telemetry</h4>
                  <p class="text-[11px] text-cyber-muted mt-0.5">No metrics, tracking cookies, or data collection of any kind.</p>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-[#090D14]/90 border border-white/[0.08] flex items-start gap-3.5 hover:border-cyber-teal/40 transition-colors">
                <div class="p-2 rounded-xl bg-cyber-teal/10 text-cyber-teal shrink-0 mt-0.5">
                  <Database class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Plain Files & D-Bus</h4>
                  <p class="text-[11px] text-cyber-muted mt-0.5">Stored locally in standard paths like <code class="text-cyber-mint">~/.config/open-notch</code>.</p>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-[#090D14]/90 border border-white/[0.08] flex items-start gap-3.5 hover:border-cyber-mint/40 transition-colors">
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
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-card border border-white/[0.1] text-xs font-semibold text-cyber-mint font-mono mb-2">
          <Terminal class="w-3.5 h-3.5" />
          <span>EASY DISTRIBUTION</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Install OpenNotch</h2>
        <p class="text-sm text-cyber-muted mt-2">Get up and running in under a minute with pre-built packages or compile from source.</p>
      </div>

      <!-- Installation Tab Switcher -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.1] space-y-6">
        <div class="flex items-center gap-2 border-b border-white/[0.08] pb-4 overflow-x-auto">
          <button 
            @click="installTab = 'deb'"
            :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2', installTab === 'deb' ? 'bg-cyber-mint text-[#07090E] shadow-glow-mint/40' : 'text-cyber-muted hover:text-white hover:bg-white/[0.04]']"
          >
            <Download class="w-3.5 h-3.5" />
            <span>Debian Package (.deb)</span>
          </button>
          <button 
            @click="installTab = 'source'"
            :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2', installTab === 'source' ? 'bg-cyber-mint text-[#07090E] shadow-glow-mint/40' : 'text-cyber-muted hover:text-white hover:bg-white/[0.04]']"
          >
            <Terminal class="w-3.5 h-3.5" />
            <span>Build from Source (make)</span>
          </button>
        </div>

        <!-- Tab 1: Debian Package -->
        <div v-if="installTab === 'deb'" class="space-y-3 text-left">
          <p class="text-xs text-cyber-muted">Recommended for Ubuntu, Debian, Pop!_OS, Zorin OS, and Linux Mint.</p>
          <div class="bg-[#05070A] p-4 rounded-2xl border border-white/[0.08] font-mono text-xs text-cyber-bright space-y-2 relative group">
            <button 
              @click="copyText('wget https://github.com/gagan-gv/open-notch/releases/download/v0.2.0/open-notch_0.2.0_amd64.deb && sudo apt install ./open-notch_0.2.0_amd64.deb', 'Debian install commands copied!')"
              class="absolute top-3 right-3 p-2 rounded-xl bg-cyber-card border border-white/[0.1] text-cyber-muted hover:text-white transition-colors"
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
          <div class="bg-[#05070A] p-4 rounded-2xl border border-white/[0.08] font-mono text-xs text-cyber-bright space-y-2 relative group">
            <button 
              @click="copyText('git clone https://github.com/gagan-gv/open-notch.git && cd open-notch && make install-user', 'Build command copied!')"
              class="absolute top-3 right-3 p-2 rounded-xl bg-cyber-card border border-white/[0.1] text-cyber-muted hover:text-white transition-colors"
              title="Copy commands"
            >
              <Check v-if="copiedSnippet" class="w-4 h-4 text-cyber-mint" />
              <Copy v-else class="w-4 h-4" />
            </button>
            <div class="text-cyber-mint">git clone https://github.com/gagan-gv/open-notch.git</div>
            <div>cd open-notch && make install-user</div>
            <div class="text-cyber-muted pt-1"># Installs to ~/.local/bin/open-notch</div>
          </div>
        </div>

        <!-- Post-install Quick Tip -->
        <div class="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-cyber-muted font-mono border-t border-white/[0.06] gap-2.5">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyber-mint"></span>
            <span>Launch from your <strong class="text-white font-sans font-medium">Applications Menu / Start Bar</strong>, or terminal (<code class="text-cyber-mint font-bold">open-notch</code>)</span>
          </div>
          <span class="text-cyber-muted/80">Configure autostart anytime in shelf Settings</span>
        </div>
      </div>
    </section>

    <!-- Frequently Asked Questions Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-card border border-white/[0.1] text-xs font-semibold text-cyber-mint font-mono mb-4">
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
          class="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-200"
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
            class="px-5 pb-5 text-sm text-cyber-muted leading-relaxed border-t border-white/[0.06] pt-3 text-left"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/[0.08] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-cyber-muted gap-4">
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