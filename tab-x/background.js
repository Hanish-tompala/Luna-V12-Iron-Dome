// Luna V12: Iron Dome Protocol
let attachedTabs = {};

chrome.action.onClicked.addListener((tab) => {
    const tabId = tab.id;
    const debuggee = { tabId: tabId };

    if (attachedTabs[tabId]) {
        chrome.debugger.detach(debuggee);
        delete attachedTabs[tabId];
        chrome.action.setBadgeText({tabId: tabId, text: ""});
        return;
    }

    chrome.debugger.attach(debuggee, "1.3", () => {
        attachedTabs[tabId] = true;
        chrome.action.setBadgeText({tabId: tabId, text: "ON"});
        chrome.action.setBadgeBackgroundColor({tabId: tabId, color: "#00FF00"});

        // 1. ENGAGE DEBUGGER ENGINES
        chrome.debugger.sendCommand(debuggee, "Page.enable");
        chrome.debugger.sendCommand(debuggee, "Runtime.enable");

        // 2. DISABLE BACKGROUND THROTTLING (Prevents the tab from "sleeping")
        // This is critical for same-window tab switching.
        chrome.debugger.sendCommand(debuggee, "Emulation.setCPUThrottlingRate", { rate: 1 });
        chrome.debugger.sendCommand(debuggee, "Emulation.setFocusEmulationEnabled", { enabled: true });
        chrome.debugger.sendCommand(debuggee, "Emulation.setAutoDarkModeOverride", { enabled: false });

        // 3. INJECT THE CURSOR SHIELD
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: activateShield
        });
        
        // 4. RE-APPLY FOCUS EVERY 500ms
        // If you switch tabs, Chrome tries to steal focus. We steal it back.
        const interval = setInterval(() => {
            if (!attachedTabs[tabId]) {
                clearInterval(interval);
                return;
            }
            chrome.debugger.sendCommand(debuggee, "Emulation.setFocusEmulationEnabled", { enabled: true });
        }, 500);
    });
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (attachedTabs[tabId]) delete attachedTabs[tabId];
});

// === THE SHIELD FUNCTION (Runs inside the page) ===
function activateShield() {
    console.log("Luna V12: Iron Dome Active.");

    // VISUAL INDICATOR: BLUE BORDER
    document.body.style.border = "4px solid #fdfeff";

    // 1. TRAP THE MOUSE EXIT EVENTS
    // The website screams when the mouse leaves the window. We gag it.
    const trap = (e) => {
        // We only care if the mouse is leaving (mouseout/mouseleave)
        if (e.type === 'mouseout' || e.type === 'mouseleave') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    };

    // Capture these events at the very top of the DOM chain
    window.addEventListener('mouseout', trap, true);
    window.addEventListener('mouseleave', trap, true);
    document.addEventListener('mouseout', trap, true);
    document.addEventListener('mouseleave', trap, true);
    document.documentElement.addEventListener('mouseout', trap, true);
    document.documentElement.addEventListener('mouseleave', trap, true);

    // 2. FALSIFY VISIBILITY API (The "Always On" Lie)
    // Even if you switch tabs, the site checks these variables. We freeze them.
    Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    Object.defineProperty(document, 'hasFocus', { value: () => true, configurable: true });

    // 3. NUKE THE "ONBLUR" TRIGGER
    // Some sites have a "window.onblur = alert(...)" tripwire. We cut it.
    window.onblur = null;
    window.onmouseleave = null;
    document.onvisibilitychange = null;
}