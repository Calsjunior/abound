#!/usr/bin/env bash

# View port defaults to 320px 1920px with font-size: 16px as base.
# Usage: ./clamp.sh [min-size] [max-size] [min-viewport] [max-viewport] [base]

smin="${1:-16}"
smax="${2:-48}"
vmin="${3:-320}"
vmax="${4:-1920}"
base="${5:-16}"

calc() {
    printf "%.3f" "$(echo "scale=6; $1" | bc)"
}

min_val="$(calc "$smin / $base")"
max_val="$(calc "$smax / $base")"
slope="($smax - $smin) / ($vmax - $vmin)"
intercept="$(calc "($smin - ($slope) * $vmin) / $base")"
preferred="$(calc "($slope) * 100")"
result="clamp(${min_val}rem, ${intercept}rem + ${preferred}vw, ${max_val}rem)"

copy_to_clipboard() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        pbcopy
    elif [[ -n "${WSL_DISTRO_NAME:-}" ]] || grep -qi microsoft /proc/version 2>/dev/null; then
        clip.exe
    elif [[ -n "${WAYLAND_DISPLAY:-}" ]]; then
        wl-copy
    else
        echo " [Warning: Unrecognized clipboard environment]"
        return 1
    fi
}

if echo -n "$result" | copy_to_clipboard; then
    echo "$result (Copied to clipboard)"
else
    echo "$result"
fi
