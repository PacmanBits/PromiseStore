# PromiseStore
A simple flux-style store, written in TypeScript that uses promise-like and chain logic.  PromiseStore is strongly-typed, allowing you to take full advantage of intellisense.

## Uses
There are two ways to use PromiseStore

### Traditional Function/Property Use

```javascript
import Store from "./store";

Store.childChanged("app.ui", function(value: any, path: string) {
    console.log("ui element " + path + " changed to " + value);
});

Store.changed("app.ui.input", function(value: any) {
    console.log("input changed to " + value);
});

Store.set("app.ui.input", 5);

var newValue = Store.get("app.ui.input");
```

### Chaining

```javascript
import Store from "./store";

Store("app.ui")
    .childChanged(function(value: any) {
        console.log("input changed to " + value);
    });

var newValue = Store("app.ui.input")
    .changed(function(value: any) {
        console.log("input changed to " + value);
    })
    .set(5)
    .get();
```

## Why Not Both?
PromiseStore comes ready to let you use bothy out-of-the-box.  Think chaining is too flashy when you only need a single function?  No problem!  Callbacks as a second parameter too clumsy?  Forget'm.

```javascript
import Store from "./store";

Store.childChanged("app.ui", function(value: any, path: string) {
    console.log("ui element " + path + " changed to " + value);
});

var newValue = Store("app.ui.input")
    .changed(function(value: any) {
        console.log("input changed to " + value);
    })
    .set(5)
    .get();

Store.set("app.ui.input", 10);
```
