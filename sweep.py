"""
Sweep hard-coded Tailwind palette classes to Darkroom tokens (§2.7).

Operates inside individual string literals rather than over whole files, so
context-sensitive decisions are possible: `text-white` becomes
`text-primary-foreground` on a coral fill but `text-foreground` on dark chrome.

Ordering is longest-key-first and matching is boundary-anchored, so `bg-blue-50`
can never corrupt `bg-blue-500`.
"""
import re
import sys

# Redundant dark: pairs — the base class now maps to a token that is already
# correct in both themes, so the override is dropped entirely.
DROP = [
    'dark:bg-blue-950/30', 'dark:bg-blue-950/40', 'dark:bg-blue-950/50',
    'dark:bg-blue-950/60', 'dark:bg-blue-900/40', 'dark:bg-blue-900/30',
    'dark:border-blue-900/60', 'dark:border-blue-900/40', 'dark:border-blue-800',
    'dark:text-blue-300', 'dark:text-blue-400', 'dark:text-blue-200',
    'dark:text-green-400', 'dark:text-green-300', 'dark:bg-green-950/30',
    'dark:bg-green-900/30', 'dark:border-green-900/60',
    'dark:text-purple-300', 'dark:text-purple-400', 'dark:bg-purple-950/30',
    'dark:bg-gray-900', 'dark:bg-gray-800', 'dark:bg-gray-700',
    'dark:border-gray-700', 'dark:border-gray-800', 'dark:border-gray-600',
    'dark:text-gray-400', 'dark:text-gray-300', 'dark:text-gray-500',
    'dark:hover:bg-gray-700', 'dark:hover:bg-gray-800',
    'dark:hover:text-white', 'dark:invert',
]

MAP = {
    # ---- blue -> primary (actions, links) ----
    'hover:bg-blue-700': 'hover:bg-[var(--accent-primary-hover)]',
    'hover:bg-blue-800': 'hover:bg-[var(--accent-primary-hover)]',
    'hover:bg-blue-600': 'hover:bg-[var(--accent-primary-hover)]',
    'hover:text-blue-800': 'hover:text-[var(--accent-primary-hover)]',
    'hover:text-blue-700': 'hover:text-[var(--accent-primary-hover)]',
    'hover:text-blue-600': 'hover:text-[var(--accent-primary-hover)]',
    'hover:border-blue-400/60': 'hover:border-primary/60',
    'hover:border-blue-400': 'hover:border-primary/60',
    'hover:border-blue-500': 'hover:border-primary',
    'group-hover:text-blue-600': 'group-hover:text-primary',
    'bg-blue-500/10': 'bg-primary/10',
    'bg-blue-600/10': 'bg-primary/10',
    'bg-blue-50/50': 'bg-primary/10',
    'bg-blue-100': 'bg-primary/10',
    'bg-blue-50': 'bg-primary/10',
    'bg-blue-600': 'bg-primary',
    'bg-blue-500': 'bg-primary',
    'bg-blue-700': 'bg-primary',
    'border-blue-500/40': 'border-primary/40',
    'border-blue-500': 'border-primary',
    'border-blue-400': 'border-primary/60',
    'border-blue-200': 'border-primary/30',
    'border-blue-100': 'border-primary/20',
    'text-blue-800': 'text-primary',
    'text-blue-700': 'text-primary',
    'text-blue-600': 'text-primary',
    'text-blue-500': 'text-primary',
    'text-blue-400': 'text-primary',
    'text-blue-300': 'text-primary',
    'ring-blue-500': 'ring-primary',
    'fill-blue-600': 'fill-primary',
    'stroke-blue-600': 'stroke-primary',

    # ---- green -> data (featured surfaces); success handled contextually ----
    'hover:bg-green-700': 'hover:bg-success/90',
    'hover:text-green-700': 'hover:text-data',
    'bg-green-600/10': 'bg-data/10',
    'bg-green-500/10': 'bg-data/10',
    'bg-green-100': 'bg-data/10',
    'bg-green-50': 'bg-data/10',
    'border-green-500/40': 'border-data/40',
    'border-green-500': 'border-data',
    'border-green-200': 'border-data/30',
    'text-green-700': 'text-data',
    'text-green-600': 'text-data',
    'text-green-500': 'text-data',
    'text-green-400': 'text-data',

    # ---- purple: no purple in the palette. Audio category -> film amber. ----
    'bg-purple-100': 'bg-premium/10',
    'bg-purple-600/10': 'bg-premium/10',
    'text-purple-600': 'text-premium',
    'text-purple-500': 'text-premium',
    'border-purple-500': 'border-premium',

    # ---- neutrals -> surface ramp ----
    'disabled:bg-gray-400': 'disabled:bg-surface-3',
    'hover:bg-gray-100': 'hover:bg-surface-2',
    'hover:bg-gray-200': 'hover:bg-surface-3',
    'bg-gray-400': 'bg-surface-3',
    'bg-gray-800': 'bg-surface-2',
    'bg-gray-100': 'bg-surface-2',
    'bg-gray-50': 'bg-surface-2',
    'border-gray-200': 'border-edge',
    'border-gray-300': 'border-edge',
    'border-gray-800': 'border-edge',
    'text-gray-300': 'text-muted-foreground',
    'text-gray-400': 'text-muted-foreground',
    'text-gray-500': 'text-muted-foreground',
    'text-gray-600': 'text-muted-foreground',
    'text-gray-800': 'text-foreground',
    'bg-black/80': 'bg-surface-0/80',
    'bg-black/70': 'bg-surface-0/70',
    'bg-black/60': 'bg-surface-0/60',
    'bg-black/50': 'bg-surface-0/50',
    'bg-black/40': 'bg-surface-0/40',
    'bg-black/30': 'bg-surface-0/30',
    'bg-black/95': 'bg-surface-0/95',
    'bg-black': 'bg-surface-0',
    'text-black': 'text-foreground',
    'bg-white': 'bg-surface-1',
}


