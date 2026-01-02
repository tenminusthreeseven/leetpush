{
  "manifest_version": 3,
  "name": "LeetPush",
  "description": "Push LeetCode solutions directly to GitHub",
  "version": "1.0.0",
  "permissions": ["activeTab", "scripting"],
  "host_permissions": ["https://leetcode.com/*"],
  "action": {
    "default_popup": "index.html"
  },
  "content_scripts": [
    {
      "matches": ["https://leetcode.com/problems/*"],
      "js": ["src/content/content.js"]
    }
  ]
}
