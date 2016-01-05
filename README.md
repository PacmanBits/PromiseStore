# PromiseStore
A simple flux-style store, written in TypeScript that uses promise-like and chain logic.  PromiseStore is strongly-typed, allowing you to take full advantage of intellisense.

## Uses
There are two ways to use PromiseStore

### Traditional Function/Property Use

```typescript
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

```typescript
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
PromiseStore comes ready to let you use both property and chaining methodds out-of-the-box.  Think chaining is too flashy when you only need a single function?  No problem!  Callbacks as a second parameter too clumsy?  Forget'm.

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

## Functions
PromiseStore has four main functions, all of which are accessible either as a property of the `Store` object, or in the chain returned by `Store` when used as a function.  When accessed from the chain, the first argument (always `path: string`) is passed to the `Store` function instead.

##### `get(path: string) => any`
Gets the value of the node specified by `path`.  `get` is the only function that does not continue the chain from `Store()`.

##### `set(path: string, value: any) => void`
Sets the value of the node specified by `path` to `value`.  Triggers appropriate listeners.  Even nodes with children can have a value.

##### `changed(path: string, callback: (value: any) => void) => void`
Calls `callback` whenever the node at `path` is changed.  `callback` is passed the new value of the node.

##### `childChanged(path: string, callback: (value: any, path: string) => void) => void`
Calls `callback` whenever a child of the node at `path` is changed.  Will **not** be called if the node at `path` itself is changed.  `callback` is passed both the value and path of the changed node.