def sub_token(s, key, val):
    pat = r'(?<![\w-])' + re.escape(key) + r'(?![\w/])'
    return re.sub(pat, val, s)


def sweep_classes(cls):
    original = cls
    for k in DROP:
        cls = sub_token(cls, k, '')
    for k in sorted(MAP, key=len, reverse=True):
        cls = sub_token(cls, k, MAP[k])

    # text-white / text-white/90 resolve against whatever fill is present.
    if re.search(r'(?<![\w-])text-white(?![\w/])', cls) or 'text-white/90' in cls:
        if 'bg-primary' in cls:
            fg = 'text-primary-foreground'
        elif 'bg-success' in cls:
            fg = 'text-success-foreground'
        elif 'bg-data' in cls:
            fg = 'text-data-foreground'
        elif 'bg-premium' in cls:
            fg = 'text-premium-foreground'
        elif 'bg-destructive' in cls:
            fg = 'text-white'
        else:
            fg = 'text-foreground'
        cls = re.sub(r'(?<![\w-])text-white/90(?![\w/])', fg, cls)
        cls = re.sub(r'(?<![\w-])text-white(?![\w/])', fg, cls)
    cls = re.sub(r'(?<![\w-])hover:text-white(?![\w/])', 'hover:text-foreground', cls)

    if cls != original:
        cls = re.sub(r'  +', ' ', cls).strip()
    return cls


TOUCH = re.compile(
    r'(blue|green|purple|gray)-\d{2,3}|bg-black|text-black|bg-white|text-white'
)
LITERAL = re.compile(r'(["\'`])((?:[^"\'`\\\n]|\\.)*?)\1', re.S)


def process(path):
    src = open(path).read()

    def repl(m):
        q, body = m.group(1), m.group(2)
        if not TOUCH.search(body):
            return m.group(0)
        # Skip anything that is clearly not a class list.
        if '://' in body or body.startswith('#'):
            return m.group(0)
        return q + sweep_classes(body) + q

    out = LITERAL.sub(repl, src)
    if out != src:
        open(path, 'w').write(out)
        return True
    return False


if __name__ == '__main__':
    n = 0
    for p in sys.argv[1:]:
        if process(p):
            n += 1
            print('swept', p)
    print(f'--- {n} files changed ---')
