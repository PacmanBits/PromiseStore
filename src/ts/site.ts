import Store from "./store";

// This makes "Store" accessible
// from the browser console for
// debugging
(window as any)["Store"] = Store;

// Chain-call usage
Store("hello")
	.changed(function(value) {
		console.log("hello changed to " + value);
	})
	.childChanged(function(value, path) {
		console.log("child of hello (" + path + ") changed to " + value);
	})
	.set("world"); // chaining is immediate.  This set will trigger the above "changed"

// Typical function usage
Store("hello").changed(function(value) {
	console.log("I'm also listening to hello - it was changed to " + value);
});

Store.set("hello", "planet");
Store.set("hello.goodbye", "wave");

// Output should be
// > hello changed to world
// > hello changed to planet
// > I'm also listening to hello - it was changed to planet
// > child of hello (hello.goodbye) changed to wave