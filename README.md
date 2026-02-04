# 🌑 Luna V12: Iron Dome

**Luna V12** is a specialized browser utility designed to maintain absolute system focus on a specific tab. It utilizes the `chrome.debugger` API to override browser-level throttling and visibility states, ensuring a target website believes it is always active, focused, and being viewed—even if you switch windows or minimize the browser.

## 🛡️ Core Capabilities

Luna V12 operates on the "Iron Dome" protocol, a multi-layered approach to focus retention:

* **Debugger-Level Focus:** Uses `Emulation.setFocusEmulationEnabled` to force the browser engine to report the tab as "Focused" regardless of user activity.
* **Anti-Throttling:** Disables CPU throttling (`Emulation.setCPUThrottlingRate`), preventing the tab from "sleeping" or slowing down when in the background.
* **Visibility API Spoofing:** Overrides `document.hidden`, `document.visibilityState`, and `window.onblur` to permanently return `visible` and `true`.
* **Cursor Shield:** Intercepts and blocks `mouseout` and `mouseleave` events, preventing websites from detecting when the cursor leaves the viewport.
* **Visual Status:** Adds a distinct **White/Blue Border** (`#fdfeff`) to the active page to confirm the shield is engaged.

## ⚙️ Technical Details

Unlike standard extensions that inject simple scripts, Luna V12 attaches to the tab as a debugger. This allows it to:

1.  **Command:** Send direct CDP (Chrome DevTools Protocol) commands to the page.
2.  **Persistence:** A heartbeat interval re-applies focus commands every 500ms to counter browser "focus stealing."
3.  **Privilege:** Execute scripts in the main context to redefine read-only properties like `document.hidden`.

## 📦 Installation (Developer Mode)

1.  Clone this repository or download the source code.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** (top right toggle).
4.  Click **Load unpacked**.
5.  Select the folder containing `manifest.json`.

## 🚀 Usage

1.  Navigate to the target website.
2.  Click the **Luna V12 extension icon** in the toolbar.
3.  **Status Check:**
    * The extension badge will turn **GREEN ("ON")**.
    * A generic alert banner ("Iron Dome Active") is logged to the console.
    * The webpage body will gain a **4px white border**.
4.  To deactivate, click the icon again. The badge will clear and the debugger will detach.

## ⚠️ Permissions & Privacy

* `debugger`: Required to send low-level emulation commands (Focus/Throttling). **Note:** Chrome will show a generic "Started Debugging this browser" banner while active. This is a browser security feature.
* `scripting`: Required to inject the event blockers and API spoofers.
* `activeTab`: Ensures the extension only runs on the specific tab you click.

## ⚖️ Disclaimer

This tool is developed for **educational purposes** and **system monitoring** (e.g., keeping dashboards active without timeout). The author is not responsible for misuse of this software to bypass proctoring systems or violate terms of service on third-party platforms.

---
**Version:** 12.0 (Iron Dome)
**Developer:** Hanish
