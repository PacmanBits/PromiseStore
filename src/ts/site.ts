import Store from "./store";


Store.set("hello", "world");

Store.listen("hello")
	.changed(function(value: any) {
		console.log("this node changed to " + value);
	})
	.childChanged(function(value: any, path: string) {
		console.log(path + " node changed to " + value);
	});

console.log(Store.get("hello"));

Store.set("hello", "planet");
Store.set("hello.thing", "blah");
