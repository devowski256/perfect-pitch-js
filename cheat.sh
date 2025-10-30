#!/bin/bash

freqs=(
  262 
  294 
  330
  349
  392
  440 
  494
)

echo "Type a number 1-7 to play a note, or q to quit."

while true; do
    read -p "> " key
    case "$key" in
        1|2|3|4|5|6|7)
            idx=$((key - 1))
            echo "Playing ${freqs[$idx]} Hz"
            play -n synth 5 sine "${freqs[$idx]}" >/dev/null 2>&1
            ;;
        q)
            echo "Exiting."
            break
            ;;
        *)
            echo "Invalid. Type 1-7 or q."
            ;;
    esac
done