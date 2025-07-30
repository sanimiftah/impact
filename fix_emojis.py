#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# Read the file
with open('/Users/macbook/Documents/impact/public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken emojis
content = content.replace('� OpenCall', '📣 OpenCall')
content = content.replace('� TeamSpace', '🤝 TeamSpace')
content = content.replace('� ImpactLog', '📖 ImpactLog')

# Also replace standalone broken emoji symbols
content = re.sub(r'<span class="text-2xl">�</span>', '<span class="text-2xl">📣</span>', content)

# Write back to file
with open('/Users/macbook/Documents/impact/public/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Emoji fixes applied successfully!")
