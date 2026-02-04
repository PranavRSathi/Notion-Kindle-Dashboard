# Notion Kindle Dashboard

A live, e-ink-optimized dashboard that mirrors your Notion to-do list on a Kindle
or any low-power browser.

## Features

- Kindle-friendly layout
- Day-by-day full screen view
- Clickable checkboxes
- Two-way sync with Notion
- Auto refresh (server + device)
- No jailbreak required

---

## Requirements

- Node.js 18+
- A Notion database with:
  - Title property (task name)
  - Date property (task date)
  - Checkbox property named **Done**

---

## Setup

### 1. Clone
```bash
git clone https://github.com/yourname/notion-kindle-dashboard
cd notion-kindle-dashboard
