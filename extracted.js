





        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Rajdhani', 'sans-serif'],
                        mono: ['Share Tech Mono', 'monospace'],
                        led: ['VT323', 'monospace'],
                    },
                    colors: {
                        cmd: {
                            bg: '#01050e',
                            panel: '#041024',
                            border: '#1a365d',
                            accent: '#ffb300',
                            irblue: '#003399',
                            text: '#a0aec0',
                            bright: '#ffffff',
                            danger: '#ff3333',
                            warning: '#ff9933',
                            success: '#00ff66'
                        }
                    }
                }
            }
        }
    

        // Boot Animation Logic
        window.addEventListener('DOMContentLoaded', () => {
            const overlay = document.getElementById('boot-overlay');
            if (overlay) {
                // Start bar progression
                setTimeout(() => {
                    const barInner = document.getElementById('boot-bar-inner');
                    if (barInner) barInner.style.width = '100%';
                }, 50);

                setTimeout(() => document.querySelector('.boot-status-1').style.opacity = '1', 800);
                setTimeout(() => document.querySelector('.boot-status-2').style.opacity = '1', 1800);
                setTimeout(() => document.querySelector('.boot-status-3').style.opacity = '1', 2800);

                // Transition to Login Screen with cross-fade
                setTimeout(() => {
                    const bootSeq = document.getElementById('boot-sequence');
                    const loginSeq = document.getElementById('login-sequence');

                    bootSeq.style.transition = 'opacity 0.5s ease-out';
                    bootSeq.style.opacity = '0';

                    setTimeout(() => {
                        bootSeq.style.display = 'none';
                        loginSeq.style.opacity = '0';
                        loginSeq.style.display = 'flex';
                        loginSeq.style.transition = 'opacity 0.5s ease-in';

                        setTimeout(() => {
                            loginSeq.style.opacity = '1';
                        }, 50);
                    }, 500);
                }, 3800);
            }
        });

        function executeLogin() {
            const btn = document.getElementById('login-btn');
            const status = document.getElementById('login-status');
            btn.innerHTML = 'VERIFYING CREDENTIALS...';
            btn.style.pointerEvents = 'none';
            btn.className = "w-full bg-gray-800 text-gray-400 font-bold tracking-widest py-3 uppercase transition-all duration-300";

            status.style.opacity = '1';
            status.className = "text-[10px] font-mono mt-4 text-cmd-warning transition-opacity uppercase tracking-widest animate-pulse";
            status.innerText = ">> DECRYPTING SECURITY HANDSHAKE...";

            setTimeout(() => {
                status.className = "text-[10px] font-mono mt-4 text-cmd-success transition-opacity uppercase tracking-widest";
                status.innerText = ">> ACCESS GRANTED. ENTERING DASHBOARD...";

                setTimeout(() => {
                    const overlay = document.getElementById('boot-overlay');
                    if (overlay) {
                        overlay.style.opacity = '0';
                        setTimeout(() => overlay.remove(), 1000);
                    }
                }, 800);
            }, 1500);
        }
    

        lucide.createIcons();

        // ----------------------------------------------------
        // NAVIGATION LOGIC
        // ----------------------------------------------------
        function switchTab(tabId) {
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('bg-cmd-accent/10', 'text-cmd-accent', 'border-cmd-accent', 'shadow-[0_0_15px_rgba(255,179,0,0.2)]');
                btn.classList.add('text-gray-400', 'border-transparent');
            });
            const activeBtn = document.getElementById(`nav-${tabId}`);
            activeBtn.classList.remove('text-gray-400', 'border-transparent');
            activeBtn.classList.add('bg-cmd-accent/10', 'text-cmd-accent', 'border-cmd-accent', 'shadow-[0_0_15px_rgba(255,179,0,0.2)]');

            if (tabId === 'decision') {
                const dot = document.getElementById('decision-dot');
                if (dot) dot.remove();
            }

            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById(`tab-${tabId}`).classList.add('active');

            if (tabId === 'map') {
                if (!mapInitialized) {
                    setTimeout(() => initLeafletMap(), 100);
                } else {
                    setTimeout(() => map.invalidateSize(), 100);
                }
            }

            if (tabId === 'analytics') {
                setTimeout(initAnalytics, 100);
            }
        }

        // Clock Update
        setInterval(() => {
            document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-US', { hour12: false });
        }, 1000);

        // Micro-charts drawing
        function drawMicroChart(canvasId, color) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            const w = canvas.width; const h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.beginPath();
            ctx.moveTo(0, h);
            for (let i = 0; i < w; i += 10) {
                ctx.lineTo(i, h - (Math.random() * h * 0.8));
            }
            ctx.lineTo(w, h);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = color + '20';
            ctx.fill();
        }
        drawMicroChart('chart-1', '#00ff66');
        drawMicroChart('chart-2', '#00e5ff');
        setInterval(() => { drawMicroChart('chart-1', '#00ff66'); drawMicroChart('chart-2', '#00e5ff'); }, 3000);

        // ----------------------------------------------------
        // TELEMETRY LOGIC
        // ----------------------------------------------------
        let activeTelemetryTrain = null;

        function showTrainTelemetry(tObj) {
            activeTelemetryTrain = tObj;
            const panel = document.getElementById('map-left-panel');
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            setTimeout(() => map.invalidateSize(), 50);

            document.getElementById('tlm-train-id').innerHTML = `${tObj.trainNum} <div class="text-[12px] text-gray-400 uppercase mt-1 tracking-widest">${tObj.trainName || 'EXPRESS'}</div>`;
            document.getElementById('tlm-type').innerText = tObj.type || 'SUPERFAST';
            document.getElementById('tlm-from').innerText = tObj.from.name;
            document.getElementById('tlm-to').innerText = tObj.to.name;

            updateTelemetryUI();
        }

        function closeTelemetry() {
            activeTelemetryTrain = null;
            const panel = document.getElementById('map-left-panel');
            panel.classList.add('hidden');
            panel.classList.remove('flex');
            setTimeout(() => map.invalidateSize(), 50);
        }

        function calculateDistanceKM(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth radius in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

        function getPosOnPath(path, progress) {
            const segments = path.length - 1;
            const scaledProgress = progress * segments;
            const index = Math.floor(scaledProgress);
            if (index >= segments) return path[segments];

            const p1 = path[index];
            const p2 = path[index + 1];
            const localProgress = scaledProgress - index;

            return [
                p1[0] + (p2[0] - p1[0]) * localProgress,
                p1[1] + (p2[1] - p1[1]) * localProgress
            ];
        }

        function updateTelemetryUI() {
            const t = activeTelemetryTrain;
            if (!t) return;
            const isDelayed = t.isDelayed;
            document.getElementById('tlm-status').innerText = isDelayed ? 'ERR: DELAY DETECTED' : 'STATUS: NOMINAL';
            document.getElementById('tlm-status').className = isDelayed ? 'text-cmd-danger mt-1' : 'text-cmd-success mt-1';

            const dot = document.getElementById('tlm-status-dot');
            dot.className = isDelayed ? 'status-dot red animate-pulse' : 'status-dot green animate-pulse';

            document.getElementById('tlm-progress').style.width = `${t.progress * 100}%`;
            document.getElementById('tlm-progress').className = isDelayed ? 'bg-cmd-danger h-full transition-all duration-1000' : 'bg-cmd-accent h-full transition-all duration-1000';

            // Real Estimated Speed Calculation using Speed = Distance / Time
            const distKm = calculateDistanceKM(t.from.coords[0], t.from.coords[1], t.to.coords[0], t.to.coords[1]);
            const totalSimulationSeconds = 1 / t.speed;

            // Assume 1 simulation second = 1 real minute (timeScale = 60)
            const timeScale = 60;
            const totalRealHours = (totalSimulationSeconds * timeScale) / 3600;
            let realSpeedKmh = distKm / totalRealHours;

            if (isDelayed) {
                realSpeedKmh = realSpeedKmh * 0.15; // Realistic slowdown due to delay
            }

            // Add a slight (+/- 3 km/h) natural fluctuation
            realSpeedKmh += (Math.random() * 6) - 3;

            // Speed limit bounds based on Indian Railways realistic caps
            if (realSpeedKmh > 160) realSpeedKmh = 130 + Math.random() * 20; // Vande Bharat/Gatimaan max
            if (realSpeedKmh < 0) realSpeedKmh = 0;

            document.getElementById('tlm-speed').innerText = Math.floor(realSpeedKmh);

            const pos = getPosOnPath(t.path, t.progress);
            const currentLat = pos[0];
            const currentLng = pos[1];
            document.getElementById('tlm-lat').innerText = currentLat.toFixed(5);
            document.getElementById('tlm-lng').innerText = currentLng.toFixed(5);
            document.getElementById('tlm-load').innerText = 70 + Math.floor(Math.random() * 25);

            // AI Delay Prediction Engine Simulation
            let delayProb = Math.floor(Math.random() * 25); // Baseline 0-25%
            if (isDelayed) {
                delayProb = 85 + Math.floor(Math.random() * 14); // 85-99% if actually delayed
            } else if (t.progress > 0.8 && realSpeedKmh < 40) {
                delayProb = 60 + Math.floor(Math.random() * 20); // 60-80% if slow near destination
            }
            const delayBar = document.getElementById('tlm-ai-delay-bar');
            delayBar.style.width = `${delayProb}%`;
            document.getElementById('tlm-ai-delay-val').innerText = `${delayProb}%`;

            if (delayProb > 75) {
                delayBar.className = 'bg-cmd-danger h-full transition-all duration-1000';
                document.getElementById('tlm-ai-delay-val').className = 'text-base text-cmd-danger font-bold w-10 text-right blink';
            } else if (delayProb > 40) {
                delayBar.className = 'bg-cmd-warning h-full transition-all duration-1000';
                document.getElementById('tlm-ai-delay-val').className = 'text-base text-cmd-warning font-bold w-10 text-right';
            } else {
                delayBar.className = 'bg-cmd-success h-full transition-all duration-1000';
                document.getElementById('tlm-ai-delay-val').className = 'text-base text-cmd-bright font-bold w-10 text-right';
            }

            drawMicroChart('tlm-chart', isDelayed ? '#ff2a2a' : '#00e5ff');

            // Trigger Lucide icons refresh for newly injected icons if needed
            if (window.lucide) window.lucide.createIcons();
        }

        // ----------------------------------------------------
        // TACTICAL MAP LOGIC
        // ----------------------------------------------------
        let mapInitialized = false;
        let map;
        let baseLayer;
        let heatLayer;
        let isHeatmapActive = false;
        const trains = [];

        function toggleHeatmap() {
            isHeatmapActive = document.getElementById('heatmap-toggle').checked;
            if (isHeatmapActive) {
                if (!heatLayer) {
                    const heatPoints = [];
                    // New Delhi
                    for (let i = 0; i < 150; i++) heatPoints.push([28.6139 + (Math.random() - 0.5) * 0.2, 77.2090 + (Math.random() - 0.5) * 0.2, Math.random()]);
                    // Mumbai
                    for (let i = 0; i < 120; i++) heatPoints.push([18.9400 + (Math.random() - 0.5) * 0.15, 72.8354 + (Math.random() - 0.5) * 0.15, Math.random()]);
                    // Howrah
                    for (let i = 0; i < 90; i++) heatPoints.push([22.5833 + (Math.random() - 0.5) * 0.15, 88.3167 + (Math.random() - 0.5) * 0.15, Math.random()]);
                    // Chennai
                    for (let i = 0; i < 70; i++) heatPoints.push([13.0827 + (Math.random() - 0.5) * 0.15, 80.2707 + (Math.random() - 0.5) * 0.15, Math.random()]);

                    heatLayer = L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 10, max: 1.0, gradient: { 0.4: 'blue', 0.6: 'cyan', 0.8: 'yellow', 1.0: 'red' } }).addTo(map);
                } else {
                    map.addLayer(heatLayer);
                }
                document.querySelectorAll('.train-marker').forEach(el => el.style.opacity = '0.3');
            } else {
                if (heatLayer) map.removeLayer(heatLayer);
                document.querySelectorAll('.train-marker').forEach(el => el.style.opacity = '1');
            }
        }

        const tileUrls = {
            'osm': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'satellite': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        };

        const railwayZones = {
            'NR': {
                name: 'NORTHERN RAILWAY', color: '#3b82f6', stations: [
                    { name: 'NDLS', coords: [28.6139, 77.2090] }, { name: 'LKO', coords: [26.8467, 80.9462] }, { name: 'ASR', coords: [31.6340, 74.8723] },
                    { name: 'CNB', coords: [26.4499, 80.3319] }, { name: 'PRYJ', coords: [25.4358, 81.8463] }, { name: 'BSB', coords: [25.3176, 82.9739] },
                    { name: 'AGC', coords: [27.1767, 78.0081] }, { name: 'GKP', coords: [26.7606, 83.3732] }, { name: 'VGLJ', coords: [25.4484, 78.5685] },
                    { name: 'MTJ', coords: [27.4924, 77.6737] }, { name: 'AY', coords: [26.7922, 82.1998] }, { name: 'UMB', coords: [30.3398, 76.8783] },
                    { name: 'LDH', coords: [30.9010, 75.8573] }, { name: 'JAT', coords: [32.7266, 74.8570] }, { name: 'DDN', coords: [30.3165, 78.0322] },
                    { name: 'CDG', coords: [30.7333, 76.7794] }
                ]
            },
            'WR': {
                name: 'WESTERN RAILWAY', color: '#a855f7', stations: [
                    { name: 'MMCT', coords: [18.9690, 72.8193] }, { name: 'ADI', coords: [23.0225, 72.5714] }, { name: 'ST', coords: [21.1702, 72.8311] },
                    { name: 'JP', coords: [26.9124, 75.7873] }, { name: 'JU', coords: [26.2389, 73.0243] }, { name: 'UDZ', coords: [24.5854, 73.7125] },
                    { name: 'BRC', coords: [22.3072, 73.1812] }, { name: 'RJT', coords: [22.3039, 70.8022] }, { name: 'INDB', coords: [22.7196, 75.8577] },
                    { name: 'UJN', coords: [23.1765, 75.7885] }, { name: 'RTM', coords: [23.3315, 75.0367] }
                ]
            },
            'CR': {
                name: 'CENTRAL RAILWAY', color: '#f97316', stations: [
                    { name: 'CSMT', coords: [18.9400, 72.8354] }, { name: 'PUNE', coords: [18.5204, 73.8567] }, { name: 'NGP', coords: [21.1458, 79.0882] },
                    { name: 'NK', coords: [19.9975, 73.7898] }, { name: 'BSL', coords: [21.0455, 75.8011] }, { name: 'AK', coords: [20.7059, 77.0082] },
                    { name: 'SUR', coords: [17.6599, 75.9064] }, { name: 'BPL', coords: [23.2599, 77.4126] }, { name: 'ET', coords: [22.6105, 77.7629] },
                    { name: 'JBP', coords: [23.1815, 79.9864] }, { name: 'R', coords: [21.2514, 81.6296] }, { name: 'BSP', coords: [22.0797, 82.1409] }
                ]
            },
            'SR': {
                name: 'SOUTHERN RAILWAY', color: '#22c55e', stations: [
                    { name: 'MAS', coords: [13.0827, 80.2707] }, { name: 'CBE', coords: [11.0168, 76.9558] }, { name: 'MDU', coords: [9.9252, 78.1198] },
                    { name: 'TVC', coords: [8.5241, 76.9366] }, { name: 'ERS', coords: [9.9816, 76.2999] }, { name: 'CLT', coords: [11.2588, 75.7804] },
                    { name: 'SBC', coords: [12.9716, 77.5946] }, { name: 'MYS', coords: [12.2958, 76.6394] }, { name: 'UBL', coords: [15.3647, 75.1240] },
                    { name: 'SC', coords: [17.3850, 78.4867] }, { name: 'BZA', coords: [16.5062, 80.6200] }, { name: 'VSKP', coords: [17.6868, 83.2185] },
                    { name: 'TPTY', coords: [13.6288, 79.4192] }
                ]
            },
            'ER': {
                name: 'EASTERN RAILWAY', color: '#eab308', stations: [
                    { name: 'HWH', coords: [22.5833, 88.3167] }, { name: 'ASN', coords: [23.6739, 86.9524] }, { name: 'MLDT', coords: [25.0108, 88.1411] },
                    { name: 'PNBE', coords: [25.5941, 85.1376] }, { name: 'GAYA', coords: [24.7955, 85.0002] }, { name: 'DHN', coords: [23.7914, 86.4304] },
                    { name: 'RNC', coords: [23.3441, 85.3096] }, { name: 'BBS', coords: [20.2961, 85.8245] }, { name: 'PURI', coords: [19.8135, 85.8312] },
                    { name: 'GHY', coords: [26.1445, 91.7362] }, { name: 'DBRG', coords: [27.4728, 94.9120] }, { name: 'NJP', coords: [26.6849, 88.4417] }
                ]
            }
        };

        function bindTrainPopup(marker, trainNum, trainName, zoneId, zone, from, to, isDelayed) {
            marker.bindPopup(`
                <div class="border-b border-[#1a365d] pb-1 mb-1 flex justify-between items-end">
                    <div>TRN: <span class="text-cmd-bright">${trainNum}</span> <span class="text-[11px] uppercase text-gray-400 ml-1">${trainName}</span></div>
                    <div class="text-[11px] ml-2">[${zoneId}]</div>
                </div>
                <div class="text-[12px] text-gray-400">SRC: <span class="text-cmd-bright">${from.name}</span></div>
                <div class="text-[12px] text-gray-400">DST: <span class="text-cmd-bright">${to.name}</span></div>
                <div class="text-[12px] mt-1 text-${isDelayed ? 'cmd-danger' : 'cmd-success'}">${isDelayed ? 'ERR: DELAY DETECTED' : 'STATUS: NOMINAL'}</div>
            `);
        }

        function changeMapStyle(style) {
            if (baseLayer) baseLayer.setUrl(tileUrls[style]);
        }

        function initLeafletMap() {
            mapInitialized = true;
            map = L.map('live-map', { zoomControl: false, attributionControl: false }).setView([22.5, 78.5], 5);
            L.control.zoom({ position: 'topright' }).addTo(map);

            baseLayer = L.tileLayer(tileUrls['osm'], { maxZoom: 19 }).addTo(map);
            L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', { maxZoom: 19, opacity: 0.6 }).addTo(map);

            // Update HUD
            map.on('move', () => {
                const center = map.getCenter();
                document.getElementById('hud-lat').innerText = center.lat.toFixed(4);
                document.getElementById('hud-lng').innerText = center.lng.toFixed(4);
                document.getElementById('hud-zoom').innerText = map.getZoom();
            });
            map.fire('move'); // initial set

            // Handle Zoom based train visibility
            map.on('zoomend', () => {
                filterTrainsByZone(document.getElementById('zone-filter').value);
            });

            // Digital Twin Congestion Halos (Simulated Network Load)
            const congestedStations = [
                { coords: [28.6139, 77.2090], color: '#ff2a2a', radius: 25000, label: 'NDLS (Critical)' },
                { coords: [18.9400, 72.8354], color: '#ffb300', radius: 15000, label: 'CSMT (Heavy)' },
                { coords: [22.5833, 88.3167], color: '#00ff66', radius: 10000, label: 'HWH (Moderate)' }
            ];

            congestedStations.forEach(st => {
                L.circle(st.coords, {
                    color: st.color,
                    fillColor: st.color,
                    fillOpacity: 0.15,
                    radius: st.radius,
                    weight: 2,
                    dashArray: '4, 8'
                }).addTo(map).bindTooltip(st.label, { direction: 'top', className: 'font-mono text-sm text-white bg-black border border-gray-800' });
            });

            // Helper: Generate a curved path
            window.generateCurvedPath = function (start, end) {
                const lat1 = start[0], lng1 = start[1];
                const lat2 = end[0], lng2 = end[1];
                const midLat = (lat1 + lat2) / 2;
                const midLng = (lng1 + lng2) / 2;
                const dLat = lat2 - lat1;
                const dLng = lng2 - lng1;

                // Geographical center of India (approx. Nagpur)
                const centerOfIndia = [21.15, 79.09];
                const oMag = 0.1 + Math.random() * 0.1; // Randomize curve intensity

                // Test both curve directions
                const midLat1 = midLat - dLng * oMag;
                const midLng1 = midLng + dLat * oMag;
                const dist1 = Math.pow(midLat1 - centerOfIndia[0], 2) + Math.pow(midLng1 - centerOfIndia[1], 2);

                const midLat2 = midLat - dLng * (-oMag);
                const midLng2 = midLng + dLat * (-oMag);
                const dist2 = Math.pow(midLat2 - centerOfIndia[0], 2) + Math.pow(midLng2 - centerOfIndia[1], 2);

                // Prefer the curve that pushes the route inland (closer to center of India) to avoid oceans
                let finalOffset = (dist1 < dist2) ? oMag : -oMag;

                // If it's already an inland route (within ~500km of center), allow random flip for variation
                if (Math.min(dist1, dist2) < 25 && Math.random() > 0.6) {
                    finalOffset = -finalOffset;
                }

                const p1 = [lat1 + dLat * 0.33 - dLng * finalOffset, lng1 + dLng * 0.33 + dLat * finalOffset];
                const p2 = [lat1 + dLat * 0.66 - dLng * finalOffset, lng1 + dLng * 0.66 + dLat * finalOffset];

                return [start, p1, p2, end];
            }



            function getAngle(p1, p2) {
                const dy = p2[0] - p1[0];
                const dx = Math.cos(Math.PI / 180 * p1[0]) * (p2[1] - p1[1]);
                let angle = Math.atan2(dx, dy) * 180 / Math.PI;
                return angle;
            }

            // Generate initial trains
            Object.keys(railwayZones).forEach(zoneId => {
                const zone = railwayZones[zoneId];
                const trainCounts = [
                    { count: 3, type: 'VANDE BHARAT', minZoom: 0, scale: 1.2 },
                    { count: 4, type: 'RAJDHANI', minZoom: 0, scale: 1.0 },
                    { count: 12, type: 'SUPERFAST', minZoom: 5, scale: 0.8 },
                    { count: 15, type: 'PASSENGER', minZoom: 8, scale: 0.6 }
                ];

                trainCounts.forEach(tier => {
                    for (let i = 0; i < tier.count; i++) {
                        const from = zone.stations[Math.floor(Math.random() * zone.stations.length)];
                        let to = zone.stations[Math.floor(Math.random() * zone.stations.length)];

                        if (tier.type === 'express' && Math.random() > 0.7) {
                            const allKeys = Object.keys(railwayZones);
                            const rZone = railwayZones[allKeys[Math.floor(Math.random() * allKeys.length)]];
                            to = rZone.stations[Math.floor(Math.random() * rZone.stations.length)];
                        } else {
                            while (to.name === from.name) to = zone.stations[Math.floor(Math.random() * zone.stations.length)];
                        }

                        const isDelayed = Math.random() > 0.85;
                        const path = generateCurvedPath(from.coords, to.coords);

                        // Draw Digital Twin Route Polyline (Curved)
                        L.polyline(path, {
                            color: zone.color,
                            weight: 2,
                            opacity: 0.15,
                            dashArray: '5, 10',
                            smoothFactor: 1
                        }).addTo(map);

                        // Generate authentic-sounding dynamic train names and numbers based on actual route
                        let prefix = '1';
                        if (tier.type === 'VANDE BHARAT') prefix = '22';
                        else if (tier.type === 'RAJDHANI') prefix = '12';
                        else if (tier.type === 'PASSENGER') prefix = '50';

                        const trainNumber = prefix + (Math.floor(Math.random() * 900) + 100).toString();

                        let trainName = `${from.name} - ${to.name} Express`;
                        if (tier.type === 'VANDE BHARAT') trainName = `${to.name} Vande Bharat`;
                        else if (tier.type === 'RAJDHANI') trainName = `${to.name} Rajdhani`;
                        else if (tier.type === 'SUPERFAST') trainName = `${from.name} - ${to.name} SF Express`;
                        else if (tier.type === 'PASSENGER') trainName = `${from.name} - ${to.name} Passenger`;

                        const trnObj = { num: trainNumber, name: trainName };
                        const progress = Math.random();
                        const currentPos = getPosOnPath(path, progress);

                        const svgTrain = `
                            <div style="transform: scale(${tier.scale}) rotate(0deg);" class="train-icon-wrapper ${isDelayed ? 'delayed' : ''}">
                                <svg width="14" height="28" viewBox="0 0 14 28" style="filter: drop-shadow(0 0 4px ${zone.color});">
                                    <rect x="2" y="2" width="10" height="24" rx="3" fill="${isDelayed ? '#ff3333' : zone.color}" stroke="#fff" stroke-width="0.5"/>
                                    <rect x="3" y="4" width="8" height="5" rx="1" fill="#000"/>
                                    <rect x="3" y="10" width="8" height="2" fill="rgba(0,0,0,0.3)"/>
                                </svg>
                            </div>
                        `;
                        const icon = L.divIcon({ html: svgTrain, className: '', iconSize: [14, 28], iconAnchor: [7, 14] });
                        const marker = L.marker(currentPos, { icon }).addTo(map);

                        bindTrainPopup(marker, trnObj.num, trnObj.name, zoneId, zone, from, to, isDelayed);
                        marker.on('add', function () {
                            const element = marker.getElement();
                            if (element) {
                                element.setAttribute('data-zone', zoneId);
                                if (map.getZoom() < tier.minZoom) element.style.display = 'none';
                            }
                        });

                        const tObj = { marker, zoneId, trainNum: trnObj.num, trainName: trnObj.name, from, to, path, progress, speed: (Math.random() * 0.005) + 0.001, isDelayed, hasTriggeredEvent: isDelayed, type: tier.type, minZoom: tier.minZoom };

                        marker.on('click', () => { showTrainTelemetry(tObj); });
                        trains.push(tObj);
                    }
                });
            });

            let lastTime = 0;
            let lastUIUpdate = 0;
            let lastAnomalyTime = -5000;

            function animateTrains(time) {
                if (!lastTime) lastTime = time;
                const deltaTime = time - lastTime;
                lastTime = time;

                const speedMultiplier = deltaTime / 1000;

                trains.forEach(t => {
                    const oldPos = getPosOnPath(t.path, t.progress);
                    t.progress += t.speed * speedMultiplier;

                    if (t.progress > 1) {
                        t.progress = 0;
                        const temp = t.from; t.from = t.to; t.to = temp;
                        t.path = generateCurvedPath(t.from.coords, t.to.coords);
                        t.hasTriggeredEvent = false;
                        t.hasTriggeredGeoFence = false;
                        t.loggedDeparture = false;
                        t.loggedArrival = false;
                    }

                    const newPos = getPosOnPath(t.path, t.progress);
                    t.marker.setLatLng(newPos);

                    // Rotate the icon wrapper based on heading
                    const angle = getAngle(oldPos, newPos);
                    const el = t.marker.getElement();
                    if (el) {
                        const wrapper = el.querySelector('.train-icon-wrapper');
                        if (wrapper) wrapper.style.transform = `scale(${t.type === 'VANDE BHARAT' ? 1.2 : 0.8}) rotate(${angle}deg)`;
                    }

                    // GEO-FENCE COLLISION LOGIC
                    if (window.activeGeoFences && window.activeGeoFences.length > 0 && !t.hasTriggeredGeoFence) {
                        for (let fence of window.activeGeoFences) {
                            if (!fence.triggeredTrains.has(t.trainNum)) {
                                if ((t.from.name === fence.start && t.to.name === fence.end) ||
                                    (t.from.name === fence.end && t.to.name === fence.start)) {

                                    fence.triggeredTrains.add(t.trainNum);
                                    t.hasTriggeredGeoFence = true;
                                    t.speed = t.speed * 0.1; // Slow down severely

                                    if (el) el.querySelector('.train-icon-wrapper').classList.add('delayed');
                                    bindTrainPopup(t.marker, t.trainNum, t.trainName, t.zoneId, railwayZones[t.zoneId], t.from, t.to, true);

                                    logAgent(`<span class='text-cmd-danger'>[OPS] GEO-FENCE BREACH: TRN_${t.trainNum} ENTERED ${fence.name}</span>`);
                                    generateGeoFenceDecision(t.trainNum, fence.name, fence.start, fence.end, t.zoneId);
                                }
                            }
                        }
                    }

                    // DEMO ACTION: Randomly trigger a live event on a train while it's moving
                    if (time - lastAnomalyTime > 10000) {
                        if (!t.hasTriggeredEvent && !t.isDelayed && t.progress > 0.3 && t.progress < 0.7 && Math.random() < 0.05) {
                            lastAnomalyTime = time;
                            t.hasTriggeredEvent = true;
                            t.isDelayed = true;
                            t.speed = t.speed * 0.1; // Train slows down severely

                            if (el) el.querySelector('.train-icon-wrapper').classList.add('delayed');
                            bindTrainPopup(t.marker, t.trainNum, t.trainName, t.zoneId, railwayZones[t.zoneId], t.from, t.to, true);

                            logAgent(`<span class='text-cmd-danger'>[OPS] ANOMALY DETECTED: TRN_${t.trainNum} REPORTING CRITICAL FAILURE EN ROUTE TO ${t.to.name}.</span>`);
                            generateLiveDecision(t.trainNum, t.from.name, t.to.name, t.zoneId);
                        }
                    }

                    // Map Movement Alerts
                    if (t.type === 'VANDE BHARAT') {
                        if (t.progress > 0.05 && !t.loggedDeparture) {
                            t.loggedDeparture = true;
                            logAgent(`[NAV] TRN_${t.trainNum} DEPARTED FROM ${t.from.name.toUpperCase()}`, 'text-cmd-accent');
                        }
                        if (t.progress > 0.95 && !t.loggedArrival) {
                            t.loggedArrival = true;
                            logAgent(`[NAV] TRN_${t.trainNum} APPROACHING ${t.to.name.toUpperCase()}`, 'text-cmd-success');
                        }
                    }
                });

                if (time - lastUIUpdate > 3000) {
                    if (isHeatmapActive && heatLayer) {
                        const heatData = trains.map(t => {
                            const pos = getPosOnPath(t.path, t.progress);
                            return [pos[0], pos[1], t.isDelayed ? 1.5 : 1.0];
                        });
                        heatLayer.setLatLngs(heatData);
                    }

                    if (activeTelemetryTrain) {
                        updateTelemetryUI();
                    }
                    updateZoneRosterUI();
                    lastUIUpdate = time;
                }

                requestAnimationFrame(animateTrains);
            }
            requestAnimationFrame(animateTrains);

            // Trigger fetch for the Live 5 GPS roster
            setTimeout(fetchLiveRoster, 2000);
        }

        async function fetchLiveRoster() {
            logAgent(`[SYS] INITIALIZING LIVE GPS DATALINK FOR PRIORITY ROSTER...`, 'text-cmd-warning');
            const liveTrains = ['12951', '12301', '22436', '12627', '20833'];
            let fetchedCount = 0;

            for (const tNum of liveTrains) {
                // If API key is missing, inject realistic mock data to prevent rate limit/CORS crash
                if (RAPID_API_KEY === 'YOUR_RAPID_API_KEY_HERE') {
                    setTimeout(() => {
                        logAgent(`[API] MOCK GPS SYNC SUCCESS: TRN_${tNum}`, 'text-cmd-success');
                        fetchedCount++;
                        if (fetchedCount === liveTrains.length) logAgent(`[SYS] PRIORITY ROSTER DATALINK ESTABLISHED.`, 'text-cmd-success');
                    }, 500 * (liveTrains.indexOf(tNum) + 1));
                    continue;
                }

                try {
                    const response = await fetch(`https://${RAPID_API_HOST}/get_train_info?start=None&destination=None&train_no=${tNum}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-rapidapi-host': RAPID_API_HOST,
                            'x-rapidapi-key': RAPID_API_KEY
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.data && data.data.current_location_info) {
                            logAgent(`[API] GPS SYNC SUCCESS: TRN_${tNum}`, 'text-cmd-success');
                            // In a full implementation, we would plot the exact lat/lng returned here.
                            // For this digital twin, we inject it into the map simulation array.
                        } else {
                            logAgent(`[API] GPS DATALINK FAILED: TRN_${tNum}`, 'text-cmd-danger');
                        }
                    }
                } catch (e) {
                    logAgent(`[API] CONNECTION REFUSED: TRN_${tNum}`, 'text-cmd-danger');
                }

                // 1s delay between requests to avoid RapidAPI 429 Too Many Requests
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        // RAPIDAPI CONFIGURATION
        // API KEYS (Replace with your own keys for full functionality)
        const RAPID_API_KEY = 'YOUR_RAPID_API_KEY_HERE';
        const GROQ_API_KEY = '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'; // Get one free at console.groq.com
        
        const RAPID_API_HOST = 'indian-railways-train-fetcher.p.rapidapi.com';

        async function searchTrain() {
            const input = document.getElementById('train-search').value.trim();
            if (!input) return;
            document.getElementById('zone-filter').value = 'ALL';
            filterTrainsByZone('ALL');

            let foundTrain = trains.find(t => t.trainNum === input);

            if (!foundTrain) {
                logAgent(`[SYS] ATTEMPTING LIVE RAPIDAPI DATALINK FOR TRN_ID: ${input}...`, 'text-cmd-warning');

                let apiData = null;
                if (RAPID_API_KEY !== 'YOUR_RAPID_API_KEY_HERE') {
                    try {
                        const response = await fetch(`https://${RAPID_API_HOST}/get_train_info?start=None&destination=None&train_no=${input}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-rapidapi-host': RAPID_API_HOST,
                                'x-rapidapi-key': RAPID_API_KEY
                            }
                        });

                        if (response.ok) {
                            apiData = await response.json();
                            logAgent(`[SYS] RAPIDAPI LIVE DATALINK ESTABLISHED FOR ${input}.`, 'text-cmd-success');
                        } else {
                            logAgent(`[ERR] RAPIDAPI QUOTA EXCEEDED OR FAILED (Code ${response.status}). FALLING BACK TO LOCAL SIMULATION.`, 'text-cmd-danger');
                        }
                    } catch (e) {
                        logAgent(`[ERR] RAPIDAPI CONNECTION ERROR. FALLING BACK TO LOCAL SIMULATION.`, 'text-cmd-danger');
                    }
                } else {
                    logAgent(`[ERR] NO RAPIDAPI KEY FOUND. FALLING BACK TO LOCAL SIMULATION.`, 'text-cmd-danger');
                }

                // Parse API Data or use Fallback Simulation
                const allKeys = Object.keys(railwayZones);
                const zoneId = allKeys[Math.floor(Math.random() * allKeys.length)];
                const zone = railwayZones[zoneId];

                let from = zone.stations[Math.floor(Math.random() * zone.stations.length)];
                let to = zone.stations[Math.floor(Math.random() * zone.stations.length)];
                while (to.name === from.name) to = zone.stations[Math.floor(Math.random() * zone.stations.length)];

                let isDelayed = Math.random() > 0.5;
                let trainName = input + ' Express';
                let progress = Math.random();

                if (apiData && apiData.data) {
                    // Inject Real NTES Data
                    trainName = apiData.data.trainName || trainName;
                    isDelayed = apiData.data.delayInMins > 0;
                    if (apiData.data.currentStationName) {
                        from = { name: apiData.data.currentStationName, coords: from.coords };
                        progress = 0.1;
                    }
                }

                const currentLat = from.coords[0] + (to.coords[0] - from.coords[0]) * progress;
                const currentLng = from.coords[1] + (to.coords[1] - from.coords[1]) * progress;

                const htmlContent = `<div class="train-marker ${isDelayed ? 'delayed' : ''}" style="background-color: ${zone.color}; transform: scale(1.5) rotate(45deg);"></div>`;
                const icon = L.divIcon({ html: htmlContent, className: '', iconSize: [10, 10], iconAnchor: [5, 5] });
                const marker = L.marker([currentLat, currentLng], { icon }).addTo(map);

                bindTrainPopup(marker, input, trainName, zoneId, zone, from, to, isDelayed);
                marker.on('add', function () {
                    const el = marker.getElement();
                    if (el) el.setAttribute('data-zone', zoneId);
                });

                foundTrain = { marker, zoneId, trainNum: input, trainName, from, to, progress, speed: 0.002, isDelayed, hasTriggeredEvent: isDelayed, type: 'EXPRESS' };
                trains.push(foundTrain);

                logAgent(`[SYS] Tracking lock acquired for TRN_ID: ${input}`, 'text-cmd-accent');
            }

            map.flyTo(foundTrain.marker.getLatLng(), 8, { animate: true, duration: 1.5 });
            setTimeout(() => {
                foundTrain.marker.openPopup();
                document.getElementById('train-search').value = '';
                document.getElementById('train-search').blur();
                showTrainTelemetry(foundTrain);
            }, 1600);
        }

        function filterTrainsByZone(selectedZone) {
            const z = map.getZoom();
            trains.forEach(t => {
                const el = t.marker.getElement();
                if (el) {
                    const zoneMatch = (selectedZone === 'ALL' || t.zoneId === selectedZone);
                    const zoomMatch = (z >= (t.minZoom || 0));
                    el.style.display = (zoneMatch && zoomMatch) ? 'block' : 'none';
                }
            });
            map.closePopup();
            updateZoneRosterUI();
        }

        function updateZoneRosterUI() {
            const roster = document.getElementById('zone-roster-content');
            if (!roster) return;

            let html = '';

            // Group trains by zone
            const zoneGroups = {};
            for (let key in railwayZones) {
                zoneGroups[key] = [];
            }

            const filterEl = document.getElementById('zone-filter');
            const selectedZone = filterEl ? filterEl.value : 'ALL';

            trains.forEach((t, i) => {
                t._index = i;
                if (selectedZone !== 'ALL' && t.zoneId !== selectedZone) return;

                if (zoneGroups[t.zoneId]) {
                    zoneGroups[t.zoneId].push(t);
                }
            });

            for (let key in railwayZones) {
                if (zoneGroups[key].length === 0) continue;

                const zoneInfo = railwayZones[key];

                html += `
                    <div class="flex flex-col border border-gray-800 mb-2">
                        <div class="px-2 py-1 text-[12px] font-mono font-bold tracking-widest text-black flex justify-between items-center" style="background-color: ${zoneInfo.color}">
                            <span>ZONE: ${key}</span>
                            <span>${zoneGroups[key].length} ACTIVE</span>
                        </div>
                        <div class="flex flex-col bg-[#050505]">
                `;

                zoneGroups[key].forEach(t => {
                    const statusClass = t.isDelayed ? 'text-[#ff2a2a] blink' : 'text-[#ffb300]';
                    const statusText = t.isDelayed ? 'DELAYED' : 'ON-TIME';

                    html += `
                            <div class="flex justify-between items-center px-2 py-1.5 border-b border-gray-900 hover:bg-[#111] cursor-pointer font-led text-base tracking-widest" onclick="showTrainTelemetry(trains[${t._index}])">
                                <div class="flex flex-col w-20">
                                    <span class="text-[#ffb300]">${t.trainNum}</span>
                                    <span class="text-[10px] text-[#ff9933] opacity-80 truncate -mt-1 font-sans font-bold" title="${t.trainName}">${t.trainName || 'EXPRESS'}</span>
                                </div>
                                <span class="flex-1 text-left ml-2 text-[#ffb300] truncate" title="${t.from.name} - ${t.to.name}">${t.from.name.substring(0, 3).toUpperCase()}-${t.to.name.substring(0, 3).toUpperCase()}</span>
                                <span class="w-16 text-right ${statusClass}">${statusText}</span>
                            </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            }

            roster.innerHTML = html;
        }

        // ----------------------------------------------------
        // AGENT LOG GENERATOR (DEFINED FIRST - USED BY AI FUNCTIONS)
        // ----------------------------------------------------
        const agentLog = document.getElementById('agent-log');
        const logTemplates = [
            "[OPS] SCANNING SECTOR_7...",
            "<span class='text-cmd-danger'>[CRD] ALERT: CAPACITY EXCEEDED AT NDLS.</span>",
            "[SCH] RECALCULATING VECTORS.",
            "[PLT] ALLOCATING TRN_12951 TO PLAT_8.",
            "<span class='text-cmd-warning'>[SYS] MINOR PACKET LOSS DETECTED.</span>"
        ];
        function logAgent(msg, textClass = 'text-gray-500') {
            const time = new Date().toISOString().split('T')[1].slice(0, 11);
            const div = document.createElement('div');
            div.className = textClass;
            div.innerHTML = `<span class="text-gray-700 mr-2">[${time}]</span> ${msg}`;
            agentLog.appendChild(div);
            if (agentLog.children.length > 50) agentLog.removeChild(agentLog.firstChild);
            agentLog.scrollTop = agentLog.scrollHeight;
        }

        // ----------------------------------------------------
        // ----------------------------------------------------
        // AI CONFIGURATION
        // ----------------------------------------------------
        let conversationHistory = [];
        const MAX_HISTORY = 10;

        function updateAIStatus() {
            const statusEl = document.getElementById('ai-status');
            const dotEl = document.getElementById('ai-status-dot');
            statusEl.innerText = 'ONLINE';
            statusEl.className = 'text-cmd-success text-[13px]';
            dotEl.className = 'status-dot green animate-pulse';
        }
        updateAIStatus();

        function openSettings() {
            document.getElementById('settings-modal').classList.remove('hidden');
            lucide.createIcons();
        }
        function closeSettings() {
            document.getElementById('settings-modal').classList.add('hidden');
        }

        // CRIS AI System Prompt
        const SYSTEM_PROMPT = `You are CRIS (Centre for Railway Information Systems), the autonomous AI command and control system for Indian Railways National Rail Command center.

Your role:
- Analyze railway scenarios, incidents, delays, congestion, and operational queries
- Provide tactical recommendations in terse, military-style command center language
- Use UPPERCASE for station codes (NDLS, MMCT, HWH, MAS, CSMT, ADI, LKO, ASR, CBE, MDU, PUNE, NGP, ST, ASN, MLDT etc.), train IDs, zone codes (NR, WR, CR, SR, ER)
- Reference real Indian Railway infrastructure, stations, and operations
- Be decisive and action-oriented, like a mission control operator

You MUST respond ONLY in valid JSON (no markdown, no code blocks, no backticks) with this structure:
{
  "terminal_lines": ["Array of 2-5 short analysis lines for the command terminal"],
  "decisions": [
    {
      "severity": "CRITICAL" or "WARNING" or "INFO",
      "title": "Short impact description in CAPS",
      "actions": ["Action line 1", "Action line 2"],
      "confidence": 85,
      "node": "OPS" or "SCH" or "PLT" or "CRD"
    }
  ]
}

Rules:
- terminal_lines: 2-5 entries, each under 80 chars, prefixed with a tag like [ANALYSIS], [INTEL], [ROUTE], [ALERT], [FORECAST]
- decisions: 0-3 entries. Empty array [] if query is just informational or conversational.
- severity: CRITICAL = immediate action, WARNING = monitor, INFO = advisory
- confidence: 70-99 range
- node: which AI subsystem handles it (OPS=Operations, SCH=Scheduling, PLT=Platform, CRD=Crowd)
- Always respond as the railway AI, never break character`;

        // Build live system state snapshot for context
        function getSystemSnapshot() {
            const delayedTrains = trains.filter(t => t.isDelayed);
            return JSON.stringify({
                timestamp: new Date().toISOString(),
                activeTrains: trains.length,
                delayedCount: delayedTrains.length,
                delayedTrains: delayedTrains.slice(0, 8).map(t => ({
                    id: `TRN_${t.trainNum}`, zone: t.zoneId, type: t.type,
                    from: t.from.name, to: t.to.name,
                    progress: Math.round(t.progress * 100) + '%'
                })),
                pendingDecisions: pendingCount,
                zones: ['NR', 'WR', 'CR', 'SR', 'ER']
            });
        }

        // Call Free Local Simulated AI (No API keys, 100% Free, No Queues)
        async function callAI(userMessage, extraContext = null) {
            logAgent(`[AI] QUERY DISPATCHED → LOCAL NEURAL ENGINE`, 'text-cmd-accent');

            // Simulate network latency for realism
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

            const msg = (userMessage + " " + (extraContext || "")).toLowerCase();
            let response = {
                terminal_lines: [],
                decisions: []
            };

            // Dynamic Data Retrieval
            let trainMatch = msg.match(/(?:TRAIN|TRN)\s*_?#?(\d+)/i);
            let zoneMatch = msg.match(/\b(NR|WR|CR|SR|ER|NCR|NWR)\b/i);

            if (trainMatch) {
                const trnNum = trainMatch[1];
                const train = window.activeTrains ? window.activeTrains.find(t => t.id === 'TRN_' + trnNum) : null;
                if (train) {
                    response.terminal_lines = [
                        `[INTEL] LOCATED TRN_${trnNum} IN SYSTEM.`,
                        `[STATUS] CURRENT SPEED: ${train.speed} KM/H. PROGRESS: ${Math.floor(train.progress * 100)}%.`,
                        `[ROUTE] BOUND FOR ${train.end}.`
                    ];
                    if (train.speed < 30) {
                        response.decisions.push({ severity: "WARNING", title: `TRN_${trnNum} LOW SPEED DETECTED`, actions: ["Verify signal clearance", "Check for loco failure"], confidence: 88, node: "OPS" });
                    }
                } else {
                    response.terminal_lines = [
                        `[ERR] TRAIN TRN_${trnNum} NOT FOUND IN ACTIVE ROSTER.`,
                        `[INTEL] PLEASE VERIFY TRAIN NUMBER OR CHECK ARCHIVES.`
                    ];
                }
            } else if (zoneMatch) {
                const zone = zoneMatch[1].toUpperCase();
                const zoneTrains = window.activeTrains ? window.activeTrains.filter(t => t.zone === zone) : [];
                const avgSpeed = zoneTrains.length > 0 ? Math.floor(zoneTrains.reduce((acc, t) => acc + t.speed, 0) / zoneTrains.length) : 0;
                response.terminal_lines = [
                    `[ANALYSIS] ANALYZING ZONE ${zone} SECURE FEED.`,
                    `[STATUS] ACTIVE TRAINS IN ZONE: ${zoneTrains.length}.`,
                    `[METRICS] AVERAGE FLEET SPEED: ${avgSpeed} KM/H.`
                ];
                if (avgSpeed < 50) {
                    response.decisions.push({ severity: "WARNING", title: `${zone} CONGESTION ALERT`, actions: ["Divert freight traffic", "Clear loop lines"], confidence: 91, node: "SCH" });
                }
            } else if (msg.includes("emergency") || msg.includes("failure") || msg.includes("critical") || msg.includes("halted")) {
                const scenarios = [
                    {
                        lines: ["[ALERT] CRITICAL ANOMALY DETECTED.", "[INTEL] INITIATING RAPID RESPONSE.", "[ANALYSIS] ISOLATING SECTORS."],
                        dec: { severity: "CRITICAL", title: "EMERGENCY: TRACK ISOLATION", actions: ["Dispatch relief engine", "Halt trailing trains in 5km", "Alert track maintenance"], confidence: 96, node: "OPS" }
                    },
                    {
                        lines: ["[ALERT] TRACTION MOTOR FAILURE DETECTED.", "[INTEL] SPEED RESTRICTION IMPOSED.", "[ANALYSIS] REQUESTING LOCO SWAP."],
                        dec: { severity: "WARNING", title: "LOCOMOTIVE DEGRADATION", actions: ["Limit speed to 40km/h", "Alert next yard for loco swap", "Notify passengers of delay"], confidence: 89, node: "MECH" }
                    }
                ];
                const selected = scenarios[Math.floor(Math.random() * scenarios.length)];
                response.terminal_lines = selected.lines;
                response.decisions.push(selected.dec);
            } else if (msg.includes("delay") || msg.includes("late") || msg.includes("congestion")) {
                response.terminal_lines = [
                    "[ANALYSIS] DETECTED ABNORMAL CONGESTION PATTERNS.",
                    "[ROUTE] ALLOCATING SECONDARY TRACKS FOR HIGH PRIORITY TRANSITS.",
                    "[FORECAST] EXPECT 15 MIN RECOVERY IN AFFECTED ZONES."
                ];
                response.decisions.push({
                    severity: "WARNING",
                    title: "REROUTE PROTOCOL: CONGESTION RELIEF",
                    actions: ["Shift local traffic to loop lines", "Increase speed limit on main line by 5km/h"],
                    confidence: 88,
                    node: "SCH"
                });
            } else if (msg.includes("weather") || msg.includes("rain") || msg.includes("fog")) {
                response.terminal_lines = [
                    "[FORECAST] ADVERSE WEATHER CONDITIONS CONFIRMED.",
                    "[ALERT] VISIBILITY REDUCED ACCORDING TO SENSORS.",
                    "[ANALYSIS] ADJUSTING FLEET SPEED CAPS SYSTEM-WIDE."
                ];
                response.decisions.push({
                    severity: "INFO",
                    title: "WEATHER ADVISORY: SPEED REDUCTION",
                    actions: ["Enforce 60km/h speed cap in affected zone", "Activate enhanced fog signaling"],
                    confidence: 92,
                    node: "OPS"
                });
            } else {
                response.terminal_lines = [
                    "[INTEL] CUSTOM SCENARIO DETECTED.",
                    "[ANALYSIS] PROCESSING NON-STANDARD QUERY...",
                    "[FORECAST] GENERATING ADAPTIVE MITIGATION STRATEGY."
                ];
                response.decisions.push({
                    severity: msg.includes("critical") || msg.includes("overcrowd") ? "CRITICAL" : "WARNING",
                    title: "ADAPTIVE RESPONSE PROTOCOL",
                    actions: ["Deploy field agents", "Monitor situation via CCTV", "Prepare backup resources"],
                    confidence: 85,
                    node: "OPS"
                });
            }

            const latency = (0.8 + Math.random()).toFixed(1);
            logAgent(`[AI] RESPONSE OK. LATENCY: ${latency}s`, 'text-cmd-accent');

            // Save to history
            conversationHistory.push({ role: 'user', content: userMessage });
            conversationHistory.push({ role: 'assistant', content: JSON.stringify(response) });
            if (conversationHistory.length > MAX_HISTORY * 2) {
                conversationHistory = conversationHistory.slice(-MAX_HISTORY * 2);
            }

            return response;
        }

        // Display AI response in terminal and generate decision cards
        function displayAIResponse(result) {
            if (result.error) {
                output.innerHTML += `<div class="text-cmd-danger">[ERR] ${result.error}</div>`;
                output.scrollTop = output.scrollHeight;
                return;
            }

            // Display terminal lines with staggered typing effect
            if (result.terminal_lines && result.terminal_lines.length > 0) {
                result.terminal_lines.forEach((line, i) => {
                    setTimeout(() => {
                        output.innerHTML += `<div class="text-cmd-warning">[AI] ${line}</div>`;
                        output.scrollTop = output.scrollHeight;
                    }, i * 250);
                });
            }

            // Generate decision cards after terminal lines finish
            const totalDelay = (result.terminal_lines?.length || 0) * 250 + 400;
            setTimeout(() => {
                if (result.decisions && result.decisions.length > 0) {
                    output.innerHTML += `<div class="text-cmd-success">[OK] ${result.decisions.length} PROTOCOL(S) GENERATED. AWAITING MANUAL CONFIRMATION.</div>`;
                    output.scrollTop = output.scrollHeight;

                    const container = document.getElementById('decisions-container');
                    const emptyMsg = container.querySelector('.text-center');
                    if (emptyMsg) emptyMsg.style.display = 'none';

                    result.decisions.forEach(d => {
                        const borderColor = d.severity === 'CRITICAL' ? 'border-l-cmd-danger' : d.severity === 'WARNING' ? 'border-l-cmd-warning' : 'border-l-cyan-500';
                        const bgColor = d.severity === 'CRITICAL' ? 'bg-cmd-danger' : d.severity === 'WARNING' ? 'bg-cmd-warning' : 'bg-cyan-500';
                        const actionsHtml = d.actions.map(a => `&gt; ${a}`).join('<br>');

                        const html = `
                            <div class="cmd-panel p-4 border-l-4 ${borderColor} relative overflow-hidden text-sm font-mono mb-4" style="animation: dataLoad 0.5s linear forwards">
                                <div class="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                                    <div class="${bgColor} text-black px-1 font-bold ${d.severity === 'CRITICAL' ? 'animate-pulse' : ''}">REQ_TYPE: ${d.severity}</div>
                                    <div class="text-gray-500">NODE: ${d.node || 'OPS'} <span class="text-cmd-success ml-2">CONF_${d.confidence || 90}%</span></div>
                                </div>
                                <div class="text-white mb-4">${d.title}</div>
                                <div class="text-gray-400 mb-4">${actionsHtml}</div>
                                <div class="risk-gate-container" style="display: none;"></div>
                                <div class="flex gap-2 action-buttons">
                                    <button onclick="preActionRiskAssessment(this, '${d.title}', '${d.severity === 'CRITICAL' ? 'demo-critical' : 'demo-mixed'}', '${d.node || 'OPS'}')" class="flex-1 py-2 bg-[#000] border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black transition-colors font-bold tracking-widest">AUTHORIZE</button>
                                    <button onclick="resolveDecision(this, 'reject')" class="flex-1 py-2 bg-[#000] border border-cmd-danger text-cmd-danger hover:bg-cmd-danger hover:text-black transition-colors font-bold tracking-widest">DECLINE</button>
                                </div>
                            </div>
                        `;
                        container.insertAdjacentHTML('beforeend', html);
                        pendingCount++;
                    });
                    document.getElementById('pending-count').innerText = `${pendingCount} REQ`;
                } else {
                    output.innerHTML += `<div class="text-gray-500">[SYS] ANALYSIS COMPLETE. NO ACTION PROTOCOLS REQUIRED.</div>`;
                    output.scrollTop = output.scrollHeight;
                }
            }, totalDelay);
        }

        // ----------------------------------------------------
        // TERMINAL & DECISION LOGIC (AI-POWERED)
        // ----------------------------------------------------
        const form = document.getElementById('terminal-form');
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        let pendingCount = 0;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const val = input.value.trim().toUpperCase();
            if (!val) return;
            input.value = ''; input.disabled = true;

            output.innerHTML += `<div><span class="text-cmd-accent">&gt;</span> ${val}</div>`;
            output.scrollTop = output.scrollHeight;

            // Show processing indicator
            const processingId = 'proc-' + Date.now();
            setTimeout(() => {
                output.innerHTML += `<div id="${processingId}" class="ai-processing">[AI] PROCESSING QUERY VIA FREE AI...</div>`;
                output.scrollTop = output.scrollHeight;
            }, 300);

            try {
                const result = await callAI(val);
                const procEl = document.getElementById(processingId);
                if (procEl) procEl.remove();
                displayAIResponse(result);
            } catch (e) {
                const procEl = document.getElementById(processingId);
                if (procEl) procEl.remove();
                output.innerHTML += `<div class="text-cmd-danger">[ERR] UNEXPECTED SYSTEM FAILURE: ${e.message}</div>`;
                output.scrollTop = output.scrollHeight;
            }

            input.disabled = false;
            input.focus();
        });

        // Live event AI decision (triggered from map anomalies)
        async function generateLiveDecision(trainNum, fromName, toName, zoneId = 'NR') {
            const container = document.getElementById('decisions-container');
            const emptyMsg = container.querySelector('.text-center');
            if (emptyMsg) emptyMsg.style.display = 'none';

            let zoneGroup = document.getElementById('zone-group-' + zoneId);
            if (!zoneGroup) {
                zoneGroup = document.createElement('div');
                zoneGroup.id = 'zone-group-' + zoneId;
                zoneGroup.className = 'mb-6';
                const zoneTitle = railwayZones[zoneId] ? railwayZones[zoneId].name : zoneId;
                zoneGroup.innerHTML = `<div class="text-cmd-accent font-bold mb-3 border-b border-[#1a365d] pb-1 font-mono tracking-widest text-[11px] flex items-center gap-2">
                    <i data-lucide="map" class="w-3 h-3"></i> ZONE: ${zoneTitle} (${zoneId})
                </div><div class="zone-actions space-y-4"></div>`;
                container.append(zoneGroup);
                lucide.createIcons();
            }
            const actionsContainer = zoneGroup.querySelector('.zone-actions');

            const context = `LIVE ANOMALY ALERT: Train TRN_${trainNum} has experienced a critical failure and is halting between stations ${fromName} and ${toName}. Other trains on this route segment may be affected. Provide immediate tactical recommendations.`;

            logAgent(`<span class='text-cmd-danger'>[OPS] ANOMALY: TRN_${trainNum} CRITICAL FAILURE → ${toName}. AI ANALYZING...</span>`);

            const diversionNodes = {
                'NR': ['LUCKNOW (LKO)', 'AMBALA CANTT', 'MORADABAD'],
                'WR': ['SURAT', 'VADODARA', 'AHMEDABAD'],
                'CR': ['PUNE JN', 'KALYAN', 'BHUSAVAL'],
                'SR': ['ARAKKONAM', 'KATPADI', 'ERODE'],
                'ER': ['ASANSOL', 'DHANBAD', 'BARDDHAMAN'],
                'DEFAULT': ['KANPUR CENTRAL', 'NAGPUR', 'BHOPAL']
            };
            const nodesList = diversionNodes[zoneId] || diversionNodes['DEFAULT'];
            const diversionNode = nodesList[Math.floor(Math.random() * nodesList.length)];

            try {
                const result = await callAI(
                    `EMERGENCY: Train ${trainNum} critical failure en route ${fromName} to ${toName}. Recommend immediate actions.`,
                    context
                );

                if (!result.error && result.decisions && result.decisions.length > 0) {
                    result.decisions.forEach(d => {
                        const actionsHtml = d.actions.map(a => `&gt; ${a}`).join('<br>');
                        const html = `
                            <div class="cmd-panel p-4 border-l-4 border-l-cmd-danger relative overflow-hidden text-sm font-mono mb-4" style="animation: dataLoad 0.5s linear forwards">
                                <div class="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                                    <div class="bg-cmd-danger text-black px-1 font-bold animate-pulse">REQ_TYPE: LIVE ANOMALY</div>
                                    <div class="text-gray-500">NODE: ${d.node || 'OPS'} <span class="text-cmd-success ml-2">CONF_${d.confidence || 96}%</span></div>
                                </div>
                                <div class="text-white mb-4 text-cmd-danger">${d.title || 'CRITICAL FAULT: TRN_' + trainNum + ' HALTED EN ROUTE TO ' + toName}</div>
                                <div class="text-gray-400 mb-4">${actionsHtml}</div>

                                <!-- AI ALTERNATE ROUTE SIMULATION -->
                                <div class="bg-[#050505] border border-cmd-accent p-3 my-3">
                                    <div class="text-cmd-accent font-mono text-[12px] mb-2 flex justify-between">
                                        <span>AI ALTERNATE ROUTE SIMULATION</span>
                                        <i data-lucide="git-branch" class="w-3 h-3 animate-pulse"></i>
                                    </div>
                                    <div class="text-sm text-gray-300">
                                        <div class="flex justify-between items-center mb-1">
                                            <span>REROUTING VIA DIVERSION NODE:</span>
                                            <span class="text-white">${diversionNode}</span>
                                        </div>
                                        <div class="flex justify-between items-center mb-1">
                                            <span>NETWORK LOAD IMPACT:</span>
                                            <span class="text-cmd-warning">+4.2%</span>
                                        </div>
                                        <div class="flex justify-between items-center border-t border-gray-800 pt-1 mt-1">
                                            <span class="text-cmd-success font-bold">ESTIMATED TIME SAVED:</span>
                                            <span class="text-cmd-success font-bold blink">+45 MINS</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="risk-gate-container" style="display: none;"></div>
                                <div class="flex gap-2 mt-2 action-buttons">
                                    <button onclick="preActionRiskAssessment(this, '${d.title || 'CRITICAL FAULT: TRN_' + trainNum + ' HALTED'}', 'demo-critical', '${d.node || 'OPS'}')" class="flex-1 py-2 bg-[#000] border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black transition-colors font-bold tracking-widest">AUTHORIZE</button>
                                    <button onclick="resolveDecision(this, 'reject')" class="flex-1 py-2 bg-[#000] border border-cmd-danger text-cmd-danger hover:bg-cmd-danger hover:text-black transition-colors font-bold tracking-widest">DECLINE</button>
                                </div>
                            </div>
                        `;
                        actionsContainer.insertAdjacentHTML('beforeend', html);
                        pendingCount++;
                    });
                    document.getElementById('pending-count').innerText = `${pendingCount} REQ`;
                    if (window.lucide) window.lucide.createIcons();
                } else {
                    generateFallbackLiveDecision(trainNum, fromName, toName, zoneId);
                }
            } catch (e) {
                generateFallbackLiveDecision(trainNum, fromName, toName, zoneId);
            }

            // Notification dot on Decision Center nav tab
            const navBtn = document.getElementById('nav-decision');
            if (!navBtn.classList.contains('bg-cmd-accent/10') && !document.getElementById('decision-dot')) {
                navBtn.innerHTML += `<div id="decision-dot" class="absolute top-2 right-2 w-2 h-2 bg-cmd-danger rounded-full animate-pulse shadow-[0_0_8px_#ff2a2a]"></div>`;
            }
        }

        // Fallback decision card when AI is offline or errors
        function generateFallbackLiveDecision(trainNum, fromName, toName, zoneId = 'NR') {
            const container = document.getElementById('decisions-container');
            let zoneGroup = document.getElementById('zone-group-' + zoneId);
            if (!zoneGroup) {
                zoneGroup = document.createElement('div');
                zoneGroup.id = 'zone-group-' + zoneId;
                zoneGroup.className = 'mb-6';
                const zoneTitle = railwayZones[zoneId] ? railwayZones[zoneId].name : zoneId;
                zoneGroup.innerHTML = `<div class="text-cmd-accent font-bold mb-3 border-b border-[#1a365d] pb-1 font-mono tracking-widest text-[11px] flex items-center gap-2">
                    <i data-lucide="map" class="w-3 h-3"></i> ZONE: ${zoneTitle} (${zoneId})
                </div><div class="zone-actions space-y-4"></div>`;
                container.append(zoneGroup);
                if (window.lucide) window.lucide.createIcons();
            }
            const actionsContainer = zoneGroup.querySelector('.zone-actions');

            const diversionNodes = {
                'NR': ['LUCKNOW (LKO)', 'AMBALA CANTT', 'MORADABAD'],
                'WR': ['SURAT', 'VADODARA', 'AHMEDABAD'],
                'CR': ['PUNE JN', 'KALYAN', 'BHUSAVAL'],
                'SR': ['ARAKKONAM', 'KATPADI', 'ERODE'],
                'ER': ['ASANSOL', 'DHANBAD', 'BARDDHAMAN'],
                'DEFAULT': ['KANPUR CENTRAL', 'NAGPUR', 'BHOPAL']
            };
            const nodesList = diversionNodes[zoneId] || diversionNodes['DEFAULT'];
            const diversionNode = nodesList[Math.floor(Math.random() * nodesList.length)];

            let faultText = `CRITICAL FAULT: TRN_${trainNum} HALTED EN ROUTE TO ${toName}.`;
            if (window.liveGoogleNews && window.liveGoogleNews.length > 0) {
                let randomNews = window.liveGoogleNews[Math.floor(Math.random() * window.liveGoogleNews.length)];
                let newsTitle = randomNews.split('-')[0].trim();
                let cleanTitle = newsTitle.replace(/[^\w\s-]/g, '');
                
                // Extract only the fault keywords to keep it short
                const faultKeywords = ['ohe', 'fracture', 'failure', 'derail', 'cancel', 'fire', 'hit', 'break', 'crash', 'snap', 'delay', 'disrupt'];
                const words = cleanTitle.split(/\s+/);
                
                // Fallback: If no strict keyword is found, just use the clean title.
                // The RSS query is now extremely strict so this should rarely happen.
                let extractedFault = cleanTitle;
                
                for (let keyword of faultKeywords) {
                    const idx = words.findIndex(w => w.toLowerCase().includes(keyword));
                    if (idx !== -1) {
                        // Take up to 3 words before and 3 words after the keyword
                        const start = Math.max(0, idx - 3);
                        const end = Math.min(words.length, idx + 4);
                        extractedFault = words.slice(start, end).join(' ');
                        break;
                    }
                }
                
                // Convert past tense to present (basic heuristic) and inject actual train number
                extractedFault = extractedFault
                    .replace(/\bderailed\b/gi, "derails")
                    .replace(/\bfailed\b/gi, "fails")
                    .replace(/\bbroke\b/gi, "breaks")
                    .replace(/\bcrashed\b/gi, "crashes")
                    .replace(/\bhappened\b/gi, "happens")
                    .replace(/\bwas\b/gi, "is")
                    .replace(/\bwere\b/gi, "are")
                    .replace(/\bhit\b/gi, "hits")
                    .replace(/\bsnapped\b/gi, "snaps")
                    .replace(/\bcancelled\b/gi, "cancels")
                    // Replace "train", "trains", or numbers of trains with the real train number
                    .replace(/(?:\d+-\d+\s+)?\btrains?\b/gi, `TRN_${trainNum}`);

                faultText = `DETECTED: ${extractedFault.toUpperCase()} - TRN_${trainNum} HALTED.`;
            }

            const html = `
                <div class="cmd-panel p-4 border-l-4 border-l-cmd-danger relative overflow-hidden text-sm font-mono mb-4" style="animation: dataLoad 0.5s linear forwards">
                    <div class="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                        <div class="bg-cmd-danger text-black px-1 font-bold animate-pulse">REQ_TYPE: LIVE ANOMALY</div>
                        <div class="text-gray-500">NODE: MAIN <span class="text-cmd-success ml-2">CONF_96%</span></div>
                    </div>
                    <div class="text-white mb-4 text-cmd-danger font-bold">${faultText}</div>
                    <div class="text-gray-400 mb-4">&gt; ACTION: DISPATCH RELIEF UNIT FROM ${fromName}<br>&gt; ACTION: REROUTE TRAILING CONVOYS</div>

                    
                    <!-- AI ALTERNATE ROUTE SIMULATION -->
                    <div class="bg-[#050505] border border-cmd-accent p-3 my-3">
                        <div class="text-cmd-accent font-mono text-[12px] mb-2 flex justify-between">
                            <span>AI ALTERNATE ROUTE SIMULATION</span>
                            <i data-lucide="git-branch" class="w-3 h-3 animate-pulse"></i>
                        </div>
                        <div class="text-sm text-gray-300">
                            <div class="flex justify-between items-center mb-1">
                                <span>REROUTING VIA DIVERSION NODE:</span>
                                <span class="text-white">${diversionNode}</span>
                            </div>
                            <div class="flex justify-between items-center mb-1">
                                <span>NETWORK LOAD IMPACT:</span>
                                <span class="text-cmd-warning">+4.2%</span>
                            </div>
                            <div class="flex justify-between items-center border-t border-gray-800 pt-1 mt-1">
                                <span class="text-cmd-success font-bold">ESTIMATED TIME SAVED:</span>
                                <span class="text-cmd-success font-bold blink">+45 MINS</span>
                            </div>
                        </div>
                    </div>

                    <div class="risk-gate-container" style="display: none;"></div>
                    <div class="flex gap-2 mt-2 action-buttons">
                        <button onclick="preActionRiskAssessment(this, '${faultText.replace(/'/g, "\\'")}', 'demo-critical', 'MAIN')" class="flex-1 py-2 bg-[#000] border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black transition-colors font-bold tracking-widest">AUTHORIZE</button>
                        <button onclick="resolveDecision(this, 'reject')" class="flex-1 py-2 bg-[#000] border border-cmd-danger text-cmd-danger hover:bg-cmd-danger hover:text-black transition-colors font-bold tracking-widest">DECLINE</button>
                    </div>
                </div>
            `;
            actionsContainer.insertAdjacentHTML('beforeend', html);
            pendingCount++;
            document.getElementById('pending-count').innerText = `${pendingCount} REQ`;
            if (window.lucide) window.lucide.createIcons();
        }

        function toggleDecisionTab(tabName) {
            const pendingBtn = document.getElementById('tab-btn-pending');
            const resolvedBtn = document.getElementById('tab-btn-resolved');
            const pendingContainer = document.getElementById('decisions-container');
            const resolvedContainer = document.getElementById('resolved-container');

            if (tabName === 'pending') {
                pendingBtn.className = "font-mono text-sm text-cmd-warning uppercase flex items-center gap-2 border-b-2 border-cmd-warning pb-1 transition-colors";
                resolvedBtn.className = "font-mono text-sm text-gray-500 hover:text-white uppercase flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors";
                pendingContainer.classList.remove('hidden');
                resolvedContainer.classList.add('hidden');
            } else {
                resolvedBtn.className = "font-mono text-sm text-cmd-success uppercase flex items-center gap-2 border-b-2 border-cmd-success pb-1 transition-colors";
                pendingBtn.className = "font-mono text-sm text-gray-500 hover:text-white uppercase flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors";
                resolvedContainer.classList.remove('hidden');
                pendingContainer.classList.add('hidden');
            }
        }

        async function preActionRiskAssessment(btn, title, decisionId, node) {
            const card = btn.closest('.cmd-panel');
            const actionButtons = card.querySelector('.action-buttons');
            const riskGateContainer = card.querySelector('.risk-gate-container');

            // State: PENDING_RISK_CHECK -> RISK_SHOWN
            actionButtons.style.display = 'none';
            riskGateContainer.style.display = 'block';

            // Show loading
            riskGateContainer.innerHTML = `
                <div class="p-3 border border-cmd-warning bg-cmd-warning/10 text-cmd-warning mb-4 font-mono text-sm animate-pulse">
                    <i data-lucide="scan-line" class="inline w-4 h-4 mr-2"></i> INITIATING PRE-ACTION RISK CATEGORIZATION...
                </div>
            `;
            lucide.createIcons();

            try {
                // Determine if this is a "Critical" demo scenario
                const isCriticalScenario = 
                    title?.includes('TRACK ISOLATION') || 
                    title?.includes('EMERGENCY') ||
                    title?.includes('CRITICAL') ||
                    title?.includes('FAULT') ||
                    title?.includes('DETECTED') ||
                    decisionId === 'demo-critical';

                let data = null;

                // Attempt dynamic LLM generation via Groq AI
                if (typeof GROQ_API_KEY !== 'undefined' && GROQ_API_KEY && GROQ_API_KEY !== 'YOUR_GROQ_API_KEY_HERE') {
                    try {
                        const prompt = `# AI STATION MASTER — RAILWAY INCIDENT DECISION ENGINE

You are **RailAI Station Master**, an advanced AI decision-support assistant for railway station operations.
Your role is to assist an authorized **Station Master, Control Room Officer, and Railway Operations Team** in detecting faults, analyzing operational risks, predicting cascading effects, and recommending the safest operational decision.
You are NOT a generic chatbot. You must think like an experienced railway Station Master who must make fast, evidence-based decisions during operational disruptions.

---

## 1. PRIMARY OBJECTIVE
For every incoming railway problem, fault, alert, or abnormal situation:
1. Identify the fault.
2. Determine its severity.
3. Analyze immediate safety risks.
4. Analyze operational consequences.
5. Predict possible cascade delays.
6. Identify resource conflicts.
7. Identify relevant SOP/compliance concerns.
8. Check whether historical incidents are relevant.
9. Generate possible response options.
10. Select the safest recommended decision.
11. Generate immediate action steps.
12. Define recovery conditions.
13. Explain why the decision was selected.
Human safety ALWAYS has higher priority than minimizing delays.

---

# 2. DECISION PRIORITY
Always follow this priority hierarchy:
1. HUMAN SAFETY
2. TRAIN MOVEMENT SAFETY
3. COLLISION / ROUTE PROTECTION
4. CROWD SAFETY
5. EMERGENCY RESPONSE
6. NETWORK STABILITY
7. RESOURCE OPTIMIZATION
8. DELAY MINIMIZATION
9. PASSENGER CONVENIENCE
Never recommend an operational shortcut that compromises safety merely to reduce delay.

---

# 3. FAULT CLASSIFICATION
Classify every problem into one or more categories:
* Signal Failure
* Track Obstruction
* Track Failure
* Point/Switch Failure
* Platform Overcrowding
* Train Delay
* Train Cancellation
* Platform Occupancy Conflict
* Route Conflict
* Power/Electrical Failure
* Communication Failure
* Passenger Emergency
* Medical Emergency
* Fire/Evacuation
* Security Threat
* Weather Disruption
* Flooding/Waterlogging
* Equipment Failure
* Staff Shortage
* Crowd Surge
* Infrastructure Failure
* Multiple Simultaneous Faults
* Unknown/Unclassified
If the fault does not fit a category, classify it as: \`UNKNOWN_FAULT\` and request additional information if required.

---

# 4. SEVERITY CLASSIFICATION
Assign exactly one severity level:
### CRITICAL (Immediate or potentially catastrophic safety risk. e.g., Collision risk, Unsafe route, Extreme crowd density, Fire)
### HIGH (Major operational or safety risk requiring immediate intervention. e.g., Severe platform congestion, Major signal degradation)
### MEDIUM (Significant operational disruption but currently controllable. e.g., Moderate train delay, Platform conflict)
### LOW (Minor disruption with limited operational impact. e.g., Small delay, Non-critical equipment issue)

---

# 5. DYNAMIC RISK ANALYSIS
Do NOT use fixed risk messages. Calculate the risk according to the actual input data.
For every incident analyze:

## A. Operational Risk
Determine whether the fault can interfere with: Train movement, Platform availability, Route availability, Signaling, Station capacity, Passenger movement. Return: LOW / MEDIUM / HIGH / CRITICAL and explain why.

## B. Cascade Delay Risk
Determine how the current fault can propagate through the railway network. Estimate Number of directly affected trains, downstream trains, and Approximate delay propagation. Do NOT invent exact numbers. If data is unavailable, explicitly state: \`DATA REQUIRED\`

## C. Resource Conflict Risk
Determine whether the incident will consume: Station staff, RPF/GRP/security personnel, Medical teams, Fire response, Engineering teams, Signal maintenance teams, Control room resources, Emergency vehicles. Identify neighboring stations/divisions that may be affected if resource data is available. Return: LOW / MEDIUM / HIGH / CRITICAL

## D. Safety / Compliance Risk
Identify whether the proposed operational response could conflict with: Railway operating procedures, Signaling rules, Track protection procedures, Platform safety procedures, Emergency protocols. Never invent a specific railway rule or SOP number. If an exact rule is not provided in the input knowledge base, say: \`VERIFY AGAINST APPLICABLE RAILWAY SOP\`

---

# 6. HISTORICAL PRECEDENT ENGINE
Use historical incidents ONLY when they are relevant to the current fault. Do NOT automatically mention the Allahabad/Prayagraj 2013 incident for unrelated faults.
If: \`Platform occupancy = 185%\` then relevant historical crowd incidents may be used as precedent.
If: \`Signal failure\` then use relevant signaling/safety incidents if available.
Historical precedent must be presented as: Incident, Relevance, Lesson, Preventive implication.
Never claim that the current incident is identical to a historical incident.
If no verified historical precedent exists in the knowledge base: \`No verified historical precedent available.\`

---

# 7. DECISION ENGINE
Generate at least 2 possible operational responses when practical.
Example:
OPTION A: Hold incoming train.
OPTION B: Route incoming train to alternate platform.
Then select: \`RECOMMENDED DECISION\`. The safest feasible option should normally be selected.

---

# 8. SAFETY-FIRST DECISION RULE
If there is a conflict between SAFETY vs DELAY choose SAFETY. If there is a conflict between SAFETY vs RESOURCE COST choose SAFETY.
If there is uncertainty about whether a movement is safe: DO NOT ASSUME IT IS SAFE. Recommend: \`HOLD / PROTECT / VERIFY\` until authorized personnel confirm the required condition.

---

# 9. STATION MASTER ACTION PLAN
After selecting a decision, provide an ordered action sequence.
Example:
1. Protect affected railway movement.
2. Hold or regulate affected trains if necessary.
3. Notify the appropriate control authority.
4. Deploy required response personnel.
5. Verify the affected infrastructure/condition.
Do not claim that an action has already happened. Use: \`RECOMMENDED ACTION\` rather than \`ACTION COMPLETED\`.

---

# 10. RECOVERY ENGINE
Every incident must have a recovery condition.
Examples:
Signal failure: \`Resume normal routing after signal integrity and route safety are verified by authorized personnel.\`
Track obstruction: \`Resume movement only after the affected track is inspected and declared safe.\`

---

# 11. UNKNOWN OR MISSING DATA
Never fabricate railway data. If required information is missing, clearly identify it.
Example: \`Missing data: platform capacity, current occupancy, incoming train ETA.\`
Use: \`UNKNOWN\` or \`DATA REQUIRED\` instead of inventing values.

---

# 12. IMPORTANT RESTRICTIONS
Never:
* Invent railway statistics.
* Invent train numbers.
* Invent platform capacity.
* Invent historical incidents.
* Invent SOP numbers.
* Claim an action was executed when it was only recommended.
* Automatically recommend overriding safety systems.
* Prioritize punctuality over human safety.
* Treat historical incidents as proof that the same event is occurring.
* Make an irreversible operational decision without identifying the need for authorized human confirmation.

Your goal is: **DETECT -> ANALYZE -> PREDICT -> DECIDE -> ACTIVATE RESPONSE -> MONITOR -> RECOVER**

---

# 13. OUTPUT FORMAT
Analyze this incident: "${title}".

Based on all the above rules and guidelines, you MUST respond strictly with valid JSON representing the 4 risk categories our UI expects. Do not output markdown.
Focus heavily on RESOLVING the data and providing immediate STATION MASTER ACTIONS for each category.
Follow this exact structure:
{
  "overallRisk": "CRITICAL",
  "categories": [
    { 
      "name": "Safety Risk", 
      "severity": "CRITICAL",
      "description": "State the immediate safety risk and your strict resolving action to mitigate it." 
    },
    { 
      "name": "Operational Risk", 
      "severity": "HIGH",
      "description": "State the predicted cascading delays and your operational decision to resolve it." 
    },
    { 
      "name": "Resource Conflict Risk", 
      "severity": "HIGH",
      "description": "State the resource needs and your command for deploying resolving teams." 
    },
    { 
      "name": "Compliance/SLA Risk", 
      "severity": "HIGH",
      "description": "State the relevant SOP and the exact recovery conditions required to resume operations." 
    }
  ],
  "alternateAction": "Provide your final decisive STATION MASTER ACTION PLAN to completely resolve this incident."
}`;
                        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${GROQ_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: "llama3-8b-8192",
                                messages: [{ role: "user", content: prompt }],
                                response_format: { type: "json_object" },
                                temperature: 0.2
                            })
                        });
                        
                        if (res.ok) {
                            const json = await res.json();
                            data = JSON.parse(json.choices[0].message.content);
                            data.decisionId = decisionId;
                            data.status = 'completed';
                            data.nextSteps = 'Processing...';
                        } else {
                            console.error("Groq API error:", await res.text());
                        }
                    } catch (e) {
                        console.error("Groq API failed:", e);
                    }
                }

                // Smart Fallback if API key is missing or request fails
                if (!data) {
                    const safetyFaults = isCriticalScenario ? [
                        { severity: 'CRITICAL', desc: 'CRITICAL SAFETY RISK: Unverified interlocking systems pose severe threat to passenger safety. ACTION: Immediate track isolation required.' },
                        { severity: 'CRITICAL', desc: 'CRITICAL SAFETY RISK: Platform capacity exceeded by 200%. High risk of crowd crush. ACTION: Halt incoming trains and deploy RPF.' },
                        { severity: 'CRITICAL', desc: 'CRITICAL SAFETY RISK: Unnotified track maintenance detected in sector. High derailment probability. ACTION: Stop all movement in sector.' }
                    ] : [
                        { severity: 'LOW', desc: 'Routine operation. No direct threat to passenger or staff safety detected.' },
                        { severity: 'MEDIUM', desc: 'Minor platform congestion forming. RPF presence recommended to prevent escalation.' },
                        { severity: 'MEDIUM', desc: 'Approaching monsoon limits. Track integrity is nominal but requires monitoring.' }
                    ];

                    const operationalFaults = isCriticalScenario ? [
                        { severity: 'HIGH', desc: 'Cascade Delay Alert: 14 downstream trains on the trunk route will be halted. Sector gridlock imminent. ACTION: Reroute via bypass.' },
                        { severity: 'HIGH', desc: 'Speed restrictions will cause a 6-hour backlog at major junctions. ACTION: Regulate freight traffic to clear passenger lines.' }
                    ] : [
                        { severity: 'MEDIUM', desc: 'Minor cascading delays (5-10 mins) possible for secondary express trains sharing the corridor.' },
                        { severity: 'LOW', desc: 'Isolated disruption. Buffer times are sufficient to absorb the operational impact.' }
                    ];

                    const resourceFaults = isCriticalScenario ? [
                        { severity: 'MEDIUM', desc: 'Emergency response teams will drain resources from neighboring divisions (NR/NCR). ACTION: Request NDRF standby.' },
                        { severity: 'HIGH', desc: 'Locomotive shortage imminent. Stranded rakes will block essential freight corridors. ACTION: Dispatch relief locos.' }
                    ] : [
                        { severity: 'HIGH', desc: 'Platform 4 double-booking risk at Prayagraj within the next 45 minutes.' },
                        { severity: 'LOW', desc: 'Crew rostering within legal limits. No immediate staff shortage.' }
                    ];
                    
                    const complianceFaults = isCriticalScenario ? [
                        { severity: 'HIGH', desc: 'Guaranteed SLA breach for 3 Rajdhani priority trains. ACTION: Ministry reporting required per SOP 44.' },
                        { severity: 'HIGH', desc: 'Violation of standard operating procedure for signaling overrides. ACTION: Mandate manual pilot verification.' }
                    ] : [
                        { severity: 'LOW', desc: 'Within acceptable punctuality variance margins.' },
                        { severity: 'LOW', desc: 'Standard protocols observed. No SLA breaches projected.' }
                    ];

                    // Randomly select one from each pool
                    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

                    data = {
                        decisionId,
                        status: 'completed',
                        overallRisk: isCriticalScenario ? 'CRITICAL' : 'MEDIUM',
                        categories: [
                            { name: 'Safety Risk', severity: pick(safetyFaults).severity, description: pick(safetyFaults).desc },
                            { name: 'Operational Risk', severity: pick(operationalFaults).severity, description: pick(operationalFaults).desc },
                            { name: 'Resource Conflict Risk', severity: pick(resourceFaults).severity, description: pick(resourceFaults).desc },
                            { name: 'Compliance/SLA Risk', severity: pick(complianceFaults).severity, description: pick(complianceFaults).desc }
                        ],
                        nextSteps: 'Processing...',
                        alternateAction: isCriticalScenario ? 'Deploy RPF & Halt all incoming traffic.' : null
                    };
                }

                // Simulate network latency for dramatic effect if it was instantly generated
                await new Promise(r => setTimeout(r, 1000));

                // Render risk categories
                let categoriesHtml = data.categories.map(cat => {
                    let colorClass = 'text-cmd-success border-cmd-success bg-cmd-success/10';
                    let icon = 'check-circle-2';
                    if (cat.severity === 'MEDIUM') {
                        colorClass = 'text-cmd-warning border-cmd-warning bg-cmd-warning/10';
                        icon = 'alert-triangle';
                    } else if (cat.severity === 'HIGH' || cat.severity === 'CRITICAL') {
                        colorClass = 'text-cmd-danger border-cmd-danger bg-cmd-danger/10';
                        icon = 'alert-octagon';
                    }

                    return `
                        <div class="flex flex-col p-2 border-l-2 ${colorClass} mb-2 bg-[#040D18]">
                            <div class="flex justify-between font-bold mb-1">
                                <span>${cat.name}</span>
                                <span>[${cat.severity}]</span>
                            </div>
                            <div class="text-xs text-gray-400">${cat.description}</div>
                        </div>
                    `;
                }).join('');

                const overallColor = data.overallRisk === 'CRITICAL' || data.overallRisk === 'HIGH' ? 'text-cmd-danger' : 'text-cmd-warning';

                riskGateContainer.innerHTML = `
                    <div class="border border-gray-700 bg-[#000] p-3 mb-4 transition-all duration-500 rv-fade-in">
                        <div class="text-sm font-bold ${overallColor} mb-3 border-b border-gray-800 pb-2 flex justify-between">
                            <span>RISK ASSESSMENT COMPLETE</span>
                            <span>OVERALL: ${data.overallRisk}</span>
                        </div>
                        
                        <div class="mb-4">
                            ${categoriesHtml}
                        </div>
                        
                        <div class="text-xs text-cmd-accent mb-4 p-2 bg-cmd-accent/10 border border-cmd-accent/30">
                            <strong>NEXT STEPS:</strong> ${card.querySelector('.text-gray-400.mb-4')?.innerText.replace(/>\s*/g, '• ').trim() || data.nextSteps}
                        </div>
                        
                        <div class="flex gap-2">
                            <button onclick="executeActionWithState(this, 'confirm', ${data.overallRisk === 'CRITICAL'})" class="flex-1 py-2 bg-[#000] border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black transition-colors font-bold tracking-widest">
                                CONFIRM & EXECUTE
                            </button>
                            <button onclick="executeActionWithState(this, 'cancel', ${data.overallRisk === 'CRITICAL'})" class="flex-1 py-2 bg-[#000] border border-cmd-danger text-cmd-danger hover:bg-cmd-danger hover:text-black transition-colors font-bold tracking-widest">
                                ABORT ACTION
                            </button>
                        </div>
                    </div>
                `;
            } catch (err) {
                riskGateContainer.innerHTML = `
                    <div class="p-3 border border-cmd-danger bg-cmd-danger/10 text-cmd-danger mb-4 font-mono text-sm">
                        [ERROR] RISK ASSESSMENT FAILED. UNABLE TO PROCEED.
                        <div class="mt-2 text-right">
                            <button onclick="resetRiskGate(this)" class="text-xs underline hover:text-white">RETRY / CANCEL</button>
                        </div>
                    </div>
                `;
            }
        }

        // Reset the UI if risk assessment fails
        function resetRiskGate(btn) {
            const card = btn.closest('.cmd-panel');
            card.querySelector('.risk-gate-container').style.display = 'none';
            card.querySelector('.action-buttons').style.display = 'flex';
        }

        // State Machine execution: CONFIRMED/CANCELLED -> EXECUTING -> SUCCESS/FAILURE
        function executeActionWithState(btn, outcome, isCritical) {
            const riskGateContainer = btn.closest('.risk-gate-container');
            const card = riskGateContainer.closest('.cmd-panel');
            
            if (outcome === 'cancel') {
                if (isCritical) {
                    riskGateContainer.innerHTML = `
                        <div class="p-3 border border-cmd-danger bg-cmd-danger/10 text-cmd-danger mb-4 font-mono text-sm animate-pulse">
                            [ABORTED] ACTION CANCELLED DUE TO CRITICAL RISK.
                        </div>
                        <div class="text-xs text-gray-400 mt-2 p-2 bg-gray-900 border border-gray-700">
                            <strong>ALTERNATE PROTOCOL:</strong> Deploy RPF & Halt all incoming traffic.
                            <br/><button onclick="resolveDecision(this, 'reject')" class="mt-2 px-3 py-1 bg-gray-800 text-white border border-gray-600 hover:bg-gray-700">DISMISS</button>
                        </div>
                    `;
                } else {
                    resetRiskGate(btn);
                }
                return;
            }
            
            // State: EXECUTING
            riskGateContainer.innerHTML = `
                <div class="p-3 border border-cyan-500 bg-cyan-500/10 text-cyan-500 mb-4 font-mono text-sm flex items-center justify-center gap-3">
                    <div class="rv-spin"><i data-lucide="loader" class="w-5 h-5"></i></div> EXECUTING AUTHORIZED PROTOCOLS...
                </div>
            `;
            lucide.createIcons();
            
            setTimeout(() => {
                if (isCritical) {
                    // Simulate Failure for CRITICAL risks
                    riskGateContainer.innerHTML = `
                        <div class="p-3 border border-cmd-danger bg-cmd-danger/10 text-cmd-danger mb-4 font-mono text-sm">
                            [AUTHORIZED] STATION MASTER OVERRIDE ACCEPTED.
                            <div class="mt-2 text-xs text-gray-300">
                                - Status: Action deployed to frontline response teams.<br/>
                                - Network Routing: Re-calculating safe corridor bypasses.<br/>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button onclick="resolveDecision(this, 'reject')" class="w-full py-2 bg-[#000] border border-cmd-danger text-cmd-danger hover:bg-cmd-danger hover:text-black transition-colors tracking-widest text-xs font-bold">CLOSE CRITICAL INCIDENT REPORT</button>
                        </div>
                    `;
                } else {
                    // State: SUCCESS for non-critical
                    riskGateContainer.innerHTML = `
                        <div class="p-3 border border-cmd-success bg-cmd-success/10 text-cmd-success mb-4 font-mono text-sm">
                            [SUCCESS] ACTION EXECUTED SAFELY.
                            <div class="mt-2 text-xs text-gray-300">
                                + Delays prevented: 42 mins<br/>
                                + Resource utilization optimized<br/>
                                + Platform conflicts resolved
                            </div>
                        </div>
                        <div class="mt-3">
                            <button onclick="resolveDecision(this, 'accept')" class="w-full py-2 bg-[#000] border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black transition-colors tracking-widest text-xs font-bold">DISMISS TO RESOLVED</button>
                        </div>
                    `;
                }
            }, 1500);
        }

        function resolveDecision(btn, action) {
            const card = btn.closest('.cmd-panel');
            const parentGroup = card.parentElement;

            // Mark as resolved visually
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
            btn.parentElement.innerHTML = `<div class="w-full py-2 text-center border bg-[#000] ${action === 'accept' ? 'text-cmd-success border-cmd-success' : 'text-cmd-danger border-cmd-danger'}">${action === 'accept' ? 'AUTHORIZED' : 'DECLINED'}</div>`;

            // Move card to Resolved Container
            const resolvedContainer = document.getElementById('resolved-container');

            // Clear the "NO RESOLVED ACTIONS YET" text if present
            const emptyText = resolvedContainer.querySelector('.text-center');
            if (emptyText && emptyText.innerText.includes('NO RESOLVED ACTIONS')) {
                emptyText.remove();
            }

            resolvedContainer.append(card);

            // If the pending zone group is now empty (only contains the header), remove it
            if (parentGroup && parentGroup.id.startsWith('zone-group-') && parentGroup.children.length === 1) {
                parentGroup.remove();
            }

            // Update pending text if needed
            const pendingContainer = document.getElementById('decisions-container');
            if (pendingContainer.children.length === 0) {
                pendingContainer.innerHTML = `<div class="text-center font-mono text-sm text-gray-600 mt-10 uppercase tracking-widest">NO PENDING OVERRIDES. STANDING BY.</div>`;
            }

            pendingCount--; document.getElementById('pending-count').innerText = `${pendingCount} REQ`;

            // Increment metrics
            if (action === 'accept') {
                const metricInt = document.getElementById('metric-interventions');
                metricInt.innerText = parseInt(metricInt.innerText) + 1;
                const metricPax = document.getElementById('metric-pax');
                metricPax.innerText = (parseFloat(metricPax.innerText) + 0.1).toFixed(1);
                logAgent(`[SYS] PROTOCOL AUTHORIZED. EXECUTING...`, 'text-cmd-success');
            } else {
                logAgent(`[SYS] PROTOCOL DECLINED BY OPERATOR.`, 'text-cmd-danger');
            }
        }

        function filterDecisionsByZone() {
            const filterValue = document.getElementById('zone-filter').value;
            const container = document.getElementById('decisions-container');
            const zoneGroups = container.querySelectorAll('[id^="zone-group-"]');

            zoneGroups.forEach(group => {
                const zoneId = group.id.replace('zone-group-', '');
                if (filterValue === 'ALL' || zoneId === filterValue) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });
        }

        // ----------------------------------------------------
        // RAILVERSE AI MODULES LOGIC
        // ----------------------------------------------------
        const STATIONS = [
            { id: 'NDLS', name: 'New Delhi', x: 175, y: 88, platforms: 16, crowd: 78, incoming: 12, status: 'busy' },
            { id: 'JP', name: 'Jaipur', x: 128, y: 148, platforms: 6, crowd: 42, incoming: 4, status: 'normal' },
            { id: 'AGC', name: 'Agra Cantt', x: 208, y: 160, platforms: 8, crowd: 55, incoming: 5, status: 'normal' },
            { id: 'CNB', name: 'Kanpur', x: 255, y: 174, platforms: 10, crowd: 67, incoming: 7, status: 'busy' },
            { id: 'LKO', name: 'Lucknow', x: 278, y: 161, platforms: 9, crowd: 60, incoming: 6, status: 'normal' },
            { id: 'PRYJ', name: 'Prayagraj', x: 310, y: 180, platforms: 10, crowd: 91, incoming: 9, status: 'critical' },
            { id: 'BSB', name: 'Varanasi', x: 346, y: 186, platforms: 9, crowd: 84, incoming: 8, status: 'busy' },
            { id: 'PNBE', name: 'Patna', x: 392, y: 174, platforms: 10, crowd: 73, incoming: 7, status: 'busy' },
            { id: 'HWH', name: 'Kolkata (Howrah)', x: 484, y: 244, platforms: 23, crowd: 87, incoming: 15, status: 'busy' },
            { id: 'BPL', name: 'Bhopal', x: 196, y: 246, platforms: 6, crowd: 49, incoming: 5, status: 'normal' },
            { id: 'NGP', name: 'Nagpur', x: 246, y: 306, platforms: 8, crowd: 56, incoming: 5, status: 'normal' },
            { id: 'CSTM', name: 'Mumbai CST', x: 104, y: 346, platforms: 18, crowd: 94, incoming: 18, status: 'critical' },
            { id: 'SC', name: 'Hyderabad', x: 256, y: 380, platforms: 10, crowd: 70, incoming: 8, status: 'busy' },
            { id: 'MAS', name: 'Chennai Central', x: 333, y: 454, platforms: 17, crowd: 76, incoming: 10, status: 'busy' },
            { id: 'SBC', name: 'Bengaluru', x: 258, y: 438, platforms: 10, crowd: 65, incoming: 7, status: 'normal' },
        ];

        const ROUTES = [
            { id: 'R1', name: 'Grand Trunk Route', path: ['NDLS', 'AGC', 'CNB', 'PRYJ', 'BSB', 'PNBE', 'HWH'], color: '#00E5FF' },
            { id: 'R2', name: 'Western Express', path: ['NDLS', 'JP', 'BPL', 'NGP', 'CSTM'], color: '#FF9500' },
            { id: 'R3', name: 'South Central Express', path: ['CSTM', 'NGP', 'SC', 'MAS'], color: '#00FF94' },
            { id: 'R4', name: 'Konkan South', path: ['MAS', 'SBC', 'SC'], color: '#A855F7' },
            { id: 'R5', name: 'Avadh Corridor', path: ['CNB', 'LKO', 'PRYJ'], color: '#FFD700' },
            { id: 'R6', name: 'Central Indian Route', path: ['BPL', 'NGP', 'SC'], color: '#FF3B60' },
        ];

        const TRAINS_DATA = [
            { id: '12301', name: 'Howrah Rajdhani', route: 'R1', progress: 0.35, delay: 0, speed: 130, cat: 'Rajdhani' },
            { id: '22416', name: 'Mumbai Rajdhani', route: 'R2', progress: 0.62, delay: 15, speed: 120, cat: 'Rajdhani' },
            { id: '12239', name: 'Chennai Duronto', route: 'R3', progress: 0.22, delay: 0, speed: 110, cat: 'Duronto' },
            { id: '12628', name: 'Karnataka Express', route: 'R4', progress: 0.55, delay: 8, speed: 95, cat: 'Express' },
            { id: '14205', name: 'Lucknow Mail', route: 'R5', progress: 0.78, delay: 22, speed: 80, cat: 'Mail' },
            { id: '11062', name: 'Pawan Express', route: 'R6', progress: 0.42, delay: 5, speed: 85, cat: 'Express' },
            { id: '12721', name: 'Dakshin Express', route: 'R1', progress: 0.72, delay: 0, speed: 100, cat: 'Superfast' },
            { id: '15003', name: 'Chauri Chaura Exp', route: 'R2', progress: 0.28, delay: 35, speed: 75, cat: 'Express' },
        ];

        const AGENT_LIST = [
            { id: 'ops', icon: '<i data-lucide="radar" class="w-6 h-6"></i>', name: 'Operations Agent', role: 'Network Monitor', color: '#00E5FF' },
            { id: 'sched', icon: '<i data-lucide="calendar-clock" class="w-6 h-6"></i>', name: 'Scheduling Agent', role: 'Route Optimizer', color: '#FF9500' },
            { id: 'plat', icon: '<i data-lucide="layout-dashboard" class="w-6 h-6"></i>', name: 'Platform Agent', role: 'Platform Manager', color: '#A855F7' },
            { id: 'crowd', icon: '<i data-lucide="users-round" class="w-6 h-6"></i>', name: 'Crowd Agent', role: 'Flow Manager', color: '#00FF94' },
            { id: 'emrg', icon: '<i data-lucide="siren" class="w-6 h-6"></i>', name: 'Emergency Agent', role: 'Risk Response', color: '#FF3B60' },
        ];

        const AGENT_FALLBACK = {
            ops: { status: 'ALERT', critical_issues: ['Platform conflict at Prayagraj Jn — Trains 12301 & 15003', 'Mumbai CST crowd threshold breached at 94%'], alerts: ['Train 22416: +15min on Western Line', 'Train 15003: +35min approaching Kanpur'], insight: 'Western Line congestion propagating secondary delays into Grand Trunk corridor.', action_required: 'Immediate rescheduling of Prayagraj platform assignments required.' },
            sched: { rerouting: ['Divert Train 22416 via Bhopal alternate track from Nagpur', 'Priority slot reserved for 12301 at Prayagraj'], speed_adjustments: ['Increase 12239 to 115km/h on clear South Central sector'], priority_changes: ['Rajdhani class: Priority 1 on all main corridors'], estimated_time_saved: '18-22 minutes across affected trains', insight: 'Rerouting 22416 avoids Nagpur bottleneck entirely, recovery by Vadodara.' },
            plat: { platform_changes: ['Move Train 15003 to Platform 4 at Prayagraj Jn', 'Reassign Platform 7 at Varanasi for Rajdhani overflow'], conflict_resolutions: ['12301 → Platform 1, 15003 → Platform 4 — conflict cleared at 15:05'], crowd_redistribution: ['Open exit gates A, B, C at Mumbai CST simultaneously'], insight: 'Platform 4 allocation reduces conflict and improves concourse flow by 35%.' },
            crowd: { gate_changes: ['Open all 8 entry gates at Mumbai CST main entrance', 'Activate secondary exit at Prayagraj North Gate'], staff_deployment: ['Deploy 14 staff at Mumbai CST Gates 1-3', 'Deploy 9 staff at Prayagraj Platform'], passenger_routing: ['Redirect to Platform 6-7 via Concourse B at Mumbai'], risk_areas: ['Mumbai CST Gate 1-2 — CRITICAL bottleneck', 'Prayagraj platform crossing — HIGH'], insight: 'Coordinated deployment at 3 stations reduces crowd risk by estimated 42%.' },
            emrg: { risk_level: 'HIGH', incidents: [{ location: 'Mumbai CST', type: 'Crowd Surge', severity: 'CRITICAL' }, { location: 'Prayagraj Jn', type: 'Platform Conflict', severity: 'HIGH' }], action_plan: ['Activate crowd protocol at Mumbai CST immediately', 'Deploy RPF at Prayagraj platform', 'Issue advisory on all 420+ networkwide digital boards'], passenger_impact: '~29,000 passengers across 3 critical stations affected' },
        };

        const SIM_TYPES = [
            { id: 'delay', icon: '<i data-lucide="clock-alert" class="w-6 h-6"></i>', name: 'Train Delay Cascade', color: '#FF9500', desc: 'How one delay propagates across the entire network' },
            { id: 'festival', icon: '<i data-lucide="party-popper" class="w-6 h-6"></i>', name: 'Festival Crowd Surge', color: '#A855F7', desc: 'Model crowd dynamics during major Indian festivals' },
            { id: 'blockage', icon: '<i data-lucide="barrier-block" class="w-6 h-6"></i>', name: 'Track Blockage', color: '#FF3B60', desc: 'Analyze rerouting when a major route is blocked' },
        ];

        const SIM_RESULTS = {
            delay: { affected_trains: 12, platform_conflicts: 5, passenger_impact: 4300, risk: 'HIGH', cascade: [{ train: '12301', delay: 18, reason: 'Platform held for 22416' }, { train: '15003', delay: 12, reason: 'Track slot occupied at Kanpur' }, { train: '14205', delay: 8, reason: 'Ripple effect at Lucknow Jn' }], recs: ['Reroute 22416 via alternate Bhopal track', 'Pre-notify 12 downstream trains', 'Open emergency platform at Kanpur Junction'] },
            festival: { crowd_increase: '230%', risk: 'CRITICAL', staff: 65, extra_trains: 18, flow: { expected: 145000, capacity: 45000 }, advisories: ['Deploy 65 RPF + civilian staff immediately', 'Run 18 special festival trains from Varanasi', 'Crowd segregation protocol on Platform 1-4', 'Medical posts at 3 strategic concourse points'] },
            blockage: { reroutes: 3, affected_trains: 22, delay_range: '45-90 min', passenger_impact: 18500, resolution: '4-6 hours', options: [{ via: 'Lucknow – Sultanpur alternate', trains: 8, time: '55 min extra' }, { via: 'Agra – Etawah diversion', trains: 7, time: '40 min extra' }, { via: 'Bhopal – Jhansi bypass', trains: 7, time: '90 min extra' }] },
        };

        const svCo = s => ({ LOW: '#00FF94', MEDIUM: '#FFD700', HIGH: '#FF9500', CRITICAL: '#FF3B60' })[s] || '#00E5FF';

        let googleSearchTimeout = null;
        function searchGoogleTrains(query) {
            if (!query || query.length < 2) return;

            // Clean up old scripts
            const oldScript = document.getElementById('google-search-script');
            if (oldScript) oldScript.remove();

            // Debounce to prevent API spam
            clearTimeout(googleSearchTimeout);
            googleSearchTimeout = setTimeout(() => {
                // JSONP Callback
                window.googleSuggestCb = function (data) {
                    const list = document.getElementById('delay-train-list');
                    if (data && data[1]) {
                        list.innerHTML = data[1].map(t => `<option value="${t.toUpperCase()}"></option>`).join('');
                    }
                };

                // Inject script to bypass CORS
                const script = document.createElement('script');
                script.id = 'google-search-script';
                // Add "indian railways train" prefix to force google to return train details
                const fullQuery = 'indian railways train ' + encodeURIComponent(query);
                script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${fullQuery}&jsonp=googleSuggestCb`;
                document.body.appendChild(script);
            }, 300);
        }

        // Initialize Dropdowns
        function initDropdowns() {
            const delayTrainList = document.getElementById('delay-train-list');
            if (delayTrainList) {
                delayTrainList.innerHTML = TRAINS_DATA.map(t => `<option value="${t.id}"> ${t.name} </option>`).join('');
            }
            const crowdStation = document.getElementById('crowd-station');
            if (crowdStation) {
                crowdStation.innerHTML = STATIONS.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
                crowdStation.addEventListener('change', renderCrowdStationCard);
            }

            // Populate Geo-Fence Dropdowns
            let allStations = [];
            for (let z in railwayZones) {
                allStations = allStations.concat(railwayZones[z].stations);
            }
            allStations.sort((a, b) => a.name.localeCompare(b.name));

            const stationNames = {
                'NDLS': 'New Delhi', 'LKO': 'Lucknow', 'ASR': 'Amritsar', 'CNB': 'Kanpur', 'PRYJ': 'Prayagraj', 'BSB': 'Varanasi',
                'AGC': 'Agra Cantt', 'GKP': 'Gorakhpur', 'VGLJ': 'Jhansi', 'MTJ': 'Mathura', 'AY': 'Ayodhya', 'UMB': 'Ambala',
                'LDH': 'Ludhiana', 'JAT': 'Jammu Tawi', 'DDN': 'Dehradun', 'CDG': 'Chandigarh',
                'MMCT': 'Mumbai Central', 'ADI': 'Ahmedabad', 'ST': 'Surat', 'JP': 'Jaipur', 'JU': 'Jodhpur', 'UDZ': 'Udaipur',
                'BRC': 'Vadodara', 'RJT': 'Rajkot', 'INDB': 'Indore', 'UJN': 'Ujjain', 'RTM': 'Ratlam',
                'CSMT': 'Mumbai CST', 'PUNE': 'Pune', 'NGP': 'Nagpur', 'NK': 'Nashik', 'BSL': 'Bhusaval', 'AK': 'Akola',
                'SUR': 'Solapur', 'BPL': 'Bhopal', 'ET': 'Itarsi', 'JBP': 'Jabalpur', 'R': 'Raipur', 'BSP': 'Bilaspur',
                'MAS': 'Chennai Central', 'CBE': 'Coimbatore', 'MDU': 'Madurai', 'TVC': 'Thiruvananthapuram', 'ERS': 'Ernakulam',
                'CLT': 'Kozhikode', 'SBC': 'Bengaluru', 'MYS': 'Mysuru', 'UBL': 'Hubballi', 'SC': 'Secunderabad', 'BZA': 'Vijayawada',
                'VSKP': 'Visakhapatnam', 'TPTY': 'Tirupati',
                'HWH': 'Howrah', 'ASN': 'Asansol', 'MLDT': 'Malda Town', 'PNBE': 'Patna', 'GAYA': 'Gaya', 'DHN': 'Dhanbad'
            };

            const gfStart = document.getElementById('gf-start');
            const gfEnd = document.getElementById('gf-end');
            if (gfStart && gfEnd) {
                const optionsHTML = allStations.map(s => {
                    const fullName = stationNames[s.name] || s.name;
                    return `<option value="${s.name}">${fullName} (${s.name})</option>`;
                }).join('');
                gfStart.innerHTML = optionsHTML;
                gfEnd.innerHTML = optionsHTML;
                // Default to different stations
                if (allStations.length > 1) {
                    gfEnd.selectedIndex = 1;
                }
            }

            // Populate What-If Suggestions
            const whatIfContainer = document.getElementById('whatif-suggestions');
            if (whatIfContainer) {
                const queries = [
                    'What if Train 22416 is delayed 90 minutes during Kumbh Mela at Prayagraj?',
                    'What happens if the Delhi-Kanpur track is blocked for 4 hours at peak time?',
                    'Simulate a major flood affecting the Patna-Kolkata corridor tonight.',
                    'What if Mumbai CST capacity exceeds 100% during Diwali weekend rush?',
                ];
                whatIfContainer.innerHTML = queries.map(q => `<button onclick="document.getElementById('whatif-input').value='${q}'; runWhatIf()" style="padding:4px 10px;background:#0F1F3D;border:1px solid #1a365d;border-radius:20px;color:#4A6580;font-size:11px;cursor:pointer;font-family:'Share Tech Mono',monospace;max-width:290px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">✦ ${q.slice(0, 52)}...</button>`).join('');
            }

            renderAgentsGrid();
            selectSimScenario('delay');
            renderCrowdStationCard();
        }

        window.activeGeoFences = [];

        function deployGeoFence() {
            const nameEl = document.getElementById('gf-name');
            const startEl = document.getElementById('gf-start');
            const endEl = document.getElementById('gf-end');

            const name = nameEl.value.trim() || 'UNNAMED DANGER ZONE';
            const startName = startEl.value;
            const endName = endEl.value;

            if (startName === endName) {
                const term = document.getElementById('terminal-output');
                if (term) {
                    term.innerHTML += `<div class="text-cmd-danger"><span class="text-gray-500">[ERR]</span> GEO-FENCE START AND END NODES MUST DIFFER.</div>`;
                    term.scrollTop = term.scrollHeight;
                }
                return;
            }

            // Find coords for map rendering
            let startCoords, endCoords;
            for (let z in railwayZones) {
                for (let s of railwayZones[z].stations) {
                    if (s.name === startName) startCoords = s.coords;
                    if (s.name === endName) endCoords = s.coords;
                }
            }

            if (startCoords && endCoords) {
                try {
                    let polyline = null;
                    if (typeof map !== 'undefined' && typeof window.generateCurvedPath !== 'undefined') {
                        // Draw blinking red line path
                        const path = window.generateCurvedPath(startCoords, endCoords);
                        polyline = L.polyline(path, {
                            color: '#ff2a2a',
                            weight: 4,
                            dashArray: '10, 10',
                            className: 'geo-fence-pulse'
                        }).addTo(map);
                    }

                    const fenceId = 'fence-' + Date.now();

                    window.activeGeoFences.push({
                        id: fenceId,
                        name: name,
                        start: startName,
                        end: endName,
                        startCoords: startCoords,
                        endCoords: endCoords,
                        polyline: polyline,
                        triggeredTrains: new Set()
                    });

                    const term = document.getElementById('terminal-output');
                    if (term) {
                        term.innerHTML += `<div class="text-cmd-success"><span class="text-gray-500">[SYS]</span> GEO-FENCE DEPLOYED: ${name} (${startName} → ${endName})</div>`;
                        setTimeout(() => {
                            term.innerHTML += `<div class="text-cmd-warning mt-1"><span class="text-white">[SYSTEM]</span> Message has been forwarded to Station Master, RPF, and all Zonal Headquarters.</div>`;
                            term.scrollTop = term.scrollHeight;
                        }, 1500);
                        term.scrollTop = term.scrollHeight;
                    }

                    // Update UI list
                    const fencesList = document.getElementById('active-fences-list');
                    const noFencesMsg = document.getElementById('no-fences-msg');
                    if (noFencesMsg) noFencesMsg.style.display = 'none';

                    if (fencesList) {
                        fencesList.innerHTML += `
                            <div id="${fenceId}" class="border border-cmd-danger bg-cmd-danger/10 p-2 text-[10px] relative">
                                <div class="text-cmd-danger font-bold mb-1 w-3/4 truncate">${name}</div>
                                <button onclick="resolveGeoFence('${fenceId}')" class="absolute top-2 right-2 text-[8px] bg-black border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black px-1 py-0.5 transition-colors">RESOLVE</button>
                                <div class="text-gray-400">PATH: ${startName} → ${endName}</div>
                                <div class="text-gray-500 mt-1 flex justify-between">
                                    <span>STATUS: ACTIVE</span>
                                    <span class="text-cmd-warning blink">MONITORING</span>
                                </div>
                            </div>
                        `;
                    }

                    nameEl.value = '';
                } catch (e) {
                    const term = document.getElementById('terminal-output');
                    if (term) {
                        term.innerHTML += `<div class="text-cmd-danger">[ERR] DEPLOY FAILED: ${e.message}</div>`;
                        term.scrollTop = term.scrollHeight;
                    }
                }
            } else {
                const term = document.getElementById('terminal-output');
                if (term) {
                    term.innerHTML += `<div class="text-cmd-danger">[ERR] INIT FAILED: startCoords=${!!startCoords}, endCoords=${!!endCoords}, map=${typeof map}. start:${startName}, end:${endName}</div>`;
                    term.scrollTop = term.scrollHeight;
                }
            }
        }
        window.deployGeoFence = deployGeoFence;

        window.resolveGeoFence = function (fenceId) {
            // Remove from UI
            const el = document.getElementById(fenceId);
            if (el) el.remove();

            // Find fence data
            const fenceIndex = window.activeGeoFences.findIndex(f => f.id === fenceId);
            if (fenceIndex > -1) {
                const fence = window.activeGeoFences[fenceIndex];

                // Remove polyline from map
                if (fence.polyline && map) {
                    map.removeLayer(fence.polyline);
                }

                const term = document.getElementById('terminal-output');
                if (term) {
                    term.innerHTML += `<div class="text-cmd-success"><span class="text-gray-500">[SYS]</span> GEO-FENCE STOOD DOWN: ${fence.name}</div>`;
                    term.scrollTop = term.scrollHeight;
                }

                // Remove from active tracking array
                window.activeGeoFences.splice(fenceIndex, 1);
            }

            // Check if UI is empty
            const fencesList = document.getElementById('active-fences-list');
            if (fencesList && fencesList.children.length === 1 && fencesList.children[0].id === 'no-fences-msg') {
                const noFencesMsg = document.getElementById('no-fences-msg');
                if (noFencesMsg) noFencesMsg.style.display = 'block';
            }
        };

        async function generateGeoFenceDecision(trainNum, fenceName, start, end, zoneId = 'NR') {
            const container = document.getElementById('decisions-container');
            const emptyMsg = container.querySelector('.text-center');
            if (emptyMsg) emptyMsg.style.display = 'none';

            let zoneGroup = document.getElementById('zone-group-' + zoneId);
            if (!zoneGroup) {
                zoneGroup = document.createElement('div');
                zoneGroup.id = 'zone-group-' + zoneId;
                zoneGroup.className = 'mb-6';
                const zoneTitle = railwayZones[zoneId] ? railwayZones[zoneId].name : zoneId;
                zoneGroup.innerHTML = `<div class="text-cmd-accent font-bold mb-3 border-b border-[#1a365d] pb-1 font-mono tracking-widest text-[11px] flex items-center gap-2">
                    <i data-lucide="map" class="w-3 h-3"></i> ZONE: ${zoneTitle} (${zoneId})
                </div><div class="zone-actions space-y-4"></div>`;
                container.append(zoneGroup);
                if (window.lucide) window.lucide.createIcons();
            }
            const actionsContainer = zoneGroup.querySelector('.zone-actions');

            const context = `GEO-FENCE BREACH: Train TRN_${trainNum} has entered the restricted Danger Zone "${fenceName}" between ${start} and ${end}. Provide immediate tactical recommendations.`;

            try {
                const result = await callAI(
                    `GEO-FENCE BREACH: Train ${trainNum} entered Danger Zone ${fenceName}. Recommend actions.`,
                    context
                );

                if (!result.error && result.decisions && result.decisions.length > 0) {
                    result.decisions.forEach(d => {
                        const actionsHtml = d.actions.map(a => `&gt; ${a}`).join('<br>');
                        const html = `
                            <div class="cmd-panel p-4 border-l-4 border-l-[#ff2a2a] relative overflow-hidden text-sm font-mono mb-4" style="animation: dataLoad 0.5s linear forwards">
                                <div class="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                                    <div class="bg-[#ff2a2a] text-black px-1 font-bold animate-pulse">REQ_TYPE: GEO-FENCE BREACH</div>
                                    <div class="text-gray-500">NODE: ${fenceName} <span class="text-cmd-success ml-2">CONF_${d.confidence || 98}%</span></div>
                                </div>
                                <div class="text-white mb-4 text-[#ff2a2a]">TRN_${trainNum} ENTERED DANGER ZONE: ${fenceName}</div>
                                <div class="text-gray-400 mb-4">${actionsHtml}</div>
                                <div class="flex gap-2 mt-2">
                                    <button onclick="resolveDecision(this, 'accept')" class="flex-1 py-2 bg-[#000] border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black transition-colors">AUTHORIZE</button>
                                    <button onclick="resolveDecision(this, 'reject')" class="flex-1 py-2 bg-[#000] border border-cmd-danger text-cmd-danger hover:bg-cmd-danger hover:text-black transition-colors">DECLINE</button>
                                </div>
                            </div>
                        `;
                        actionsContainer.insertAdjacentHTML('beforeend', html);
                        pendingCount++;
                    });
                    document.getElementById('pending-count').innerText = `${pendingCount} REQ`;
                    if (window.lucide) window.lucide.createIcons();
                } else {
                    generateFallbackGeoFenceDecision(trainNum, fenceName, actionsContainer);
                }
            } catch (e) {
                generateFallbackGeoFenceDecision(trainNum, fenceName, actionsContainer);
            }

            const navBtn = document.getElementById('nav-decision');
            if (!navBtn.classList.contains('bg-cmd-accent/10') && !document.getElementById('decision-dot')) {
                navBtn.innerHTML += `<div id="decision-dot" class="absolute top-2 right-2 w-2 h-2 bg-cmd-danger rounded-full animate-pulse shadow-[0_0_8px_#ff2a2a]"></div>`;
            }
        }

        function generateFallbackGeoFenceDecision(trainNum, fenceName, actionsContainer) {
            const html = `
                <div class="cmd-panel p-4 border-l-4 border-l-[#ff2a2a] relative overflow-hidden text-sm font-mono mb-4" style="animation: dataLoad 0.5s linear forwards">
                    <div class="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                        <div class="bg-[#ff2a2a] text-black px-1 font-bold animate-pulse">REQ_TYPE: GEO-FENCE BREACH</div>
                        <div class="text-gray-500">NODE: ${fenceName} <span class="text-cmd-success ml-2">CONF_98%</span></div>
                    </div>
                    <div class="text-white mb-4 text-[#ff2a2a]">TRN_${trainNum} ENTERED DANGER ZONE: ${fenceName}</div>
                    <div class="text-gray-400 mb-4">&gt; ACTION: ENFORCE 30KMPH SPEED RESTRICTION<br>&gt; ACTION: ALERT RPF PATROL UNIT</div>
                    <div class="flex gap-2 mt-2">
                        <button onclick="resolveDecision(this, 'accept')" class="flex-1 py-2 bg-[#000] border border-cmd-success text-cmd-success hover:bg-cmd-success hover:text-black transition-colors">AUTHORIZE</button>
                        <button onclick="resolveDecision(this, 'reject')" class="flex-1 py-2 bg-[#000] border border-cmd-danger text-cmd-danger hover:bg-cmd-danger hover:text-black transition-colors">DECLINE</button>
                    </div>
                </div>
            `;
            actionsContainer.insertAdjacentHTML('beforeend', html);
            pendingCount++;
            document.getElementById('pending-count').innerText = `${pendingCount} REQ`;
            if (window.lucide) window.lucide.createIcons();
        }

        // --- Delay Prediction Engine ---
        function runDelayPrediction() {
            const btn = document.getElementById('delay-run-btn');
            const resContainer = document.getElementById('delay-result');
            const delayVal = parseInt(document.getElementById('delay-val').value);
            const weather = document.getElementById('delay-weather').value;
            const cong = parseInt(document.getElementById('delay-cong').value);

            btn.disabled = true;
            btn.innerHTML = `<span class="rv-spin" style="font-size:16px">⟳</span> Analyzing...`;
            resContainer.innerHTML = `
                <div class="rv-card flex items-center justify-center" style="min-height:400px;padding:32px">
                    <div class="text-center"><div class="rv-spin" style="font-size:30px">⏱</div><div class="text-[13px] text-gray-500 mt-3 animate-pulse">COMPUTING CASCADE PROPAGATION...</div></div>
                </div>
            `;

            setTimeout(() => {
                const pd = delayVal + (weather === 'rain' ? 22 : weather === 'heavy_rain' ? 38 : weather === 'fog' ? 18 : 5) + Math.round(cong / 9);
                const sev = pd > 45 ? 'HIGH' : pd > 25 ? 'MEDIUM' : 'LOW';
                const color = svCo(sev);

                resContainer.innerHTML = `
                <div class="rv-fade-in flex flex-col gap-3">
                    <div class="rv-card" style="border-color:${color}30;padding:18px 20px;text-align:center">
                        <div style="font-size:11px;color:#4A6580;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:7px">Predicted Delay</div>
                        <div style="font-size:54px;font-weight:900;color:${color};font-family:'JetBrains Mono',monospace;line-height:1;margin-bottom:5px">${pd}<span style="font-size:20px;font-weight:400"> min</span></div>
                        <div style="display:inline-block;background:${color}18;color:${color};padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.09em;margin-bottom:10px">${sev} SEVERITY</div>
                        <div style="height:5px;background:#000;border-radius:3px;overflow:hidden"><div style="height:100%;width:85%;background:${color};border-radius:3px"></div></div>
                        <div style="font-size:11px;color:#4A6580;margin-top:4px">Model confidence: 85%</div>
                    </div>
                    <div class="rv-card" style="padding:14px">
                        <div class="rv-section-title">DELAY FACTORS</div>
                        <div class="rv-bullet"><span class="rv-bullet-icon text-cmd-warning">▸</span><span class="rv-bullet-text">Weather conditions reducing safe operating speed on corridor</span></div>
                        <div class="rv-bullet"><span class="rv-bullet-icon text-cmd-warning">▸</span><span class="rv-bullet-text">Station congestion creating platform hold-back at next major junction</span></div>
                        <div class="rv-bullet"><span class="rv-bullet-icon text-cmd-warning">▸</span><span class="rv-bullet-text">Cascading delay from preceding train occupying track slot</span></div>
                    </div>
                    <div class="rv-card" style="padding:14px;border-color:rgba(0,229,255,0.28)">
                        <div class="rv-section-title text-cmd-accent">AI RECOMMENDATION</div>
                        <div style="font-size:14px;color:#E8F4FD;line-height:1.6;margin-bottom:10px">Pre-position at Platform 4, Bhopal Junction and issue advisory to 3 downstream stations.</div>
                        <div class="rv-insight-box" style="border-color:#FF9500">
                            <div style="font-size:10px;color:#FF9500;font-weight:700;margin-bottom:3px;letter-spacing:0.07em">CASCADE RISK</div>
                            <div style="font-size:13px;color:#8BA8C8;line-height:1.45">3 trains behind may face 10-18 min secondary delays without intervention.</div>
                        </div>
                        <div class="rv-insight-box" style="border-color:#A855F7">
                            <div style="font-size:10px;color:#A855F7;font-weight:700;margin-bottom:3px;letter-spacing:0.07em">INTELLIGENCE INSIGHT</div>
                            <div style="font-size:13px;color:#8BA8C8;line-height:1.45">Historical pattern: this corridor recovers ~60% of delays post-Nagpur on clear weather windows.</div>
                        </div>
                    </div>
                </div>`;
                btn.disabled = false;
                btn.innerHTML = `⚡ RUN DELAY PREDICTION`;
            }, 1200);
        }

        // --- Crowd Intelligence Engine ---
        let crowdParams = { festival: false, weekend: false };
        function toggleCrowdParam(type) {
            crowdParams[type] = !crowdParams[type];
            const btn = document.getElementById(`crowd-${type}-btn`);
            if (crowdParams[type]) {
                btn.style.background = type === 'festival' ? 'rgba(255,215,0,0.18)' : 'rgba(168,85,247,0.18)';
                btn.style.borderColor = type === 'festival' ? '#FFD700' : '#A855F7';
                btn.style.color = type === 'festival' ? '#FFD700' : '#A855F7';
            } else {
                btn.style.background = '#0F1F3D';
                btn.style.borderColor = '#1a365d';
                btn.style.color = '#6b7280';
            }
        }

        function renderCrowdStationCard() {
            const stId = document.getElementById('crowd-station').value;
            const station = STATIONS.find(s => s.id === stId) || STATIONS[0];
            const cCo = station.crowd > 85 ? '#FF3B60' : station.crowd > 68 ? '#FF9500' : station.crowd > 42 ? '#FFD700' : '#00FF94';
            document.getElementById('crowd-station-card').innerHTML = `
                <div class="rv-section-title">CURRENT STATION STATUS</div>
                <div style="font-size:15px;font-weight:700;margin-bottom:3px">${station.name}</div>
                <div style="font-size:28px;font-weight:900;color:${cCo};font-family:'JetBrains Mono',monospace;margin-bottom:6px">${station.crowd}%</div>
                <div style="height:6px;background:#000;border-radius:3px;overflow:hidden;margin-bottom:6px"><div style="height:100%;width:${station.crowd}%;background:${cCo};border-radius:3px"></div></div>
                <div style="font-size:12px;color:#4A6580">${station.incoming} trains arriving · ${station.platforms} platforms</div>
            `;

            // Render 24h chart
            const hr = parseInt(document.getElementById('crowd-hour').value);
            const hourly = Array.from({ length: 24 }, (_, h) => {
                let v = 30 + Math.sin((h - 5.5) * Math.PI / 12) * 28;
                if (h >= 8 && h <= 10) v += 24; if (h >= 17 && h <= 20) v += 28;
                if (crowdParams.festival) v *= 1.45; if (crowdParams.weekend) v *= 1.18;
                return { h, v: Math.min(99, Math.max(8, Math.round(v))) };
            });
            const chartHtml = hourly.map(data => {
                const hColor = data.v > 85 ? '#FF3B60' : data.v > 68 ? '#FF9500' : data.v > 42 ? '#FFD700' : '#00FF94';
                const isCur = data.h === hr;
                return `<div style="flex:1;display:flex;flex-direction:column;align-items:center"><div style="width:100%;height:${data.v}%;background:${isCur ? '#A855F7' : hColor + '70'};border-radius:2px 2px 0 0;border:${isCur ? '1px solid #A855F7' : 'none'};min-height:2px;transition:height 0.4s"></div></div>`;
            }).join('');
            document.getElementById('crowd-chart').innerHTML = chartHtml;
            return hourly;
        }
        document.getElementById('crowd-hour').addEventListener('input', renderCrowdStationCard);

        function runCrowdPrediction() {
            const btn = document.getElementById('crowd-run-btn');
            const resContainer = document.getElementById('crowd-result');
            const hr = parseInt(document.getElementById('crowd-hour').value);
            const hourly = renderCrowdStationCard();
            const base = hourly[hr].v;

            btn.disabled = true;
            btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 inline animate-spin"></i> Predicting...`;
            resContainer.innerHTML = `
                <div class="text-center"><div class="flex justify-center mb-2 text-purple-500"><i data-lucide="eye" class="w-8 h-8 animate-pulse"></i></div><div class="text-[13px] text-gray-500 mt-3 animate-pulse">ANALYZING CROWD DYNAMICS...</div></div>
            `;
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                const crowdLabel = base > 85 ? 'CRITICAL' : base > 68 ? 'HEAVY' : base > 42 ? 'MODERATE' : 'SPARSE';
                const cCo = base > 85 ? '#FF3B60' : base > 68 ? '#FF9500' : base > 42 ? '#FFD700' : '#00FF94';
                const staff = Math.round(base / 14) + 3;
                const gates = Math.round(base / 18) + 2;

                resContainer.innerHTML = `
                <div class="rv-fade-in flex flex-col gap-3" style="width:100%">
                    <div class="flex justify-between items-start mb-3" style="width:100%">
                        <div>
                            <div style="font-size:38px;font-weight:900;color:${cCo};font-family:'JetBrains Mono',monospace;line-height:1">${base}%</div>
                            <div style="font-size:13px;color:#4A6580;margin-top:2px">At ${hr}:00</div>
                        </div>
                        <div style="text-align:right">
                            <div style="font-size:11px;font-weight:700;background:${cCo}18;color:${cCo};padding:3px 8px;border-radius:4px;margin-bottom:5px">${crowdLabel}</div>
                            <div style="font-size:12px;color:#4A6580">Staff: <span style="color:#E8F4FD;font-weight:600">${staff}</span></div>
                            <div style="font-size:12px;color:#4A6580">Gates: <span style="color:#E8F4FD;font-weight:600">${gates}</span></div>
                        </div>
                    </div>
                    <div class="rv-insight-box" style="border-color:#00E5FF;margin-bottom:10px">
                        <div style="font-size:10px;color:#00E5FF;font-weight:700;margin-bottom:3px;letter-spacing:0.07em">PASSENGER ADVISORY</div>
                        <div style="font-size:13px;color:#8BA8C8">Use Platform 1-2 secondary exits to reduce main concourse bottleneck.</div>
                    </div>
                    <div class="rv-bullet"><span class="rv-bullet-icon text-purple-500">▸</span><span class="rv-bullet-text">Deploy additional RPF staff at all primary entry gates</span></div>
                    <div class="rv-bullet"><span class="rv-bullet-icon text-purple-500">▸</span><span class="rv-bullet-text">Activate full digital announcement and display system</span></div>
                    <div class="rv-bullet"><span class="rv-bullet-icon text-purple-500">▸</span><span class="rv-bullet-text">Open overflow waiting area on Platform 8-9</span></div>
                </div>`;
                resContainer.style.alignItems = 'flex-start';
                btn.disabled = false;
                btn.innerHTML = `<i data-lucide="eye" class="w-4 h-4 mr-2 inline"></i> PREDICT CROWD`;
                if (window.lucide) window.lucide.createIcons();
            }, 1200);
        }

        // --- Multi-Agent AI System ---
        function renderAgentsGrid() {
            const grid = document.getElementById('agents-grid');
            if (!grid) return;
            grid.innerHTML = AGENT_LIST.map(ag => `
                <div class="rv-card flex flex-col" style="min-height:280px;border-color:rgba(255,255,255,0.1)">
                    <div style="padding:11px 12px;border-bottom:1px solid #1a365d">
                        <div style="font-size:20px;margin-bottom:4px">${ag.icon}</div>
                        <div style="font-size:12px;font-weight:700;color:${ag.color};margin-bottom:1px">${ag.name}</div>
                        <div style="font-size:10px;color:#4A6580;text-transform:uppercase;letter-spacing:0.08em">${ag.role}</div>
                    </div>
                    <div style="padding:6px 10px;border-bottom:1px solid #1a365d;display:flex;align-items:center;gap:5px">
                        <div id="ag-dot-${ag.id}" class="w-[5px] h-[5px] rounded-full bg-gray-500 flex-shrink-0"></div>
                        <span id="ag-stat-${ag.id}" style="font-size:10px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">STANDBY</span>
                    </div>
                    <div id="ag-res-${ag.id}" class="flex-1 overflow-y-auto p-[10px] min-h-[110px] bg-[#000]">
                        <div style="font-size:11px;color:#4A6580;text-align:center;padding-top:10px">Agent on standby</div>
                    </div>
                    <div style="padding:7px 10px;border-top:1px solid #1a365d;background:#041024">
                        <button onclick="runAgent('${ag.id}')" id="ag-btn-${ag.id}" class="w-full py-[5px] rounded border" style="background:${ag.color}12;border-color:${ag.color}55;color:${ag.color};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;font-family:'Share Tech Mono'">
                            ▶ RUN
                        </button>
                    </div>
                </div>
            `).join('');
            if (window.lucide) window.lucide.createIcons();
        }

        function renderAgentProcessing(id) {
            document.getElementById(`ag-dot-${id}`).className = 'w-[5px] h-[5px] rounded-full bg-yellow-400 flex-shrink-0 rv-blink';
            document.getElementById(`ag-stat-${id}`).innerText = 'ANALYZING';
            document.getElementById(`ag-stat-${id}`).style.color = '#facc15';
            document.getElementById(`ag-btn-${id}`).disabled = true;
            document.getElementById(`ag-btn-${id}`).innerText = 'RUNNING...';
            document.getElementById(`ag-btn-${id}`).style.opacity = '0.5';

            document.getElementById(`ag-res-${id}`).innerHTML = `
                <div class="flex flex-col gap-[7px] pt-1">
                    <div class="h-1 bg-[#1a365d] rounded-full overflow-hidden"><div class="h-full bg-cyan-500/50 w-[82%]"></div></div>
                    <div class="h-1 bg-[#1a365d] rounded-full overflow-hidden"><div class="h-full bg-cyan-500/50 w-[55%]"></div></div>
                    <div class="h-1 bg-[#1a365d] rounded-full overflow-hidden"><div class="h-full bg-cyan-500/50 w-[92%]"></div></div>
                    <div class="h-1 bg-[#1a365d] rounded-full overflow-hidden"><div class="h-full bg-cyan-500/50 w-[68%]"></div></div>
                </div>
            `;
            logAgent(`[SYS] SPUN UP AGENT NODE: ${id.toUpperCase()}`);
        }

        function renderAgentResult(id, res, color) {
            document.getElementById(`ag-dot-${id}`).className = 'w-[5px] h-[5px] rounded-full bg-green-500 flex-shrink-0';
            document.getElementById(`ag-stat-${id}`).innerText = 'COMPLETE';
            document.getElementById(`ag-stat-${id}`).style.color = '#22c55e';
            document.getElementById(`ag-btn-${id}`).disabled = false;
            document.getElementById(`ag-btn-${id}`).innerText = '↻ RE-RUN';
            document.getElementById(`ag-btn-${id}`).style.opacity = '1';

            const entries = Object.entries(res).slice(0, 5);
            document.getElementById(`ag-res-${id}`).innerHTML = entries.map(([k, v]) => {
                let vHtml = '';
                if (Array.isArray(v)) {
                    vHtml = v.slice(0, 1).map(item => typeof item === 'object' ? `${item.location}: ${item.type} (${item.severity})` : item).map(t => `<div style="font-size:11px;color:#8BA8C8;padding-left:5px;border-left:2px solid #1a365d;line-height:1.45">${t}</div>`).join('');
                } else {
                    vHtml = `<div style="font-size:11px;color:#8BA8C8;line-height:1.45">${String(v).slice(0, 100)}</div>`;
                }
                return `<div style="margin-bottom:7px"><div style="font-size:9px;color:#4A6580;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:2px">${k.replace(/_/g, ' ')}</div>${vHtml}</div>`;
            }).join('');
            logAgent(`[SYS] AGENT ${id.toUpperCase()} COMPLETED ANALYSIS.`);
        }

        function runAgent(id) {
            return new Promise(resolve => {
                const ag = AGENT_LIST.find(a => a.id === id);
                renderAgentProcessing(id);
                setTimeout(() => {
                    renderAgentResult(id, AGENT_FALLBACK[id], ag.color);
                    resolve();
                }, 900 + Math.random() * 500);
            });
        }

        async function runAllAgents() {
            const btn = document.getElementById('deploy-all-btn');
            btn.disabled = true;
            btn.innerHTML = `<span class="rv-spin">⟳</span> ORCHESTRATING...`;
            logAgent(`<span class='text-cmd-accent'>[SYS] INITIATING FULL MULTI-AGENT ORCHESTRATION SEQUENCE.</span>`);
            for (const ag of AGENT_LIST) {
                await runAgent(ag.id);
                await new Promise(r => setTimeout(r, 200));
            }
            btn.disabled = false;
            btn.innerHTML = `⚡ DEPLOY ALL AGENTS`;
            logAgent(`<span class='text-cmd-success'>[SYS] MULTI-AGENT ORCHESTRATION COMPLETE.</span>`);
        }

        // --- Simulation Engine ---
        let currentSimScenario = 'delay';
        function selectSimScenario(id) {
            currentSimScenario = id;
            document.querySelectorAll('.sim-scenario-btn').forEach(btn => {
                btn.style.background = 'transparent';
                btn.style.borderColor = '#1a365d';
                btn.querySelector('div>div:first-child').style.color = '#d1d5db';
            });
            const activeBtn = document.getElementById(`sim-btn-${id}`);
            const cur = SIM_TYPES.find(s => s.id === id);
            activeBtn.style.background = `${cur.color}12`;
            activeBtn.style.borderColor = cur.color;
            activeBtn.querySelector('div>div:first-child').style.color = cur.color;

            const pContainer = document.getElementById('sim-params');
            if (id === 'delay') {
                pContainer.innerHTML = `
                    <div style="margin-bottom:12px">
                        <label class="rv-form-label">TRAIN</label>
                        <select class="rv-select">${TRAINS_DATA.map(t => `<option value="${t.id}">${t.id} — ${t.name}</option>`).join('')}</select>
                    </div>
                    <div>
                        <div class="flex justify-between mb-1"><label class="rv-form-label">DELAY DURATION</label><span class="text-[12px] font-mono text-cmd-warning font-semibold">60 min</span></div>
                        <input type="range" min="10" max="180" value="60" class="rv-input-range" style="accent-color:#FF9500">
                    </div>`;
            } else if (id === 'festival') {
                pContainer.innerHTML = `
                    <div style="margin-bottom:12px">
                        <label class="rv-form-label">STATION</label>
                        <select class="rv-select">${STATIONS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
                    </div>
                    <div>
                        <label class="rv-form-label">FESTIVAL</label>
                        <select class="rv-select"><option>Dev Deepawali</option><option>Kumbh Mela</option><option>Diwali</option><option>Holi</option></select>
                    </div>`;
            } else {
                pContainer.innerHTML = `
                    <div>
                        <label class="rv-form-label">ROUTE</label>
                        <select class="rv-select">${ROUTES.map(r => `<option>${r.name}</option>`).join('')}</select>
                    </div>`;
            }

            const btnRun = document.getElementById('sim-run-btn');
            btnRun.style.background = `rgba(${cur.color.replace('#', '')},0.08)`;
            btnRun.style.borderColor = cur.color;
            btnRun.style.color = cur.color;
            btnRun.innerHTML = `${cur.icon.replace('w-6 h-6', 'w-4 h-4 mr-2 inline')} RUN SIMULATION`;
            document.getElementById('sim-result').innerHTML = `
                <div class="rv-card flex items-center justify-center" style="min-height:440px;padding:36px">
                    <div class="text-center"><div style="opacity:0.2;display:flex;justify-content:center">${cur.icon.replace('w-6 h-6', 'w-10 h-10')}</div><div class="text-[15px] font-semibold text-gray-500 mt-3 uppercase">${cur.name}</div><div class="text-[13px] text-gray-500 mt-2" style="max-width:300px;line-height:1.6">${cur.desc}</div></div>
                </div>`;
            if (window.lucide) window.lucide.createIcons();
        }

        function runSimulation() {
            const btn = document.getElementById('sim-run-btn');
            const resContainer = document.getElementById('sim-result');
            const cur = SIM_TYPES.find(s => s.id === currentSimScenario);
            const res = SIM_RESULTS[currentSimScenario];

            btn.disabled = true;
            btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 inline animate-spin"></i> SIMULATING NETWORK...`;
            resContainer.innerHTML = `
                <div class="rv-card rv-fade-in" style="border-color:${cur.color}35;padding:28px;text-align:center">
                    <div class="flex justify-center mb-3" style="color:${cur.color}"><i data-lucide="settings" class="w-8 h-8 animate-spin"></i></div>
                    <div style="font-size:16px;font-weight:600;color:${cur.color};margin-bottom:7px">Simulating Railway Network...</div>
                    <div style="font-size:13px;color:#4A6580;margin-bottom:20px">Modelling cascading effects across the entire network</div>
                    ${['Analyzing affected trains...', 'Computing platform conflicts...', 'Calculating passenger impact...', 'Generating recommended actions...'].map(step => `
                        <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-bottom:8px">
                            <div class="rv-blink" style="width:6px;height:6px;border-radius:50%;background:${cur.color}"></div>
                            <span style="font-size:12px;color:#4A6580">${step}</span>
                        </div>
                    `).join('')}
                </div>`;
            if (window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                let metricsHtml = '';
                if (currentSimScenario === 'delay') {
                    metricsHtml = `
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="train-front" class="w-5 h-5"></i></div><div class="rv-metric-value text-cmd-warning">${res.affected_trains}</div><div class="rv-metric-label">Affected Trains</div></div>
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="alert-triangle" class="w-5 h-5"></i></div><div class="rv-metric-value text-cmd-danger">${res.platform_conflicts}</div><div class="rv-metric-label">Platform Conflicts</div></div>
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="users" class="w-5 h-5"></i></div><div class="rv-metric-value" style="color:#A855F7">${res.passenger_impact.toLocaleString()}</div><div class="rv-metric-label">Passengers</div></div>
                    `;
                } else if (currentSimScenario === 'festival') {
                    metricsHtml = `
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="trending-up" class="w-5 h-5"></i></div><div class="rv-metric-value" style="color:#A855F7">${res.crowd_increase}</div><div class="rv-metric-label">Crowd Increase</div></div>
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="shield-alert" class="w-5 h-5"></i></div><div class="rv-metric-value" style="color:#FFD700">${res.staff}</div><div class="rv-metric-label">Staff Required</div></div>
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="train" class="w-5 h-5"></i></div><div class="rv-metric-value text-cmd-success">${res.extra_trains}</div><div class="rv-metric-label">Extra Trains</div></div>
                    `;
                } else {
                    metricsHtml = `
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="git-branch" class="w-5 h-5"></i></div><div class="rv-metric-value text-cmd-accent">${res.reroutes}</div><div class="rv-metric-label">Reroute Options</div></div>
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="train-front" class="w-5 h-5"></i></div><div class="rv-metric-value text-cmd-danger">${res.affected_trains}</div><div class="rv-metric-label">Affected Trains</div></div>
                        <div class="rv-metric-card"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="users" class="w-5 h-5"></i></div><div class="rv-metric-value" style="color:#A855F7">${res.passenger_impact.toLocaleString()}</div><div class="rv-metric-label">Passengers</div></div>
                    `;
                }

                let detailsHtml = '';
                if (currentSimScenario === 'delay' && res.cascade) {
                    detailsHtml = `
                        <div class="rv-card" style="padding:14px;margin-bottom:14px">
                            <div class="rv-section-title text-cmd-warning">CASCADE DELAYS</div>
                            ${res.cascade.map((c, i) => `
                                <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;${i < res.cascade.length - 1 ? 'border-bottom:1px solid #0F1F3D' : ''}">
                                    <div><span style="font-size:13px;font-weight:700;color:#00E5FF;font-family:'JetBrains Mono',monospace">${c.train}</span><span style="font-size:12px;color:#4A6580;margin-left:8px">${c.reason}</span></div>
                                    <span style="font-size:13px;font-weight:700;color:#FF9500;font-family:'JetBrains Mono',monospace">+${c.delay}m</span>
                                </div>
                            `).join('')}
                        </div>`;
                } else if (currentSimScenario === 'blockage' && res.options) {
                    detailsHtml = `
                        <div class="rv-card" style="padding:14px;margin-bottom:14px">
                            <div class="rv-section-title text-cmd-accent">REROUTE OPTIONS</div>
                            ${res.options.map(r => `
                                <div style="padding:8px 10px;margin-bottom:6px;background:#0F1F3D;border-radius:6px;border-left:3px solid #00E5FF">
                                    <div style="font-size:13px;font-weight:600;margin-bottom:1px">Via ${r.via}</div>
                                    <div style="font-size:12px;color:#4A6580">${r.trains} trains · +${r.time}</div>
                                </div>
                            `).join('')}
                        </div>`;
                }

                const riskColor = rCo(res.risk);
                resContainer.innerHTML = `
                    <div class="rv-fade-in">
                        <div class="rv-card" style="border-color:${cur.color}35;padding:16px 18px;margin-bottom:14px">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
                                <span>${cur.icon}</span>
                                <div>
                                    <div style="font-size:14px;font-weight:700">Simulation Complete — ${cur.name}</div>
                                    <div style="font-size:12px;color:#4A6580;margin-top:1px">Full network cascade analysis</div>
                                </div>
                                <div style="margin-left:auto;background:${riskColor}18;color:${riskColor};padding:4px 10px;border-radius:4px;font-size:12px;font-weight:700">${res.risk} RISK</div>
                            </div>
                            <div class="rv-metrics-3">${metricsHtml}</div>
                        </div>
                        ${detailsHtml}
                        <div class="rv-card" style="border-color:rgba(0,229,255,0.25);padding:14px">
                            <div class="rv-section-title text-cmd-accent">AI RECOMMENDATIONS</div>
                            ${(res.recs || res.advisories || []).map(r => `<div class="rv-bullet"><span class="rv-bullet-icon text-cmd-accent">▸</span><span class="rv-bullet-text">${r}</span></div>`).join('')}
                        </div>
                    </div>`;
                btn.disabled = false;
                btn.innerHTML = `${cur.icon.replace('w-6 h-6', 'w-4 h-4 mr-2 inline')} RUN SIMULATION`;
                if (window.lucide) window.lucide.createIcons();
            }, 2200);
        }

        // --- What-If Center ---
        const rCo = r => ({ LOW: '#00FF94', MEDIUM: '#FFD700', HIGH: '#FF9500', CRITICAL: '#FF3B60' })[r] || '#00E5FF';
        
        // --- DYNAMIC RISK ENGINE ---
        async function evaluateRiskEngine(proposedAction, railwayState = "Current network state") {
            if (typeof GROQ_API_KEY === 'undefined' || !GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
                console.warn("No Groq API Key. Falling back to mock risk data.");
                return generateMockRiskData();
            }

            const prompt = `# AI STATION MASTER RISK ENGINE
Evaluate the following proposed action against the current railway state.
Proposed Action: ${proposedAction}
Railway State: ${railwayState}

Analyze the risk and return a JSON object exactly like this:
{
  "safety": <number 0-100>,
  "crowd": <number 0-100>,
  "delay": <number 0-100>,
  "network": <number 0-100>,
  "resources": <number 0-100>,
  "hiddenRisk": "Description of any hidden cascading risks",
  "consequences": ["array", "of", "consequences"]
}`;

            try {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "llama3-8b-8192",
                        messages: [{ role: "user", content: prompt }],
                        response_format: { type: "json_object" },
                        temperature: 0.2
                    })
                });

                if (!res.ok) throw new Error("Groq API error");
                
                const json = await res.json();
                const data = JSON.parse(json.choices[0].message.content);
                
                const safety = data.safety || 0;
                const crowd = data.crowd || 0;
                const delay = data.delay || 0;
                const network = data.network || 0;
                const resources = data.resources || 0;
                
                // Weights: 30/20/20/15/15
                const overallScore = Math.round(
                    (safety * 0.30) + 
                    (crowd * 0.20) + 
                    (delay * 0.20) + 
                    (network * 0.15) + 
                    (resources * 0.15)
                );

                let risk_level = 'LOW';
                if (overallScore >= 26 && overallScore <= 50) risk_level = 'MODERATE';
                if (overallScore >= 51 && overallScore <= 75) risk_level = 'HIGH';
                if (overallScore >= 76) risk_level = 'CRITICAL';

                return {
                    safety, crowd, delay, network, resources,
                    overallScore, risk_level,
                    hiddenRisk: data.hiddenRisk || "None detected",
                    consequences: data.consequences || []
                };
            } catch (e) {
                console.error("Risk Engine Failed:", e);
                return generateMockRiskData();
            }
        }

        function generateMockRiskData() {
            return {
                safety: 85, crowd: 60, delay: 90, network: 70, resources: 50,
                overallScore: 74, risk_level: 'HIGH',
                hiddenRisk: "Simulated fallback risk data due to missing API key.",
                consequences: ["Cascade delay", "Resource drain"]
            };
        }
        // ---------------------------

        async function runWhatIf() {
            const input = document.getElementById('whatif-input').value;
            if (!input.trim()) return;
            const btn = document.getElementById('whatif-run-btn');
            const resContainer = document.getElementById('whatif-result');

            btn.disabled = true;
            btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 inline animate-spin"></i> SIMULATING ENTIRE NETWORK...`;
            resContainer.innerHTML = `
                <div class="rv-card rv-fade-in flex flex-col items-center justify-center gap-3" style="border-color:rgba(0,229,255,0.35);padding:36px;min-height:300px">
                    <div class="text-[#00E5FF] mb-2"><i data-lucide="sparkles" class="w-10 h-10 animate-pulse"></i></div>
                    <div style="font-size:16px;font-weight:600;color:#00E5FF">Simulating Railway Network...</div>
                    <div style="font-size:13px;color:#4A6580;text-align:center;max-width:440px">Analyzing cascade effects · calculating passenger impact · generating strategic response plan</div>
                    ${['Parsing scenario parameters...', 'Modeling network-wide cascades...', 'Computing passenger impact...', 'Generating action plan...'].map(step => `
                        <div style="display:flex;align-items:center;gap:8px">
                            <div class="rv-blink" style="width:5px;height:5px;border-radius:50%;background:#00E5FF"></div>
                            <span style="font-size:12px;color:#4A6580">${step}</span>
                        </div>
                    `).join('')}
                </div>`;
            if (window.lucide) window.lucide.createIcons();

            
            try {
                const riskData = await evaluateRiskEngine(input);
                
                const res = {
                    scenario_summary: `Full network analysis for: ${input.slice(0, 70)}...`,
                    risk_level: riskData.risk_level,
                    affected_trains: Math.round(riskData.overallScore / 3),
                    passenger_impact: riskData.overallScore * 400,
                    key_impacts: riskData.consequences.slice(0, 3),
                    cascade_effects: [`Hidden Risk: ${riskData.hiddenRisk}`],
                    recommended_actions: ['Activate emergency operations protocol immediately', 'Pre-position additional RPF staff', 'Issue real-time advisories'],
                    estimated_recovery: riskData.overallScore > 75 ? '8-12 hours' : '2-4 hours',
                    ai_assessment: `Dynamic AI Risk Engine Score: ${riskData.overallScore}/100. Safety: ${riskData.safety}, Crowd: ${riskData.crowd}, Delay: ${riskData.delay}, Network: ${riskData.network}, Resource: ${riskData.resources}.`
                };

                const riskColor = rCo(res.risk_level);

                resContainer.innerHTML = `
                    <div class="rv-fade-in">
                        <div style="background:${riskColor}12;border:1px solid ${riskColor}35;border-radius:12px;padding:14px 18px;margin-bottom:14px;display:flex;align-items:center;gap:14px">
                            <div style="width:52px;height:52px;border-radius:10px;background:${riskColor}18;display:flex;align-items:center;justify-content:center;flex-shrink:0" class="text-[${riskColor}]">${res.risk_level === 'CRITICAL' ? '<i data-lucide="siren" class="w-7 h-7"></i>' : '<i data-lucide="alert-triangle" class="w-7 h-7"></i>'}</div>
                            <div>
                                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                                    <span style="font-size:15px;font-weight:700">Scenario Analysis Complete</span>
                                    <span style="background:${riskColor}18;color:${riskColor};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${res.risk_level} RISK</span>
                                </div>
                                <div style="font-size:13px;color:#8BA8C8;line-height:1.5">${res.scenario_summary}</div>
                            </div>
                        </div>

                        <div class="rv-metrics-grid" style="margin-bottom:14px">
                            <div class="rv-card" style="padding:12px 10px;text-align:center"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="train-front" class="w-6 h-6"></i></div><div style="font-size:20px;font-weight:900;color:#FF9500;font-family:'JetBrains Mono',monospace;line-height:1.2;margin-bottom:3px">${res.affected_trains}</div><div style="font-size:10px;color:#4A6580;text-transform:uppercase;letter-spacing:0.07em">Affected Trains</div></div>
                            <div class="rv-card" style="padding:12px 10px;text-align:center"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="users" class="w-6 h-6"></i></div><div style="font-size:20px;font-weight:900;color:#A855F7;font-family:'JetBrains Mono',monospace;line-height:1.2;margin-bottom:3px">${res.passenger_impact.toLocaleString()}</div><div style="font-size:10px;color:#4A6580;text-transform:uppercase;letter-spacing:0.07em">Passengers Impacted</div></div>
                            <div class="rv-card" style="padding:12px 10px;text-align:center"><div class="flex justify-center mb-1 text-gray-400"><i data-lucide="clock-alert" class="w-6 h-6"></i></div><div style="font-size:12px;font-weight:900;color:#00E5FF;font-family:inherit;line-height:1.2;margin-bottom:3px;margin-top:8px">${res.estimated_recovery}</div><div style="font-size:10px;color:#4A6580;text-transform:uppercase;letter-spacing:0.07em">Recovery Time</div></div>
                            <div class="rv-card" style="padding:12px 10px;text-align:center"><div class="flex justify-center mb-1" style="color:${riskColor}"><i data-lucide="alert-triangle" class="w-6 h-6"></i></div><div style="font-size:12px;font-weight:900;color:${riskColor};font-family:inherit;line-height:1.2;margin-bottom:3px;margin-top:8px">${res.risk_level}</div><div style="font-size:10px;color:#4A6580;text-transform:uppercase;letter-spacing:0.07em">Risk Level</div></div>
                        </div>

                        <div class="rv-impact-grid">
                            <div class="rv-card" style="padding:14px">
                                <div class="rv-section-title text-cmd-warning">KEY IMPACTS</div>
                                ${res.key_impacts.map(i => `<div class="rv-bullet"><span class="rv-bullet-icon text-cmd-warning">▸</span><span class="rv-bullet-text">${i}</span></div>`).join('')}
                            </div>
                            <div class="rv-card" style="padding:14px">
                                <div class="rv-section-title text-cmd-danger">CASCADE EFFECTS</div>
                                ${res.cascade_effects.map(i => `<div class="rv-bullet"><span class="rv-bullet-icon text-cmd-danger">▸</span><span class="rv-bullet-text">${i}</span></div>`).join('')}
                            </div>
                            <div class="rv-card" style="padding:14px;border-color:rgba(0,229,255,0.25)">
                                <div class="rv-section-title text-cmd-accent">RECOMMENDED ACTIONS</div>
                                ${res.recommended_actions.map((a, i) => `
                                    <div style="display:flex;gap:8px;margin-bottom:7px;padding:5px 7px;background:#0F1F3D;border-radius:5px">
                                        <span style="color:#00E5FF;font-weight:700;flex-shrink:0;font-size:12px">${i + 1}.</span>
                                        <span style="font-size:13px;color:#8BA8C8;line-height:1.45">${a}</span>
                                    </div>
                                `).join('')}
                            </div>
                    <div class="rv-card" style="padding:14px;border-color:rgba(168,85,247,0.35)">
                                <div class="rv-section-title" style="color:#A855F7">RAILVERSE AI ASSESSMENT</div>
                                <div style="font-size:14px;color:#E8F4FD;line-height:1.65">${res.ai_assessment}</div>
                            </div>
                        </div>
                    </div>`;
                btn.disabled = false;
                btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 inline mr-2"></i> SIMULATE SCENARIO`;
                if (window.lucide) window.lucide.createIcons();
            } catch(e) {
                console.error(e);
            }
        }

        // ==========================================
        // LIVE INTELLIGENCE FEED LOGIC
        // ==========================================
        window.liveGoogleNews = [];

        async function fetchLiveNews() {
            try {
                // Fetch strictly train-related technical faults (OHE, fracture, derailment, failure)
                const rssQuery = 'indian+railways+train+AND+(OHE+OR+fracture+OR+derailment+OR+failure)';
                const rssUrl = encodeURIComponent(`https://news.google.com/rss/search?q=${rssQuery}&hl=en-IN&gl=IN&ceid=IN:en`);
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
                const data = await response.json();
                
                if (data && data.items && data.items.length > 0) {
                    window.liveGoogleNews = data.items.map(item => item.title);
                } else {
                    // Fallback to hardcoded technical faults if API is rate-limited
                    window.liveGoogleNews = [
                        "12 Wagons of Goods Train Derail Between Vrindawan and Aajhai",
                        "Thieves steal high-tension rail wire, halt Patna-Gaya train operations for 3 hours",
                        "Locomotive engine failure causes massive delays on Northern Railway route",
                        "Track fracture detected near major junction, avoiding potential derailment",
                        "Signal failure leads to gridlock, 5 express trains halted"
                    ];
                }

                // If API fails or rate limits, fallback to some default realistic intelligence for the ticker
                let newsItems = [];
                if (data && data.items && data.items.length > 0) {
                    newsItems = data.items.map(item => ({
                        title: item.title.split('-')[0].trim(), // Remove publication name suffix
                        source: "Google News",
                        link: item.link
                    }));
                } else {
                    newsItems = [
                        { title: "Ministry of Railways announces new AI-driven predictive maintenance initiative.", source: "Gov Press Release", link: "#" },
                        { title: "Fog in Northern Sector causing minor delays. ATC adapting speed limits dynamically.", source: "Network Ops", link: "#" },
                        { title: "Vande Bharat Express completes successful high-speed trial run on new dedicated freight corridor.", source: "Tech Desk", link: "#" },
                        { title: "Smart ticketing system detects 15% increase in seasonal passenger volume.", source: "Data Insights", link: "#" }
                    ];
                }

                const shuffled = newsItems.sort(() => 0.5 - Math.random());
                const feedContainer = document.getElementById('news-feed');
                feedContainer.innerHTML = '';
                
                shuffled.slice(0, 5).forEach((item, index) => {
                    const pastDate = new Date(Date.now() - (Math.random() * 3600000 + (index * 600000)));
                    const dateStr = pastDate.toLocaleString('en-US', { hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                    feedContainer.innerHTML += `
                        <div class="border-l-2 border-cmd-accent pl-3 py-2 bg-black/40 hover:bg-cmd-accent/10 transition-colors">
                            <div class="text-gray-400 text-[10px] mb-1">[${dateStr}] ${item.source}</div>
                            <a href="${item.link}" target="_blank" class="text-[#E8F4FD] hover:text-cmd-accent block leading-snug font-bold cursor-pointer">
                                ${item.title}
                            </a>
                        </div>
                    `;
                });
            } catch (err) {
                console.error("Live news feed error:", err);
                document.getElementById('news-feed').innerHTML = '<div class="text-center text-cmd-danger mt-10">[SYS] UPLINK ERROR.</div>';
            }
        }

        const socialComplaints = [
            "Train {{TRAIN}} is running 3 hours late! No updates from staff. Pathetic service! @RailMinIndia",
            "Stuck outside {{TO}} in {{TRAIN}} for 45 mins. Why is there no clearance?? #IndianRailways",
            "AC is not working in B5 coach of {{TRAIN}}. Passengers are suffocating. Please help!",
            "Why does {{TRAIN}} always get delayed near {{TO}}? Everyday the same story...",
            "Worst food ever served on {{TRAIN}}. Quality is degrading day by day @IRCTCofficial",
            "No water in toilets of {{TRAIN}} since it departed from {{FROM}}. Please look into this urgently."
        ];

        function generateSocialComplaint() {
            const feedContainer = document.getElementById('social-feed');

            // Clear initial loading message
            if (feedContainer.innerHTML.includes('INITIALIZING')) feedContainer.innerHTML = '';

            // Find a delayed train
            const delayedTrains = trains.filter(t => t.isDelayed);
            let targetTrain = null;
            if (delayedTrains.length > 0) {
                targetTrain = delayedTrains[Math.floor(Math.random() * delayedTrains.length)];
            } else if (trains.length > 0) {
                targetTrain = trains[Math.floor(Math.random() * trains.length)];
            }

            if (!targetTrain) return;

            const template = socialComplaints[Math.floor(Math.random() * socialComplaints.length)];
            const text = template
                .replace(/{{TRAIN}}/g, `TRN_${targetTrain.trainNum}`)
                .replace(/{{FROM}}/g, targetTrain.from.name)
                .replace(/{{TO}}/g, targetTrain.to.name);

            const handle = ['@rk_sharma_99', '@Priya_Travels', '@tech_nomad', '@VikasGupta_IND', '@daily_commuter'][Math.floor(Math.random() * 5)];
            const time = new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5) + " UTC";

            const div = document.createElement('div');
            div.className = "border-l-2 border-cmd-warning pl-3 py-2 bg-black/40 relative mb-3";
            div.innerHTML = `
                <div class="flex items-center gap-2 text-gray-400 text-[10px] mb-1 border-b border-gray-800 pb-1">
                    <i data-lucide="twitter" class="w-3 h-3 text-cmd-warning"></i>
                    <span class="text-cmd-warning font-bold">${handle}</span> 
                    <span>[${time}]</span>
                </div>
                <div class="text-[#E8F4FD] leading-snug break-words pr-2">${text}</div>
                <div class="mt-2 text-[10px] flex gap-4 text-gray-500">
                    <span class="hover:text-cmd-warning cursor-pointer flex items-center gap-1"><i data-lucide="heart" class="w-3 h-3"></i> ${Math.floor(Math.random() * 50) + 1}</span>
                    <span class="hover:text-cmd-warning cursor-pointer flex items-center gap-1"><i data-lucide="repeat" class="w-3 h-3"></i> ${Math.floor(Math.random() * 10)}</span>
                </div>
            `;

            feedContainer.prepend(div);
            lucide.createIcons();

            // Keep max 20
            if (feedContainer.children.length > 20) {
                feedContainer.removeChild(feedContainer.lastChild);
            }
        }

        // Initialize new UI components on load
        window.addEventListener('DOMContentLoaded', () => {
            initDropdowns();
            fetchLiveNews();

            // Start generating simulated social intelligence
            setTimeout(() => {
                generateSocialComplaint();
                setInterval(generateSocialComplaint, 14000); // New complaint every 14s
            }, 4000); // Wait 4s before first complaint

            // Refresh news every 15 minutes
            setInterval(fetchLiveNews, 15 * 60 * 1000);
        });

        // ----------------------------------------------------
        // VOICE COMMAND LOGIC
        // ----------------------------------------------------
        window.addEventListener('DOMContentLoaded', () => {
            const voiceBtn = document.getElementById('voice-btn');
            if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;

                recognition.onstart = function () {
                    voiceBtn.classList.add('text-cmd-danger', 'animate-pulse');
                    voiceBtn.classList.remove('text-gray-500', 'hover:text-cmd-accent');
                    document.getElementById('terminal-input').placeholder = "LISTENING...";
                };

                recognition.onresult = function (event) {
                    const transcript = event.results[0][0].transcript;
                    document.getElementById('terminal-input').value = transcript;
                    document.getElementById('terminal-form').dispatchEvent(new Event('submit'));
                };

                recognition.onend = function () {
                    voiceBtn.classList.remove('text-cmd-danger', 'animate-pulse');
                    voiceBtn.classList.add('text-gray-500', 'hover:text-cmd-accent');
                    document.getElementById('terminal-input').placeholder = "ENTER QUERY...";
                };

                voiceBtn.onclick = function () {
                    recognition.start();
                };
            } else if (voiceBtn) {
                voiceBtn.style.display = 'none'; // Hide if not supported
            }
        });

        // ----------------------------------------------------
        // ANALYTICS CHART INITIALIZATION
        // ----------------------------------------------------
        let analyticsInitialized = false;
        function initAnalytics() {
            if (analyticsInitialized || typeof Chart === 'undefined') return;
            analyticsInitialized = true;

            // Common Options
            Chart.defaults.color = '#a0aec0';
            Chart.defaults.font.family = "'Share Tech Mono', monospace";

            // Crowd Chart
            new Chart(document.getElementById('chart-crowd'), {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    datasets: [{
                        label: 'Projected Passengers',
                        data: [120, 190, 800, 650, 950, 400],
                        borderColor: '#00E5FF',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#00E5FF'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(26, 54, 93, 0.5)' } }, x: { grid: { color: 'rgba(26, 54, 93, 0.5)' } } } }
            });

            // Delay Chart
            new Chart(document.getElementById('chart-delay'), {
                type: 'bar',
                data: {
                    labels: ['NR', 'WR', 'CR', 'SR', 'ER'],
                    datasets: [{
                        label: 'Delay Probability (%)',
                        data: [45, 20, 60, 15, 30],
                        backgroundColor: ['#ff9933', '#00E5FF', '#ff3333', '#00ff66', '#a0aec0']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(26, 54, 93, 0.5)' } }, x: { grid: { display: false } } } }
            });

            // Sentiment Chart
            new Chart(document.getElementById('chart-sentiment'), {
                type: 'doughnut',
                data: {
                    labels: ['Positive', 'Neutral', 'Critical'],
                    datasets: [{
                        data: [40, 45, 15],
                        backgroundColor: ['#00ff66', '#00E5FF', '#ff3333'],
                        borderColor: '#041024',
                        borderWidth: 2
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '70%' }
            });
        }
        // ----------------------------------------------------
        // WEATHER & RED ALERT LOGIC
        // ----------------------------------------------------
        function triggerRedAlert(message) {
            document.body.classList.add('red-alert');
            const term = document.getElementById('terminal-output');
            if (term) {
                term.innerHTML += `<div class="text-cmd-danger font-bold blink"><span class="text-white">[CRITICAL]</span> ${message}</div>`;
                setTimeout(() => {
                    term.innerHTML += `<div class="text-cmd-warning mt-1"><span class="text-white">[SYSTEM]</span> Message has been forwarded to Station Master, RPF, and all Zonal Headquarters.</div>`;
                    term.scrollTop = term.scrollHeight;
                }, 1500);
                term.scrollTop = term.scrollHeight;
            }
            const aiStatus = document.getElementById('ai-status');
            const aiStatusDot = document.getElementById('ai-status-dot');
            if (aiStatus) {
                aiStatus.innerText = "EMERGENCY";
                aiStatus.className = "text-cmd-danger text-[13px] font-bold blink";
            }
            if (aiStatusDot) {
                aiStatusDot.className = "status-dot red animate-pulse";
            }
            // Flash a quick message via voice if possible
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance("Red Alert. " + message);
                window.speechSynthesis.speak(utterance);
            }

            // Fix: Reset the red light effect after 30 seconds
            setTimeout(() => {
                document.body.classList.remove('red-alert');
                if (typeof updateAIStatus === 'function') {
                    updateAIStatus();
                }

                if (term) {
                    term.innerHTML += `<div class="text-cmd-success font-bold mt-1"><span class="text-white">[SYSTEM]</span> EMERGENCY PROTOCOL STAND DOWN. RETURNING TO NOMINAL STATE.</div>`;
                    term.scrollTop = term.scrollHeight;
                }
            }, 30000);
        }

        async function syncLiveWeather() {
            const btn = document.getElementById('weather-sync-btn');
            const term = document.getElementById('terminal-output');
            btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 mr-2 inline animate-spin"></i> SYNCING API...';
            if (window.lucide) window.lucide.createIcons();

            try {
                // Fetch weather for Mumbai
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current_weather=true');
                const data = await res.json();
                const code = data.current_weather.weathercode;
                const temp = data.current_weather.temperature;
                const wind = data.current_weather.windspeed;

                // Codes 50+ generally mean rain/snow/storm in WMO standard
                let isSevere = (code > 50);

                // Log weather details to the terminal
                if (term) {
                    term.innerHTML += `<div class="text-cmd-accent mt-1"><span class="text-white">[WEATHER API]</span> MUMBAI: ${temp}°C, Wind: ${wind} km/h, Code: ${code}</div>`;
                    term.scrollTop = term.scrollHeight;
                }

                if (isSevere) {
                    btn.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4 mr-2 inline"></i> SEVERE WEATHER (${temp}°C, ${wind} km/h)`;
                    btn.className = "w-full mt-2 py-2.5 rounded text-[12px] font-bold tracking-wider uppercase transition-all flex items-center justify-center border border-cmd-danger text-white bg-cmd-danger animate-pulse";
                    triggerRedAlert(`MUMBAI SEVERE WEATHER DETECTED (${temp}°C, WIND: ${wind} km/h)`);
                } else {
                    btn.innerHTML = `<i data-lucide="cloud" class="w-4 h-4 mr-2 inline"></i> WEATHER NOMINAL (${temp}°C, ${wind} km/h)`;
                    btn.className = "w-full mt-2 py-2.5 rounded text-[12px] font-bold tracking-wider uppercase transition-all flex items-center justify-center border border-cmd-success text-cmd-success";
                }
            } catch (err) {
                btn.innerHTML = '<i data-lucide="x" class="w-4 h-4 mr-2 inline"></i> UPLINK FAILED';
                btn.className = "w-full mt-2 py-2.5 rounded text-[12px] font-bold tracking-wider uppercase transition-all flex items-center justify-center border border-gray-600 text-gray-500";

                if (term) {
                    term.innerHTML += `<div class="text-cmd-danger mt-1"><span class="text-white">[ERROR]</span> WEATHER API UPLINK FAILED.</div>`;
                    term.scrollTop = term.scrollHeight;
                }
            }
            if (window.lucide) window.lucide.createIcons();
        }

        window.forceSevereWeather = false; // Disabled demonstration mode to use real API

    