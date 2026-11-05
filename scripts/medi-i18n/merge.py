#!/usr/bin/env python3
"""Merge a locale's Medi launch strings (source-ui.json shape) into its interface/pages.json.
usage: merge.py <locale-dir> <translated.json>   (translated.json has the exact shape of source-ui.json)"""
import json, sys
loc, src = sys.argv[1], sys.argv[2]
p = f'i18n/locales/{loc}/interface/pages.json'
d = json.load(open(p, encoding='utf-8'))
s = json.load(open(src, encoding='utf-8'))
d['pricing']['rows'].update(s['pricing']['rows'])
d['pricing']['values'].update(s['pricing']['values'])
d['mediPage'] = s['mediPage']
d['tutorials']['categories']['medi'] = s['tutorialsCategory']
d['tutorials']['tutorials']['medi'] = s['tutorial']
json.dump(d, open(p, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
open(p, 'a').write('\n')
