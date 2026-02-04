# Notion → Kindle Dashboard 

A lightweight Node.js server that turns a Notion task database into a
**Kindle-friendly, distraction-free HTML dashboard** with clickable checkboxes
and auto-refresh.

No Docker.  
No jailbreak.  
Just Notion + Node + HTML.

---

##  Duplicate the Notion Template (Required)

 **Duplicate this Notion database first:**

https://freezing-sparrow-715.notion.site/2fd3140d2a0e81cfabc1f133aab2ba42?v=2fd3140d2a0e817e9765000c54d4e25d

This template already contains the **exact property structure** expected by the
server.

### Required Properties
| Name | Type |
|----|----|
| Task | Title |
| Date | Date |
| Done | Checkbox |

⚠️ Do **not** rename these unless you update the code.

---

##  Features

- ☑️ Clickable checkboxes (syncs back to Notion)
- 📆 Day-wise full-screen view (perfect for Kindle)
- 🔄 Auto refresh (tasks added in Notion appear automatically)
- 🧠 Notion remains the single source of truth
- 📱 Works on Kindle, macOS, Windows, Linux
- ⚡ Ultra-light HTML optimized for e-ink

---

## Requirements

- Node.js **18+**
- A Notion account
- A duplicated copy of the Notion template above

---

## Notion Setup

### 1️⃣ Create Integration
- Go to https://www.notion.so/my-integrations
- Create a new integration
- Copy the **Internal Integration Token**

### 2️⃣ Share Database
- Open your duplicated database
- Click **Share**
- Invite the integration
- Give **Edit access**

### 3️⃣ Get Database ID
From the database URL: https://www.notion.so/xxxxxxxxDATABASE_IDxxxxxxxx

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/PranavRSathi/notion-kindle-dashboard
cd notion-kindle-dashboard
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment

Create a `.env` file:

```env
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxx
```

Edit `server.js`:

```js
const DATABASE_ID = "your_database_id_here";
```

---

## ▶️ Run the Server

```bash
node server.js
```

You should see:

```
✔ HTML regenerated
✔ Server running at http://localhost:3000/new.html
```

---

##  Access the Dashboard

### On your computer

```
http://localhost:3000/new.html
```

### On Kindle (same Wi-Fi network)

```
http://YOUR_COMPUTER_IP:3000/new.html
```

Example:

```
http://192.168.1.15:3000/new.html
```

---

## 📖 Kindle Optimization Tips

* Rotate to **landscape mode**
* Enable **Article Mode** if available
* Set screen timeout to **maximum**
* Ignore the address bar (cannot be hidden on stock Kindle)

---

## Auto-Refresh Behavior

### What happens when…

| Event                | Result                          |
| -------------------- | ------------------------------- |
| Server starts        | HTML generated                  |
| Task checked         | Notion updated immediately      |
| Task added in Notion | Appears within refresh interval |
| Page refresh         | State stays correct             |

### Refresh intervals (default)

* **Server → Notion sync:** 2 minutes
* **Browser auto-reload:** 2 minutes

(Adjustable in `server.js`)

---

## VS Code Live Server (Optional)

Use this **only to preview layout**.

1. Install **Live Server** extension
2. Run:

   ```bash
   node server.js
   ```
3. Right-click `new.html` → **Open with Live Server**

**Note**

* Live Server is **read-only**
* Checkbox clicks will **not** sync
* Use the Node server for full functionality

---

## 🛠 Troubleshooting

### “No tasks found”

* Ensure database is shared with the integration
* Ensure properties match the template exactly

### Checkboxes visually reset

* Auto-refresh fixes this
* Notion data remains correct

### Kindle can’t connect

* Device is on the same Wi-Fi network
* Firewall allows port **3000**

### `node` is not recognized

* Install Node.js from [https://nodejs.org](https://nodejs.org)
* Restart the terminal

---

## Security

* Notion token stays local
* No external servers
* No tracking
* Safe for home networks

---

## Why This Exists

Phones distract.
Paper can’t update.
E-ink is calm.

This puts your **actual Notion tasks** somewhere you can’t ignore — without
notifications, apps, or friction.

---

## Support

If this helped you:

* Star the repository
* Share with other Kindle / Notion users

