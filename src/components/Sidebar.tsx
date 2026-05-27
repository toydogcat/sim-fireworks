/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LandmarkId, 
  FireworkParams, 
  DroneParams, 
  AtmosphereSettings, 
  FireworkType, 
  ColorPreset,
  DronePatternType
} from '../types';
import { 
  Compass, 
  Sparkles, 
  Dices, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Moon, 
  Grid, 
  Info, 
  Feather,
  ChevronRight,
  Send,
  Sparkle
} from 'lucide-react';

interface SidebarProps {
  landmarkId: LandmarkId;
  setLandmarkId: (id: LandmarkId) => void;
  fireworkParams: FireworkParams;
  setFireworkParams: (params: FireworkParams) => void;
  droneParams: DroneParams;
  setDroneParams: (params: DroneParams) => void;
  atmosphere: AtmosphereSettings;
  setAtmosphere: (settings: AtmosphereSettings) => void;
  dronesActive: boolean;
  setDronesActive: (active: boolean) => void;
  totalLaunches: number;
  lang: 'zh-TW' | 'en';
}

export default function Sidebar({
  landmarkId,
  setLandmarkId,
  fireworkParams,
  setFireworkParams,
  droneParams,
  setDroneParams,
  atmosphere,
  setAtmosphere,
  dronesActive,
  setDronesActive,
  totalLaunches,
  lang,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'landmark' | 'firework' | 'drone' | 'env'>('landmark');

  // Complete translation dictionary
  const s = {
    'zh-TW': {
      title: '星火控制台',
      subtitle: '3D 互動模擬面板',
      launched: '已升空發射:',
      tabLandmarks: '景點切換',
      tabFireworks: '煙火參數',
      tabSwarms: '無人機排字',
      tabAtmosphere: '舞台環境',
      
      selectLocation: '設定主題背景景點',
      landmarkScenic: '景點模擬框架',
      
      pyroHeader: '自訂璀璨煙火屬性',
      sparkShellType: '選定煙火彈花型樣式',
      chromaticScheme: '防呆色彩配搭',
      primarySpark: '主要星火顏色',
      secondarySpark: '輔助星火顏色',
      explosionVelocity: '爆發威力與速度',
      detonationAltitude: '引爆空域高度',
      particleVolume: '火藥微粒飽和數量',
      starburstScale: '星火尺寸大小',
      denseAcoustic: '震撼音效 & 物理聲響',
      soundActive: '已開啟 ON',
      soundMuted: '已靜音 OFF',
      
      swarmHeader: '設定無人機排字秀',
      swarmActive: '暫停解散無人機 (Swarms Active)',
      swarmInactive: '立刻起飛升空排字 (Swarms Off)',
      shapeMesh: '選擇空中立體圖案 (Mesh Pattern)',
      swarmTextBuffer: '自訂飛上天排字 (限大寫英文/數字)',
      limitChars: '不支援中文字。短字 (3~6字) 表現效果最立體，例如 "101" 或 "2026"',
      enterText: '輸入英文文字 (如 TAIPEI 或 LOVE)',
      ledTone: '選擇無人機機體 LED 光色',
      swarmDensity: '編隊排列規模 (Swarms Count)',
      driftVelocity: '編制移動速度 (Speed Scale)',
      lvl: '等級',
      heightRange: '昇空高度層級 (Swarms Altitude)',
      shapeExpansion: '圖樣縮放比例 (Swarms Scale)',
      
      envHeader: '調整舞台環境氛圍',
      skylightPreset: '天空光照感主題 (Tone Theme)',
      midnightZero: '🌑 漆黑暗夜 (Classic Midnight)',
      toxicGlow: '🥶 冷冽青色暮光 (Cyan Twilight)',
      chromaCascade: '🔮 迷幻紫霞暮雲 (Deep Purple Cloud)',
      stellarCharge: '背景星宿密集度',
      waterReflection: '水面反射清晰度',
      audioGain: '主音頻音量 (Master Volume)',
      helperGrid: '開啟 3D 水平經緯輔助網格',
      helperActive: '已顯示',
      helperMuted: '已隱藏',
      
      systemManual: 'Use W A S D keys & mouse to rotate / pan camera.',
      
      peony: '經典牡丹花彈 PEONY',
      chrys: '菊花閃爍 CHRYS',
      heart: '3D 愛心 HEART',
      ring: '幸運雙環 RING',
      crossette: '十字散彈 CROSS',
      willow: '金柳垂絲 WILLOW',
      fountain: '璀璨噴泉 SPARK',
      
      rainbow: '🌈 彩虹極光幻影 (Rainbow Spark)',
      goldSilver: '✨ 璀璨金尊白銀 (Imperial Gold & Silver)',
      neon: '🔋 霓虹魔力撞色 (Acid Neon Blast)',
      sunset: '🌅 落日落霞溫暖 (Sunset Aurora)',
      cyberpunk: '👾 賽博科技藍粉 (Cyber Pink Indigo)',
      custom: '🎨 自定義繽紛色調 (Custom Duo Color)'
    },
    en: {
      title: 'SPARK ENGINE CONTROL',
      subtitle: '3D SIMULATION CONSOLE',
      launched: 'LAUNCHED:',
      tabLandmarks: 'Landmarks',
      tabFireworks: 'Fireworks',
      tabSwarms: 'Swarms',
      tabAtmosphere: 'Atmosphere',
      
      selectLocation: 'SELECT CORE LOCATION TARGET',
      landmarkScenic: 'SCENIC FRAMEWORK',
      
      pyroHeader: 'PYROTECHNIC CHARGE PROPERTIES',
      sparkShellType: 'SPARK SHELL STYLE TYPE',
      chromaticScheme: 'CHROMATIC COLOR SCHEME',
      primarySpark: 'PRIMARY SPARK COLOR',
      secondarySpark: 'SECONDARY SPARK COLOR',
      explosionVelocity: 'EXPLOSION VELOCITY',
      detonationAltitude: 'DETONATION ALTITUDE',
      particleVolume: 'PARTICLE VOLUME',
      starburstScale: 'STARBURST SCALE',
      denseAcoustic: 'DENSE ACOUSTIC ECHO',
      soundActive: 'ACTIVE',
      soundMuted: 'MUTED',
      
      swarmHeader: 'SATELLITE SWARM COORDINATOR',
      swarmActive: 'Swarms Engaged (Online)',
      swarmInactive: 'Standby Mode (Off)',
      shapeMesh: 'SHAPE MESH GEOMETRY',
      swarmTextBuffer: 'Swarms Text Buffer (Upper-case En/Num)',
      limitChars: 'Non-EN strings ignored. Limit 3-6 chars for optimal cluster legibility.',
      enterText: 'ENTER TEXT (E.G. 101, TAIWAN)',
      ledTone: 'LED CHROMATIC TONE',
      swarmDensity: 'SWARM DENSITY',
      driftVelocity: 'DRIFT VELOCITY',
      lvl: 'LVL',
      heightRange: 'HEIGHT RANGE',
      shapeExpansion: 'SHAPE EXPANSION',
      
      envHeader: 'ENVIRONMENT SPECTRAL CONSOLE',
      skylightPreset: 'SKYLIGHT SPECTRUM PRESET',
      midnightZero: '🌑 MIDNIGHT MATRIX (Deep Absolute Zero)',
      toxicGlow: '🥶 TOXIC GLOW (Spectral Cyan Twilight)',
      chromaCascade: '🔮 CHROMA CASCADE (Vibrant Purplish Dusk)',
      stellarCharge: 'STELLAR CHARGE LIMIT',
      waterReflection: 'WATER REFLECTION SPECULAR',
      audioGain: 'GLOBAL OUTPUT AUDIO GAIN',
      helperGrid: 'COORDINATE HELPER GRID',
      helperActive: 'ACTIVE',
      helperMuted: 'STDBY',
      
      systemManual: 'SYSTEM MANUAL: [W][A][S][D] OR DRAG MOUSE TO ADJUST CAMERA ANGLE.',
      
      peony: 'PEONY SHELL (01)',
      chrys: 'CHRYS SPARKLE (02)',
      heart: 'ROMANTIC HEART (03)',
      ring: 'DOUBLE RING (04)',
      crossette: 'CROSSETTE (05)',
      willow: 'GOLD WILLOW (06)',
      fountain: 'FOUNTAIN CORE (07)',
      
      rainbow: '🌈 RAINBOW INTERRUPT (Multi-Spectral)',
      goldSilver: '✨ IMPERIAL MONARCH (Gold & Platinum)',
      neon: '🔋 CHEMICAL ACID (Reactive High Neon)',
      sunset: '🌅 THERMAL SUNSET (Orange Amber Dawn)',
      cyberpunk: '👾 TOKYO DISCO (Vibrant Cyan Pink)',
      custom: '🎨 MANUAL INJECTION (User Palette Mode)'
    }
  };

  // Landmark descriptions dictionary with dynamic localization
  const landmarkInfo = {
    taipei101: {
      title: lang === 'zh-TW' ? '台北 101 (Taipei)' : 'TAIPEI 101',
      sub: lang === 'zh-TW' ? '台灣標誌性摩天大樓，配有多層發射陽台。' : 'Iconic Taiwanese megastructure with multilevel launch balconies.',
      desc: lang === 'zh-TW' ? '台北101煙火是跨年必看。此處模擬中，煙火不僅可以自地面升空，還能【從大樓中段陽台平台向兩側發射】，展現動感外擴噴射特效！' : 'Taipei 101 fireworks are world-renowned. In this simulator, fireworks launch not only from the ground, but outward from the building platforms!',
      fireNote: lang === 'zh-TW' ? '★ 開發特色：台北101各層陽台可發射橫向與斜向煙火秀。' : '★ Platform-integrated multi-tiered outward pyro triggers enabled.'
    },
    eiffel: {
      title: lang === 'zh-TW' ? '巴黎 埃菲爾鐵塔 (Paris)' : 'EIFFEL TOWER',
      sub: lang === 'zh-TW' ? '法國最具代表性的地標，頂端配有雙向探照燈。' : 'Classic Parisian structural landmark with a dual searchlight.',
      desc: lang === 'zh-TW' ? '宏偉的網格鐵塔外框。頂端配有一盞【360度旋轉強光探照燈】，與空中盛開的煙花交相輝映，是法式浪漫的最高境界。' : 'Elegant lattice framework featuring a rotating dual lighthouse searchlight beam matching synchronous aerial coordinates.',
      fireNote: lang === 'zh-TW' ? '★ 開發特色：巴黎鐵塔頂端尖碑會持續噴出金色垂直炫麗煙花。' : '★ Apex nozzle produces continuous high-intensity golden fountain cascades.'
    },
    tokyo: {
      title: lang === 'zh-TW' ? '東京 鐵塔 (Tokyo)' : 'TOKYO TOWER',
      sub: lang === 'zh-TW' ? '東京不可或缺的絢爛紅白色彩鋼鐵尖塔。' : 'Iconic lattice tower painted in high-contrast red and white.',
      desc: lang === 'zh-TW' ? '鮮豔的橙紅色與純白相間結構。雙重觀景台配有多功能燈飾，頂端雷射探照燈會在夜空中編織彩色交織光線。' : 'Dual observation decks emit ambient synchronized glows. Apex lasers trace glowing visual coordinates across the upper clouds.',
      fireNote: lang === 'zh-TW' ? '★ 開發特色：紅白兩色網格構造在黑夜具有強烈的色彩對比。' : '★ Dual lattice beacons are optimized for high-intensity night projection.'
    },
    bridge: {
      title: lang === 'zh-TW' ? '金門懸索大橋 (San Francisco)' : 'GOLDEN GATE BRIDGE',
      sub: lang === 'zh-TW' ? '橫跨金門海峽的宏偉國際橘懸索吊橋。' : 'Massive suspension bridge over San Francisco Bay.',
      desc: lang === 'zh-TW' ? '雙座高聳的主塔、優美的垂地弧形巨纜與下方一望無際的海灣。煙花爆發時，水面會反射出整段紅色橋身與星空耀眼的輪廓。' : 'Towering orange pillars connected by sweeping suspension cables. Water reflection maps render beautiful mirroring across the bay floor.',
      fireNote: lang === 'zh-TW' ? '★ 開發特色：寬廣的弧形跨度特別適合齊發扇形大火秀。' : '★ Wide-span design defaults to symmetric synchronized fan launches.'
    }
  };

  // Color Palette Quick Presets
  const quickColors = [
    { name: 'CHROME_CYAN', hex: '#00dfff' },
    { name: 'PULSE_PINK', hex: '#ff2a85' },
    { name: 'TOXIC_GREEN', hex: '#11ff88' },
    { name: 'NUGGET_GOLD', hex: '#ffca00' },
    { name: 'LASER_WHITE', hex: '#ffffff' },
    { name: 'PHANTOM_VIOLET', hex: '#af40ff' },
  ];

  const updateFirework = <K extends keyof FireworkParams>(key: K, value: FireworkParams[K]) => {
    const updated = { ...fireworkParams, [key]: value };
    
    // Automatically preset colors if color preset swaps
    if (key === 'colorPreset') {
      const preset = value as ColorPreset;
      if (preset === 'rainbow') {
        updated.primaryColor = '#ff3366';
        updated.secondaryColor = '#33ccff';
      } else if (preset === 'gold_silver') {
        updated.primaryColor = '#ffd700';
        updated.secondaryColor = '#e5e5e5';
      } else if (preset === 'neon') {
        updated.primaryColor = '#ff007f';
        updated.secondaryColor = '#00f3ff';
      } else if (preset === 'sunset') {
        updated.primaryColor = '#ff4500';
        updated.secondaryColor = '#ffdf00';
      } else if (preset === 'cyberpunk') {
        updated.primaryColor = '#f000ff';
        updated.secondaryColor = '#00fffa';
      }
    }
    
    setFireworkParams(updated);
  };

  const updateDrone = <K extends keyof DroneParams>(key: K, value: DroneParams[K]) => {
    setDroneParams({ ...droneParams, [key]: value });
  };

  const updateAtmosphere = <K extends keyof AtmosphereSettings>(key: K, value: AtmosphereSettings[K]) => {
    setAtmosphere({ ...atmosphere, [key]: value });
  };

  return (
    <div className="w-full lg:w-96 bg-[#141417] border border-[#2A2A2E] rounded flex flex-col max-h-full" id="control_sidebar">
      {/* Sidebar Header Badge */}
      <div className="p-4 border-b border-[#2A2A2E] flex items-center justify-between bg-[#1A1A22]" id="sidebar_header">
        <div>
          <h1 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-sans uppercase tracking-widest">
            <Sparkle className="w-3.5 h-3.5 text-indigo-400 stroke-[2.5]" />
            {s[lang].title}
          </h1>
          <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-0.5">{s[lang].subtitle}</p>
        </div>
        <div className="px-2 py-0.5 bg-[#2A2A2E] border border-slate-700 text-[10px] text-cyan-300 font-mono rounded">
          {s[lang].launched} {totalLaunches}
        </div>
      </div>

      {/* Tabs Navigation Rail */}
      <div className="flex border-b border-[#2A2A2E] bg-[#0A0A0C] p-1 gap-1" id="sidebar_tabs_header">
        <button
          onClick={() => setActiveTab('landmark')}
          className={`flex-1 py-1.5 text-[10px] uppercase font-mono rounded flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'landmark' ? 'bg-[#2A2A2E] text-white border border-[#3A3A3E]' : 'text-gray-400 hover:text-white hover:bg-[#1C1C22]'
          }`}
          id="btn_tab_landmark"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-405" />
          <span>{s[lang].tabLandmarks}</span>
        </button>
        <button
          onClick={() => setActiveTab('firework')}
          className={`flex-1 py-1.5 text-[10px] uppercase font-mono rounded flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'firework' ? 'bg-[#2A2A2E] text-white border border-[#3A3A3E]' : 'text-gray-400 hover:text-white hover:bg-[#1C1C22]'
          }`}
          id="btn_tab_firework"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{s[lang].tabFireworks}</span>
        </button>
        <button
          onClick={() => setActiveTab('drone')}
          className={`flex-1 py-1.5 text-[10px] uppercase font-mono rounded flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'drone' ? 'bg-[#2A2A2E] text-white border border-[#3A3A3E]' : 'text-gray-400 hover:text-white hover:bg-[#1C1C22]'
          }`}
          id="btn_tab_drone"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>{s[lang].tabSwarms}</span>
        </button>
        <button
          onClick={() => setActiveTab('env')}
          className={`flex-1 py-1.5 text-[10px] uppercase font-mono rounded flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'env' ? 'bg-[#2A2A2E] text-white border border-[#3A3A3E]' : 'text-gray-400 hover:text-white hover:bg-[#1C1C22]'
          }`}
          id="btn_tab_env"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{s[lang].tabAtmosphere}</span>
        </button>
      </div>

      {/* Panels Scrolling Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#141417]" id="sidebar_content_scrollable">
        
        {/* TAB 1: LANDMARK SELECTION */}
        {activeTab === 'landmark' && (
          <div className="space-y-3 animate-fadeIn" id="panel_landmark_selector">
            <h2 className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              {s[lang].selectLocation}
            </h2>

            {/* Landmarks Grid Selection */}
            <div className="grid grid-cols-2 gap-2" id="landmarks_selection_grid">
              {(['taipei101', 'eiffel', 'tokyo', 'bridge'] as LandmarkId[]).map((id) => {
                const info = landmarkInfo[id];
                const isSelected = landmarkId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setLandmarkId(id)}
                    className={`p-2.5 text-left rounded border cursor-pointer flex flex-col justify-between h-20 transition-all ${
                      isSelected 
                        ? 'bg-[#1C1A2E] border-indigo-500 text-white shadow-md' 
                        : 'bg-[#0E0E11] hover:bg-[#1C1C22] border-[#2A2A2E] text-gray-400'
                    }`}
                    id={`btn_landmark_${id}`}
                  >
                    <div className="text-[8px] font-mono text-cyan-400 tracking-wider">
                      {id === 'taipei101' && 'LOC_01 // TAIWAN'}
                      {id === 'eiffel' && 'LOC_02 // FRANCE'}
                      {id === 'tokyo' && 'LOC_03 // JAPAN'}
                      {id === 'bridge' && 'LOC_04 // AMERICA'}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono tracking-tight uppercase">{info.title}</div>
                      <div className="text-[9px] text-gray-500 line-clamp-1 truncate mt-0.5">{id === 'taipei101' ? (lang === 'zh-TW' ? '台北 101' : 'Taipei 101') : info.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Specs Details Indicator Card */}
            <div className="p-3 bg-[#0A0A0C] border border-[#2A2A2E] rounded space-y-2" id="landmark_detail_card">
              <div className="flex items-center gap-2 pb-1.5 border-b border-[#2A2A2E]">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <div>
                  <h3 className="text-xs font-bold text-slate-200 font-mono tracking-wide">{landmarkInfo[landmarkId].title}</h3>
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-tight">{landmarkId.toUpperCase()} {s[lang].landmarkScenic}</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-sans">{landmarkInfo[landmarkId].desc}</p>
              <div className="p-1.5 bg-[#1C1E18] border border-emerald-900/40 text-[9px] text-emerald-400 font-mono rounded">
                {landmarkInfo[landmarkId].fireNote}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FIREWORK SETTINGS CONFIGURATOR */}
        {activeTab === 'firework' && (
          <div className="space-y-3 animate-fadeIn font-sans" id="panel_firework_configurator">
            <h2 className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {s[lang].pyroHeader}
            </h2>

            {/* Firework Shell Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">{s[lang].sparkShellType}</label>
              <div className="grid grid-cols-2 gap-1.5" id="firework_type_grid">
                {[
                  { id: 'peony', label: s[lang].peony },
                  { id: 'chrysanthemum', label: s[lang].chrys },
                  { id: 'heart', label: s[lang].heart },
                  { id: 'ring', label: s[lang].ring },
                  { id: 'crossette', label: s[lang].crossette },
                  { id: 'streamer', label: s[lang].willow },
                  { id: 'fountain', label: s[lang].fountain }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateFirework('type', type.id as FireworkType)}
                    className={`py-1.5 px-2 text-left rounded border text-[9px] font-mono tracking-tight transition-all cursor-pointer ${
                      fireworkParams.type === type.id
                        ? 'bg-[#1C1A2E] text-indigo-300 border-indigo-500 shadow-sm'
                        : 'bg-[#0E0E11] border-[#2A2A2E] text-gray-400 hover:text-white hover:bg-[#1C1C22]'
                    }`}
                    id={`btn_firework_type_${type.id}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">{s[lang].chromaticScheme}</label>
              <select
                value={fireworkParams.colorPreset}
                onChange={(e) => updateFirework('colorPreset', e.target.value as ColorPreset)}
                className="w-full bg-[#0E0E11] border border-[#2A2A2E] rounded p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
                id="select_color_preset"
              >
                <option value="rainbow">{s[lang].rainbow}</option>
                <option value="gold_silver">{s[lang].goldSilver}</option>
                <option value="neon">{s[lang].neon}</option>
                <option value="sunset">{s[lang].sunset}</option>
                <option value="cyberpunk">{s[lang].cyberpunk}</option>
                <option value="custom">{s[lang].custom}</option>
              </select>
            </div>

            {/* Custom Duo Color Pickers */}
            {fireworkParams.colorPreset === 'custom' && (
              <div className="p-2.5 bg-[#0E0E12] border border-[#2A2A2E] rounded grid grid-cols-2 gap-3" id="custom_colors_pick_wrap">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-gray-500 block uppercase">{s[lang].primarySpark}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={fireworkParams.primaryColor}
                      onChange={(e) => updateFirework('primaryColor', e.target.value)}
                      className="w-6 h-6 rounded border border-gray-700 bg-transparent cursor-pointer"
                      id="input_color_primary"
                    />
                    <span className="text-[9px] font-mono text-gray-400 uppercase">{fireworkParams.primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-gray-500 block uppercase">{s[lang].secondarySpark}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={fireworkParams.secondaryColor}
                      onChange={(e) => updateFirework('secondaryColor', e.target.value)}
                      className="w-6 h-6 rounded border border-gray-700 bg-transparent cursor-pointer"
                      id="input_color_secondary"
                    />
                    <span className="text-[9px] font-mono text-gray-400 uppercase">{fireworkParams.secondaryColor}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Range Physics controls */}
            <div className="space-y-2.5 p-3 bg-[#0A0A0C] border border-[#2A2A2E] rounded" id="firework_physics_sliders">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].explosionVelocity}</span>
                  <span className="text-cyan-400">{fireworkParams.speed} M/S</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="45"
                  value={fireworkParams.speed}
                  onChange={(e) => updateFirework('speed', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_firework_speed"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].detonationAltitude}</span>
                  <span className="text-cyan-400">{fireworkParams.altitude} M</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="95"
                  value={fireworkParams.altitude}
                  onChange={(e) => updateFirework('altitude', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_firework_altitude"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].particleVolume}</span>
                  <span className="text-indigo-400">{fireworkParams.particleCount} P</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="450"
                  value={fireworkParams.particleCount}
                  onChange={(e) => updateFirework('particleCount', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_firework_density"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].starburstScale}</span>
                  <span className="text-indigo-400">{fireworkParams.size} PX</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={fireworkParams.size}
                  onChange={(e) => updateFirework('size', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_firework_size"
                />
              </div>
            </div>

            {/* Firework launch voice options */}
            <div className="flex items-center justify-between p-2.5 bg-[#0E0E11] border border-[#2A2A2E] rounded" id="firework_sound_bar">
              <span className="text-[10px] font-mono text-gray-300 font-semibold flex items-center gap-1.5 uppercase">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                {s[lang].denseAcoustic}
              </span>
              <button
                onClick={() => updateFirework('soundEnabled', !fireworkParams.soundEnabled)}
                className={`py-0.5 px-2 text-[9px] font-mono font-bold rounded cursor-pointer transition-all ${
                  fireworkParams.soundEnabled
                    ? 'bg-[#1C2C1D] border border-emerald-500 text-emerald-300'
                    : 'bg-[#2A2A2E] text-gray-500 border border-transparent'
                }`}
                id="btn_firework_sound_toggle"
              >
                {fireworkParams.soundEnabled ? s[lang].soundActive : s[lang].soundMuted}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: DRONE LIGHT SHOW CONFIGURATOR */}
        {activeTab === 'drone' && (
          <div className="space-y-3 animate-fadeIn" id="panel_drone_configurator">
            <h2 className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-emerald-400" />
              {s[lang].swarmHeader}
            </h2>

            {/* Master Start Switch */}
            <button
              onClick={() => setDronesActive(!dronesActive)}
              className={`w-full py-2 rounded font-mono font-bold text-[10px] uppercase flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                dronesActive
                  ? 'bg-[#142A22] text-teal-300 border-teal-500'
                  : 'bg-[#0E0E11] border-[#2A2A2E] text-gray-500 hover:text-gray-300'
              }`}
              id="btn_drones_master_power"
            >
              <div className={`w-2 h-2 rounded-full ${dronesActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
              {dronesActive ? s[lang].swarmActive : s[lang].swarmInactive}
            </button>

            {/* Predefined Shape Patterns */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">{s[lang].shapeMesh}</label>
              <div className="grid grid-cols-2 gap-1.5" id="drone_presets_grid">
                {[
                  { id: 'text', label: lang === 'zh-TW' ? '🔠 動態自訂文字' : '🔠 DYNAMIC TEXT' },
                  { id: 'heart', label: lang === 'zh-TW' ? '💖 經典愛心編隊' : '💖 CELESTIAL HEART' },
                  { id: 'star', label: lang === 'zh-TW' ? '⭐ 璀璨太空星芒' : '⭐ COSMIC STAR' },
                  { id: 'smiley', label: lang === 'zh-TW' ? '😊 趣味微笑徽章' : '😊 EMBLEM FACE' },
                  { id: 'globe', label: lang === 'zh-TW' ? '🌍 三維環節地球' : '🌍 RADAR SPHERE' },
                  { id: 'dna', label: lang === 'zh-TW' ? '🧬 六角雙螺旋鏈' : '🧬 HEX HELIX' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => updateDrone('pattern', preset.id as DronePatternType)}
                    className={`py-1.5 px-2 text-left rounded border text-[9px] font-mono transition-all cursor-pointer ${
                      droneParams.pattern === preset.id
                        ? 'bg-[#142028] text-teal-300 border-teal-500 shadow-sm'
                        : 'bg-[#0E0E11] border-[#2A2A2E] text-gray-400 hover:text-white hover:bg-[#1C1C22]'
                    }`}
                    id={`btn_drone_pattern_${preset.id}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom text generator input trigger */}
            {droneParams.pattern === 'text' && (
              <div className="p-3 bg-[#0A0A0C] border border-[#2A2A2E] rounded space-y-2 animate-fadeIn" id="drone_text_custom_wrap">
                <span className="text-[9px] font-mono font-bold text-gray-400 flex items-center gap-1.5 uppercase">
                  <Send className="w-3 h-3 text-cyan-400" />
                  {s[lang].swarmTextBuffer}
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={droneParams.customText}
                    onChange={(e) => updateDrone('customText', e.target.value.toUpperCase())}
                    placeholder={s[lang].enterText}
                    className="flex-1 bg-[#0E0E11] border border-[#2A2A2E] px-2.5 py-1 text-[10px] font-mono text-white focus:outline-none focus:border-teal-500 tracking-wider"
                    id="input_drone_custom_text"
                  />
                </div>
                <span className="text-[8px] text-gray-500 block uppercase">{s[lang].limitChars}</span>
              </div>
            )}

            {/* Active swarm color chooser */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">{s[lang].ledTone}</label>
              
              {/* Preset Palette Buttons */}
              <div className="flex flex-wrap gap-1.5 my-1" id="drone_color_palette">
                {quickColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => updateDrone('color', color.hex)}
                    className="w-5 h-5 rounded border border-[#2A2A2E] relative flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    id={`btn_drone_color_quick_${color.name}`}
                  >
                    {droneParams.color === color.hex && (
                      <span className="w-1.5 h-1.5 rounded bg-slate-950" />
                    )}
                  </button>
                ))}
                
                {/* Advanced input */}
                <input
                  type="color"
                  value={droneParams.color}
                  onChange={(e) => updateDrone('color', e.target.value)}
                  className="w-5 h-5 rounded bg-transparent border border-[#2A2A2E] cursor-pointer p-0"
                  id="input_drone_color_advanced"
                />
              </div>
            </div>

            {/* Swarm Physics density scales */}
            <div className="space-y-2.5 p-3 bg-[#0A0A0C] border border-[#2A2A2E] rounded" id="drone_sliders">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].swarmDensity}</span>
                  <span className="text-teal-400">{droneParams.droneCount} PLD</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="450"
                  value={droneParams.droneCount}
                  onChange={(e) => updateDrone('droneCount', parseInt(e.target.value))}
                  className="w-full accent-teal-400 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_drone_count"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].driftVelocity}</span>
                  <span className="text-teal-400">{s[lang].lvl} {droneParams.flyingSpeed}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={droneParams.flyingSpeed}
                  onChange={(e) => updateDrone('flyingSpeed', parseInt(e.target.value))}
                  className="w-full accent-teal-400 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_drone_speed"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400 font-mono">{s[lang].heightRange}</span>
                  <span className="text-teal-400">{droneParams.height} M</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="80"
                  value={droneParams.height}
                  onChange={(e) => updateDrone('height', parseInt(e.target.value))}
                  className="w-full accent-teal-400 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_drone_altitude"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].shapeExpansion}</span>
                  <span className="text-purple-400">{droneParams.scale}X</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={droneParams.scale}
                  onChange={(e) => updateDrone('scale', parseFloat(e.target.value))}
                  className="w-full accent-purple-400 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_drone_scale"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STAGE ENVIRONMENT & AMBIENT CONTROLS */}
        {activeTab === 'env' && (
          <div className="space-y-3 animate-fadeIn" id="panel_env_configurator">
            <h2 className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              {s[lang].envHeader}
            </h2>

            {/* Time theme Preset selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">{s[lang].skylightPreset}</label>
              <div className="flex flex-col gap-1" id="env_tonethem_list">
                {[
                  { id: 'night', label: s[lang].midnightZero },
                  { id: 'cyan_twilight', label: s[lang].toxicGlow },
                  { id: 'deep_purple', label: s[lang].chromaCascade }
                ].map((time) => (
                  <button
                    key={time.id}
                    onClick={() => updateAtmosphere('timeOfDay', time.id as any)}
                    className={`py-1.5 px-2 text-left rounded border text-[10px] font-mono transition-all cursor-pointer ${
                      atmosphere.timeOfDay === time.id
                        ? 'bg-[#2A1D3A] text-purple-300 border-purple-500'
                        : 'bg-[#0E0E11] border-[#2A2A2E] text-gray-400 hover:text-white hover:bg-[#1C1C22]'
                    }`}
                    id={`btn_env_time_${time.id}`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Atmosphere properties */}
            <div className="space-y-2.5 p-3 bg-[#0A0A0C] border border-[#2A2A2E] rounded" id="env_sliders">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400 font-mono">{s[lang].stellarCharge}</span>
                  <span className="text-cyan-400">{atmosphere.starDensity}{lang === 'zh-TW' ? ' 顆' : ' UNIT'}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={atmosphere.starDensity}
                  onChange={(e) => updateAtmosphere('starDensity', parseInt(e.target.value))}
                  className="w-full accent-purple-500 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_env_star_density"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].waterReflection}</span>
                  <span className="text-indigo-400">{Math.round(atmosphere.reflectionIntensity * 100)} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(atmosphere.reflectionIntensity * 100)}
                  onChange={(e) => updateAtmosphere('reflectionIntensity', parseFloat(e.target.value) / 100)}
                  className="w-full accent-purple-500 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_env_water_reflection"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{s[lang].audioGain}</span>
                  <span className="text-emerald-400">{Math.round(atmosphere.soundVolume * 100)} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(atmosphere.soundVolume * 100)}
                  onChange={(e) => updateAtmosphere('soundVolume', parseFloat(e.target.value) / 100)}
                  className="w-full accent-purple-500 h-1 bg-[#2D2D35] rounded cursor-pointer"
                  id="range_env_audio"
                />
              </div>
            </div>

            {/* Extra togglers */}
            <div className="flex items-center justify-between p-2.5 bg-[#0E0E11] border border-[#2A2A2E] rounded" id="env_showgrid_toggle_wrap">
              <span className="text-[10px] font-mono text-gray-300 font-semibold flex items-center gap-1.5 uppercase">
                <Grid className="w-3.5 h-3.5 text-purple-400" />
                {s[lang].helperGrid}
              </span>
              <button
                onClick={() => updateAtmosphere('showGrid', !atmosphere.showGrid)}
                className={`py-0.5 px-2 text-[9px] font-mono font-bold rounded cursor-pointer transition-all ${
                  atmosphere.showGrid
                    ? 'bg-[#2A1D3A] border border-purple-500 text-purple-300'
                    : 'bg-[#2A2A2E] text-gray-500 border-none'
                }`}
                id="btn_env_grid_active_toggle"
              >
                {atmosphere.showGrid ? s[lang].helperActive : s[lang].helperMuted}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding Trademark */}
      <div className="p-3.5 border-t border-[#2A2A2E] text-center text-[9px] font-mono text-gray-500 bg-[#0A0A0C]" id="sidebar_footer_stamp">
        {lang === 'zh-TW' ? '視角指南：配合 [W][A][S][D] 鍵，或用滑鼠按住拖曳、滑輪滾動來旋轉三維星空視角。' : s[lang].systemManual}
      </div>
    </div>
  );
}
