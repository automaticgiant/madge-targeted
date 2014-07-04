#!/bin/bash
dot_path=~/bin/dot

for engine in dot sfdp fdp
  do
  $dot_path -Tsvg -K$engine graph.dot > output/graph-$engine.svg
done