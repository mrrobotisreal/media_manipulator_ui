#!/usr/bin/env python3
"""Insert a translated Medi launch page body into i18n/locales/<loc>/toolPages.ts.
usage: merge_body.py <locale-dir> <body.json>   (same shape as source-body.json)"""
import json, sys, re
loc, src = sys.argv[1], sys.argv[2]
p = f'i18n/locales/{loc}/toolPages.ts'
s = open(p, encoding='utf-8').read()
if re.search(r"^    'medi': \{", s, re.M):
    sys.exit('medi already present in ' + p)
b = json.load(open(src, encoding='utf-8'))
def ts(v, ind):
    pad = '  ' * ind
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, list):
        if not v: return '[]'
        return '[\n' + ''.join(pad + '  ' + ts(x, ind + 1) + ',\n' for x in v) + pad + ']'
    if isinstance(v, dict):
        return '{\n' + ''.join(pad + '  ' + k + ': ' + ts(x, ind + 1) + ',\n' for k, x in v.items()) + pad + '}'
    return json.dumps(v)
block = "    // MM111: Medi's launch page (model-written by Opus 5.5; native review pending).\n    'medi': " + ts(b, 2) + ",\n"
tail = "  },\n} as const;"
i = s.rindex(tail)
s = s[:i] + block + s[i:]
open(p, 'w', encoding='utf-8').write(s)
