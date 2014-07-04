#!/usr/bin/env node

var myDeps = [
  'commander',
  'madge',
  'graphviz',
  'fs'
];
for (dep in myDeps) eval('var '+myDeps[dep]+"=require('"+myDeps[dep]+"');");

commander
  .version('0.0.2')
  .option('-e, --entry_point <module name>', 'Set parent of dependency tree')
  .option('-d, --src_dir <directory(s)>',
    'Set directory(s) containing source modules')
  .option('-f, --module_format [name]', 'format to parse (amd/cjs, amd default')
  .option('-x, --exclude <regex>', 'a regular expression for excluding modules')
  .option('-o, --outfile [name]', 'a file to print dot graph to')
  // .option('-i, --image [name]', 'a file to write graph image to')
  // .option('-l, --layout [engine]', 'layout engine to use for rendering image')
  //add arg validator, esp engine
  .parse(process.argv);

if (!commander.src_dir||!commander.entry_point) {
  // console.error(commander);
  console.error('Use your words (--help to get a list)');
  process.exit(1);
}

console.error('parsing');
var depTree = madge(commander.src_dir,
  {
    format: commander.module_format||'amd',
    exclude: commander.exclude
  }).tree;

var queue = [];
var entryPoint = commander.entry_point;
queue.push(entryPoint);
var graph = graphviz.digraph('"' + entryPoint + ' deps"');
do {
  var node = queue.pop();
  console.error('Walking ' + node + '. Queue length: ' + queue.length);
  graph.addNode(node);
  for (var index in depTree[node]){
    var target = depTree[node][index];
    // console.error('queueing/graphing ' + target + '...');
    queue.push(target);
    graph.addNode(target);
    graph.addEdge( node, target );
  }
  delete queue[node];
} while (queue.length!==0);

var dot = graph.to_dot().split('\n');

uniqDot = dot.filter(function(elem, pos) {
    return dot.indexOf(elem) == pos;
});

var output = uniqDot.join('\n');

if (commander.outfile) 
  // if (commander.image) 
  // }
  fs.writeFileSync(commander.outfile, output);

if (!commander.outfile&&!commander.image) console.log(output);
