​Daniel HQ — Development Log 03/26/25
​Project
​Home automation system with a Node.js backend running on a 24/7 Debian server.
​Objective: Create a modular home automation engine with events, sensors, scenes, and device control.
​Magic Home: "Any sufficiently advanced technology is indistinguishable from magic."
​Project Definitions
​2026/03/19: The main idea is to map the relationship between physical space and human intention.
​2026/03/19: Room is the smallest spatial unit with its own identity, capable of interpreting and reacting to intentions.
​Current Infrastructure
​Master (Dev): Windows | VS Code | Remote SSH
​Server (Runtime): Debian | IP: 192.168.1.17 | Node.js managed by PM2
​Project Structure: controllers/, core/, data/, routes/, services/, state/, ui/
​Architectural Components
​EventBus: Internal event system for inter-module communication.
​HouseEngine: The core orchestrator managing sensors, devices, and automations.
​LogEngine: Centralized logging and history system.
​State: Persists states for presence, sensors, rooms, scenes, and energy.
​Technical Decisions & Evolution
​2026/03/19 — New Organization
​The deviceRegistry now resolves identity (room + device).
Flow: API → EventBus → HouseEngine → DeviceService → TuyaService → Device → LogEngine (Narrative)
​Functional UI with light toggles and On/Off animations.
​High-end interface tested and functional.
​Codebase refactored: tuyaService.js, houseEngine.js, server.js, etc.
​2026/03/20 — System Status Summary
​Truth Source: Tuya remains the "source of truth" while the Server acts as the Observer + Orchestrator.
​Access Model: Based on physical context (NFC Tags + Room URL). Roles: Guest, User, Admin.
​Insight: It’s not just automation; it’s a system that models the house to provide contextual control.
​2026/03/29 — Addressable LED Architecture
​Hardware: ESP32 (Max 5 GPIOs per unit).
​LED Type: WS2815 (12V) for robustness and low voltage drop.
​Wiring: CAT6 cables (8 wires for data, power redundancy, and future expansion).
​Safety: Sonoff units used for physical power cut/maintenance, not logic.
​MagicOS Dev Log — The "Tuya Victory"
​Status: Critical Breakthrough. Result: MagicOS 1 x 0 Tuya IoT Platform.
​Key Achievements:
​Local Control: Extracted all local_key values, enabling local execution and reducing cloud dependency.
​Capability-Based Linking: Devices are now linked via capability_id, eliminating reliance on dynamic Tuya IDs.
​Equipotential GND: Mandatory for signal stability across the 12V infra.
​Future UI/UX Vision (Room-Oriented):
​The interface will respond to proximity/sensors:
​Standby: Black background, clock at 0.3 opacity.
​Proximity: Screen wakes to lock state.
​Functional: Full menu access.
​Narrative: High-interaction state for AI/Assistant engagement.
​Next Steps (Priorities)
​Local Driver: Establish direct communication with bulbs using local_key and Tuya local protocol.
​Event Standardization: Implement standard naming conventions:
​device.action, presence.detected, power.grid.lost.
​Automation Rules: Introduce presenceRules.js and energyRules.js.
​Music Mode: Build the audio pipeline for real-time frequency mapping to LEDs.
​