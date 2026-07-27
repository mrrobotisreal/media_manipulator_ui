"""
Collapse `<Card className="... sci-fi-frame ..."><CardContent className="...">`
into a single `<Panel level="1">`.

Padding classes are stripped from BOTH elements because Panel owns responsive
padding now (p-4 sm:p-6 lg:p-8). Double padding is the most likely visual
regression from this migration, so it is removed mechanically rather than by eye.

Non-padding CardContent classes (prose, text-center, ...) are kept on an inner
wrapper div so prose scoping is preserved; when CardContent carried nothing but
padding, the element is dropped entirely.

Cards that centred themselves with `max-w-* mx-auto` used to get their inset from
the 22-32px frame border. With the frame gone they would sit flush against the
viewport edge, so those get a `px-4 sm:px-6` wrapper.
"""
import re
import sys

sys.path.insert(0, '.')
from jsxconv import find_matching_close

PAD = re.compile(r'^(?:[a-z]+:)?p[xytblr]?-\d+(?:\.\d+)?$')


def strip_pad(classes):
    return ' '.join(t for t in classes.split() if not PAD.match(t)).strip()


def collapse(path):
    src = open(path).read()
    made = 0
    while True:
        m = re.search(r'<Card className="([^"]*sci-fi-frame[^"]*)">', src)
        if not m:
            break
        card_cls = m.group(1)
        card_open_s, card_open_e = m.span()

        close = find_matching_close(src, card_open_e, 'Card')
        if close is None:
            raise SystemExit(f'{path}: unmatched </Card>')
        card_close_s, card_close_e = close

        body = src[card_open_e:card_close_s]
        cc = re.match(r'(\s*)<CardContent className="([^"]*)">', body)
        cc_noclass = re.match(r'(\s*)<CardContent>', body)
        if cc:
            cc_cls = cc.group(2)
            cc_open_s, cc_open_e = cc.span()
        elif cc_noclass:
            cc_cls = ''
            cc_open_s, cc_open_e = cc_noclass.span()
        else:
            raise SystemExit(f'{path}: <Card> not immediately followed by <CardContent>')

        ccclose = find_matching_close(body, cc_open_e, 'CardContent')
        if ccclose is None:
            raise SystemExit(f'{path}: unmatched </CardContent>')
        cc_close_s, cc_close_e = ccclose

        inner = body[cc_open_e:cc_close_s]

        panel_cls = strip_pad(card_cls.replace('sci-fi-frame', ''))
        keep_cls = strip_pad(cc_cls)

        wrap = bool(re.search(r'\bmax-w-\S+\b', panel_cls) and 'mx-auto' in panel_cls)

        attrs = f' className="{panel_cls}"' if panel_cls else ''
        if keep_cls:
            new_body = (
                f'\n        <div className="{keep_cls}">{inner}</div>\n      '
                if False
                else f'{body[:cc_open_s]}<div className="{keep_cls}">{inner}</div>'
                + body[cc_close_e:]
            )
        else:
            new_body = body[:cc_open_s] + inner + body[cc_close_e:]

        panel = f'<Panel level="1"{attrs}>' + new_body + '</Panel>'
        if wrap:
            panel = '<div className="px-4 sm:px-6">' + panel + '</div>'

        src = src[:card_open_s] + panel + src[card_close_e:]
        made += 1

    open(path, 'w').write(src)
    return made


if __name__ == '__main__':
    for p in sys.argv[1:]:
        print(f'{p}: {collapse(p)} Card->Panel')
