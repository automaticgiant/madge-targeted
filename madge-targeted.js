#!/usr/bin/env node
/**
 * @file uses MaDGe to generate a dependency tree and then processes that output
 * to drill down in a larger codebase and visualize specific subtrees.
 *
 * @see        {@link https://github.com/automaticgiant/madge-targeted | GitHub}
 * @see        {@link https://github.com/pahen/madge | MaDGe GitHub}
 * @version    0.0.3
 * @since      2014-07-07
 * @author     Hunter Morgan<automaticgiant@gmail.com>
 * @requires   commander
 * @requires   madge
 * @requires   graphviz
 * @requires   fs
 */


/**
 * Array of dependency modules to require
 * @type {Array}
 */
var myDeps = [
  'commander', //commandline options
  'madge', //dependency tree building
  'graphviz',
  'fs' //node fs stuff
]; // then eval require them
for (dep in myDeps) eval('var '+myDeps[dep]+"=require('"+myDeps[dep]+"');");


//commandline options, by configuration, should be sufficiently documented
commander
  .version('0.0.3')
  .option('-e, --entry_point <module name>', 'Set parent of dependency tree')
  .option('-d, --src_dir <directory(s)>',
    'Set directory(s) containing source modules')
  .option('-f, --module_format [name]', 'format to parse (amd/cjs, amd default')
  .option('-x, --exclude <regex>', 'a regular expression for excluding modules')
  .option('-o, --outfile [name]', 'a file to print dot graph to')
  .option('-v, --verbose', 'print extra messages')
  .option('-t, --trace', 'trace traversal')
  // .option('-i, --image [name]', 'a file to write graph image to')
  // .option('-l, --layout [engine]', 'layout engine to use for rendering image')
  //add arg validator, esp engine
  .parse(process.argv);

//required options
if (!commander.src_dir||!commander.entry_point) {
  console.error(commander, "Sorry. Commander's free help option doesn't seem " +
    "to be working.");
  console.error('Use your words (--help to get a list)');
  process.exit(1);
}

commander.verbose && console.error('parsing');
//have MaDGe do the hard work
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
  commander.trace && console.error('Walking ' + node + '. Queue length: ' +
    queue.length);
  graph.addNode(node);
  for (var index in depTree[node]){
    var target = depTree[node][index];
    commander.trace && console.error('queueing/graphing ' + target + '...');
    queue.push(target);
    graph.addNode(target);
    graph.addEdge( node, target );
  }
  delete queue[node];
} while (queue.length!==0);

//the simple traversal potentially generated duplicates

var dot = graph.to_dot().split('\n');

//stole this dedup code from StackExchange
uniqDot = dot.filter(function(elem, pos) {
    return dot.indexOf(elem) == pos;
});

var output = uniqDot.join('\n');

//this is more complicated than it needs to be maybe, but I thought I could
//already do image output easily
if (commander.outfile) 
  // if (commander.image) 
  // }
  fs.writeFileSync(commander.outfile, output);

if (!commander.outfile&&!commander.image) console.log(output);
