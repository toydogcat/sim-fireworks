/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Viewport from './components/Viewport';
import { LandmarkId, FireworkParams, DroneParams, AtmosphereSettings } from './types';
import { Sparkles, HelpCircle, MapPin, Radio, Zap, ExternalLink, Eye, Users } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'zh-TW' | 'en'>('zh-TW');

  // Iframe scroll sync with parent (Luna AI Hub)
  useEffect(() => {
    let lastScrollY = 0;
    const scrollThreshold = 8;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold && currentScrollY > 10) return;
      
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      window.parent.postMessage({
        type: 'iframe_scroll',
        scrollY: currentScrollY,
        direction: direction
      }, '*');
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Translations dictionary for top header/footer UI
  const t = {
    'zh-TW': {
      title: 'Aetheris 璀璨煙火與無人機模擬秀 v2.6',
      subtitle: '專業控制中',
      landmark: '當前景點:',
      taipei101Loc: '台北 101 大樓 [台灣] // 北緯 25.0330°',
      eiffelLoc: '巴黎 艾菲爾鐵塔 [法國] // 北緯 48.8584°',
      tokyoLoc: '東京鐵塔 [日本] // 北緯 35.6586°',
      bridgeLoc: '舊金山 金門大橋 [美國] // 北緯 37.8199°',
      simActive: '模擬器運行中 | 集群無人機:',
      pldFlying: '部起飛編隊中',
      groundRes: '停機坪待命',
      launchBtn: '點火發射',
      disk: '磁碟容量: 12.4GB 已壓縮',
      vram: '顯示記憶體: 8.2GB 剩餘',
      audioCap: '音效引擎: 網頁音訊',
      renderEngine: '渲染引擎: WEBGL 粒子高密度',
      session: '連線狀態: 專業模擬中',
      pv: '總瀏覽量:',
      uv: '訪客數:'
    },
    en: {
      title: 'Aetheris Firework & Drone Show v2.6',
      subtitle: 'PRO ACTIVE',
      landmark: 'LANDMARK:',
      taipei101Loc: 'TAIPEI 101 [TAIWAN] // 25.0330° N',
      eiffelLoc: 'EIFFEL TOWER [FRANCE] // 48.8584° N',
      tokyoLoc: 'TOKYO TOWER [JAPAN] // 35.6586° N',
      bridgeLoc: 'GOLDEN GATE [USA] // 37.8199° N',
      simActive: 'SIMULATOR ACTIVE | SWARMS:',
      pldFlying: 'PLD FLYING',
      groundRes: 'GROUND RES',
      launchBtn: 'Launch Spark',
      disk: 'DISK: 12.4GB COMPACTED',
      vram: 'VRAM: 8.2GB FREE',
      audioCap: 'AUDIO CAP: WEB_AUDIO ENGINE',
      renderEngine: 'RENDER ENGINE: WEBGL_THREE_DENSITY',
      session: 'SESSION: PRO_SIMULATION_ACTIVE',
      pv: 'VIEWS:',
      uv: 'VISITORS:'
    }
  };

  // 1. Initial Landmarks and Scene defaults
  const [landmarkId, setLandmarkId] = useState<LandmarkId>('taipei101');
  const [dronesActive, setDronesActive] = useState<boolean>(true);
  const [launchTrigger, setLaunchTrigger] = useState<number>(0);
  const [totalLaunches, setTotalLaunches] = useState<number>(0);

  // 2. Initial parameters for firework particle physics
  const [fireworkParams, setFireworkParams] = useState<FireworkParams>({
    type: 'peony',
    colorPreset: 'rainbow',
    primaryColor: '#ff2a85',
    secondaryColor: '#00dfff',
    particleCount: 180,
    size: 1.8,
    speed: 24,
    trailLength: 3,
    gravity: 0.9,
    altitude: 60,
    soundEnabled: true,
    soundVolume: 0.4
  });

  // 3. Dynamic programmable drones
  const [droneParams, setDroneParams] = useState<DroneParams>({
    pattern: 'text',
    customText: '101',
    droneCount: 180,
    color: '#00dfff',
    glowStrength: 1.5,
    flyingSpeed: 4,
    height: 48,
    scale: 2.5
  });

  // 4. Nightstar environment configurations
  const [atmosphere, setAtmosphere] = useState<AtmosphereSettings>({
    starDensity: 180,
    reflectionIntensity: 0.65,
    soundVolume: 0.4,
    bloomEnabled: true,
    timeOfDay: 'night',
    showGrid: false
  });

  // Launch button trigger inside App shell
  const handleLaunchSingle = () => {
    setLaunchTrigger((prev) => prev + 1);
  };

  const handleFireworkCountIncrement = () => {
    setTotalLaunches((prev) => prev + 1);
  };

  return (
    <div className="w-screen h-screen bg-[#0A0A0C] text-[#E0E0E0] flex flex-col overflow-hidden font-sans select-none border border-[#2A2A2E]" id="app_root_layout">
      {/* Top Navigation Visual Header */}
      <header className="h-14 border-b border-[#2A2A2E] bg-[#141417] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-lg relative" id="main_app_header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded flex items-center justify-center shadow-lg shadow-indigo-500/10" id="app_logo_badge">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                {t[lang].title}
              </span>
              <span className="px-1.5 py-0.5 bg-[#2A2A2E] border border-slate-700 text-[8px] font-mono text-cyan-300 font-semibold rounded">
                {t[lang].subtitle}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 font-mono uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-indigo-500" />
              <span>{t[lang].landmark}</span>
              <span className="text-gray-300 text-[9px] sm:text-[10px]">
                {landmarkId === 'taipei101' && t[lang].taipei101Loc}
                {landmarkId === 'eiffel' && t[lang].eiffelLoc}
                {landmarkId === 'tokyo' && t[lang].tokyoLoc}
                {landmarkId === 'bridge' && t[lang].bridgeLoc}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicators Bar */}
        <div className="flex items-center gap-2 sm:gap-4" id="header_status_indicators">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#2A2A2E] border border-slate-700 rounded p-0.5" id="lang_switcher">
            <button
              onClick={() => setLang('zh-TW')}
              className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold font-mono transition-all cursor-pointer ${
                lang === 'zh-TW' 
                  ? 'bg-indigo-650 text-white border border-indigo-500/50 shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
              id="lang_btn_zh"
            >
              繁中
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold font-mono transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-indigo-650 text-white border border-indigo-500/50 shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
              id="lang_btn_en"
            >
              EN
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-gray-400" id="active_drones_label">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t[lang].simActive}</span>
            <span className={`font-bold ${dronesActive ? 'text-emerald-400' : 'text-gray-500'}`}>
              {dronesActive ? `${droneParams.droneCount} ${t[lang].pldFlying}` : t[lang].groundRes}
            </span>
          </div>
          <div className="w-px h-4 bg-[#2A2A2E] hidden lg:block" />
          
          {/* Main big launch button */}
          <button
            onClick={handleLaunchSingle}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[11px] rounded transition-all uppercase font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/15 font-mono"
            id="btn_launch_firework_main"
          >
            <Zap className="w-3 h-3 fill-current" />
            {t[lang].launchBtn}
          </button>
        </div>
      </header>

      {/* Main split workarea grid (Sidebar + 3D Viewport) */}
      <main className="flex-1 w-full overflow-hidden flex flex-col-reverse lg:flex-row p-3 gap-3 bg-[#0A0A0C]" id="main_app_workspace">
        {/* Left Parameter Adjustment Control Panel */}
        <Sidebar
          landmarkId={landmarkId}
          setLandmarkId={setLandmarkId}
          fireworkParams={fireworkParams}
          setFireworkParams={setFireworkParams}
          droneParams={droneParams}
          setDroneParams={setDroneParams}
          atmosphere={atmosphere}
          setAtmosphere={setAtmosphere}
          dronesActive={dronesActive}
          setDronesActive={setDronesActive}
          totalLaunches={totalLaunches}
          lang={lang}
        />

        {/* Right 3D WebGL Scene Interactive Simulator */}
        <div className="flex-1 h-full min-h-[300px] lg:min-h-0 relative bg-[#000000] rounded-xl overflow-hidden border border-[#2A2A2E]" id="viewport_canvas_container">
          <Viewport
            landmarkId={landmarkId}
            fireworkParams={fireworkParams}
            droneParams={droneParams}
            atmosphere={atmosphere}
            launchTrigger={launchTrigger}
            dronesActive={dronesActive}
            setDronesActive={setDronesActive}
            onFireworkLaunched={handleFireworkCountIncrement}
            lang={lang}
          />
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-6 bg-[#0A0A0C] border-t border-[#2A2A2E] px-4 flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase tracking-tighter shrink-0 select-none">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <Eye className="w-2.5 h-2.5 text-indigo-400" />
            <span>{t[lang].pv}</span>
            <span id="vercount_value_site_pv" className="text-gray-300">--</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-2.5 h-2.5 text-indigo-400" />
            <span>{t[lang].uv}</span>
            <span id="vercount_value_site_uv" className="text-gray-300">--</span>
          </div>
          <div className="w-px h-2.5 bg-[#2A2A2E]" />
          <span>{t[lang].disk}</span>
          <span>{t[lang].vram}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-indigo-400">{t[lang].renderEngine}</span>
          <span>{t[lang].session}</span>
        </div>
      </footer>
    </div>
  );
}
