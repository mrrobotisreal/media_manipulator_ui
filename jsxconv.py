"""
Convert a JSX element (opener + its matching closer) to a different tag.

Depth-matching is done by counting only tags of the ORIGINAL element type, which
is sound because JSX requires those to be balanced between the opener and its
own closer. Self-closing tags (<div ... />) are skipped so they don't inflate
depth. Returns the number of conversions made.
"""
import re
import sys


def find_matching_close(src, start_idx, tag):
    """Given index just past an opening <tag ...>, return (s, e) of its </tag>."""
    depth = 0
    # Matches either an opening <tag...> (capturing whether self-closing) or </tag>
    pat = re.compile(r'<(/?)' + tag + r'(?=[\s/>])([^>]*)>', re.S)
    for m in pat.finditer(src, start_idx):
        is_close = m.group(1) == '/'
        if is_close:
            if depth == 0:
                return m.start(), m.end()
            depth -= 1
        else:
            if not m.group(2).rstrip().endswith('/'):
                depth += 1
    return None


def convert(path, opener_literal, new_opener, orig_tag, new_tag, count=None):
    src = open(path).read()
    made = 0
    while True:
        if count is not None and made >= count:
            break
        i = src.find(opener_literal)
        if i == -1:
            break
        end_of_opener = i + len(opener_literal)
        match = find_matching_close(src, end_of_opener, orig_tag)
        if match is None:
            raise SystemExit(f'{path}: no matching </{orig_tag}> for {opener_literal!r}')
        cs, ce = match
        # Replace closer first so the earlier index stays valid.
        src = src[:cs] + f'</{new_tag}>' + src[ce:]
        src = src[:i] + new_opener + src[end_of_opener:]
        made += 1
    open(path, 'w').write(src)
    return made


if __name__ == '__main__':
    path, opener, new_opener, orig_tag, new_tag = sys.argv[1:6]
    cnt = int(sys.argv[6]) if len(sys.argv) > 6 else None
    n = convert(path, opener, new_opener, orig_tag, new_tag, cnt)
    print(f'{path}: {n} conversion(s)')
