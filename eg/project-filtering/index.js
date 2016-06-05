// Old built-ins may appear in conditional requires
// which will lead to inclusion in the graph.
// This examples shows that filtered built-ins,
// old or new are ignored.
//
// This doesn't belong in "project-conditional"
// because it's specifically testing filter semantics.
var conditional = false ? require('sys') : require('util');
