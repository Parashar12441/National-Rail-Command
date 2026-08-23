import re

file_path = 'c:/Users/apara/.gemini/antigravity/scratch/railverse-ai/railverse-lite.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def repl_inline(match):
    size = int(match.group(1))
    return f"font-size:{size + 2}px"

content = re.sub(r'font-size:\s*(\d+)px', repl_inline, content)

def repl_tw(match):
    size = int(match.group(1))
    return f"text-[{size + 2}px]"

content = re.sub(r'text-\[(\d+)px\]', repl_tw, content)

# For tailwind standard classes
def repl_tw_std(match):
    cls = match.group(0)
    mapping = {
        'text-xs': 'text-sm',
        'text-sm': 'text-base',
        'text-base': 'text-lg'
    }
    return mapping.get(cls, cls)

content = re.sub(r'\b(text-xs|text-sm|text-base)\b', repl_tw_std, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Font sizes bumped by 2px/1 notch.")
