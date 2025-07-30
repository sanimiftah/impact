#!/usr/bin/env python3
"""
Clean README.md by removing all emojis and duplicate content
"""

import re

def remove_emojis(text):
    """Remove all emojis from text"""
    # Unicode emoji pattern
    emoji_pattern = re.compile("["
                              u"\U0001F600-\U0001F64F"  # emoticons
                              u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                              u"\U0001F680-\U0001F6FF"  # transport & map symbols
                              u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                              u"\U00002500-\U00002BEF"  # chinese char
                              u"\U00002702-\U000027B0"
                              u"\U00002702-\U000027B0"
                              u"\U000024C2-\U0001F251"
                              u"\U0001f926-\U0001f937"
                              u"\U00010000-\U0010ffff"
                              u"\u2640-\u2642" 
                              u"\u2600-\u2B55"
                              u"\u200d"
                              u"\u23cf"
                              u"\u23e9"
                              u"\u231a"
                              u"\ufe0f"  # dingbats
                              u"\u3030"
                              "]+", re.UNICODE)
    return emoji_pattern.sub(r'', text)

def clean_readme():
    """Clean the README file"""
    print("Reading README.md...")
    
    with open('/Users/macbook/Documents/impact/README.md', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original file size: {len(content)} characters")
    
    # Remove emojis
    content_no_emojis = remove_emojis(content)
    
    # Find where duplicates start (looking for "Built with" appearing twice)
    lines = content_no_emojis.split('\n')
    
    # Find the first occurrence of the ending line
    ending_line = "*Built with  during Cognizant Vibe Coding Week | Evolved with  GitHub Copilot | Deployed with  GitHub Actions*"
    first_end_idx = None
    
    for i, line in enumerate(lines):
        if "Built with" in line and "during Cognizant Vibe Coding Week" in line:
            first_end_idx = i
            break
    
    if first_end_idx:
        # Keep only content up to the first ending
        clean_lines = lines[:first_end_idx + 1]
        clean_content = '\n'.join(clean_lines)
    else:
        clean_content = content_no_emojis
    
    # Additional cleanup
    clean_content = clean_content.replace('  ', ' ')  # Remove double spaces
    clean_content = re.sub(r'\n\n\n+', '\n\n', clean_content)  # Remove excessive newlines
    
    print(f"Cleaned file size: {len(clean_content)} characters")
    
    # Write cleaned content
    with open('/Users/macbook/Documents/impact/README.md', 'w', encoding='utf-8') as f:
        f.write(clean_content)
    
    print("✅ README.md cleaned successfully!")
    print("- Removed all emojis")
    print("- Removed duplicate content")
    print("- Cleaned up formatting")

if __name__ == "__main__":
    clean_readme()
