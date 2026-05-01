# Accessibility And Mobile QA

Use this checklist before public sharing and again after major UI changes.

## Keyboard And Screen Reader Basics

- Tab from the browser address bar and confirm `Skip to main content` appears.
- Press Enter on the skip link and confirm focus moves into the app content.
- Confirm the mobile `Menu` button has a clear accessible label.
- Confirm active sidebar links are visually obvious in calm mode and focus mode.
- Confirm forms announce validation messages visually near the field.
- Confirm every interactive control can be reached with Tab and activated with Enter or Space.

## Mobile Checks

Test at roughly 390px wide and 844px tall:

- Landing page: primary action is visible without horizontal scroll.
- Auth page: inputs and password toggle remain usable with the keyboard open.
- Dashboard: cards stack in a readable order.
- Topic page: card deck and lesson sequence do not force horizontal scrolling.
- Step-by-step lesson: visual area, answer options, and next/previous controls remain readable.
- Graph Explorer: canvas and text walkthrough are both readable.
- Practice page: problem lens appears before the editor.

## Focus Mode Checks

- Toggle Focus mode on dashboard, topic, lesson, graph, and practice pages.
- Confirm white cards do not hide text.
- Confirm buttons and inputs still have visible borders and focus outlines.
- Confirm muted helper text remains readable.

## Known Manual Checks

This project currently uses build checks and unit tests, not a full automated accessibility suite.
Before broad release, add automated checks with Playwright plus axe-core or a similar tool.
