
interface IStore {
	(path: string): IStorePromises;

	get:          (path: string) => any;
	set:          (path: string, value: any) => void;
	changed:      (path: string, callback: IListener) => void;
	childChanged: (path: string, callback: IChildListener) => void;
}

interface IListener {
	(value: any): void;
}

interface IChildListener {
	(value: any, path: string): void;
}

// We've used the extended versions of IListener
// and IChildListener here so intellisense shows
// developers the correct signature
interface IStorePromises {
	changed:      (callback: (value: any) => void) => IStorePromises;
	childChanged: (callback: (value: any, path: string) => void) => IStorePromises;
	set:          (value: any) => IStorePromises;
	get:          () => any;
}

interface IStoreNode { 
	parent:         IStoreNode;
	children:       { [name: string]: IStoreNode };
	data:           any;
	selfListeners:  IListener[];
	childListeners: IChildListener[];
}

var root = createNode("", null, null);

var Store: IStore = <IStore>function(path: string): IStorePromises {
	// Because we don't know what functions the user
	// will be accessing from the promise, we must
	// always create the node - even if it's not
	// found; even if they're only using get.
	var node: IStoreNode = getNodeAtPath(path, true);
	var promises: IStorePromises = {
		get : function() {
			return getNodeValue(node);
		},
		set : function(value: any): IStorePromises {
			setNodeValue(node, path, value);
			return promises;
		},
		changed : function(callback: IListener): IStorePromises {
			listenToNode(node, callback);
			return promises;
		},
		childChanged: function(callback: IChildListener) {
			listenToNodeChildren(node, callback);
			return promises;
		}
	}

	return promises;
};

Store.set = function(path: string, value: any): void {
	var node: IStoreNode = getNodeAtPath(path, true);
	setNodeValue(node, path, value);
};

Store.get = function(path: string): any {
	var node: IStoreNode = getNodeAtPath(path);
	return getNodeValue(node);
};

Store.changed = function(path: string, callback: IListener): void {
	var node: IStoreNode = getNodeAtPath(path, true);
	listenToNode(node, callback);
};

Store.childChanged = function(path: string, callback: IListener): void {
	var node: IStoreNode = getNodeAtPath(path, true);
	listenToNodeChildren(node, callback);
};


function getNodeValue(node: IStoreNode): any {
	if (node)
		return node.data;
	else
		return null;
}

function setNodeValue(node: IStoreNode, path: string, value: any): void {
	node.data = value;

	callListeners(node, path);
}

function listenToNode(node: IStoreNode, callback: IListener): void {
	node.selfListeners.push(callback);
}

function listenToNodeChildren(node: IStoreNode, callback: IChildListener): void {
	node.childListeners.push(callback);
}

function getNodeAtPath(path: string, createIfNotFound: boolean = false): IStoreNode {
	if (!path)
		return root;

	var sPath: string[] = splitPath(path);

	var cNode:IStoreNode = root;

	for (var i = 0; i < sPath.length; i++) {
		var nodeName: string = sPath[i];

		var child: IStoreNode = cNode.children[nodeName];

		if (!child) {
			if (createIfNotFound)
				child = createNode(nodeName, cNode, null);
			else
				return null;
		}

		cNode = child;
	}

	return cNode;
}

function splitPath(path: string): string[] {
	return path.split(".");
}

function createNode(name: string, parent: IStoreNode, data: any): IStoreNode {
	var node: IStoreNode = {
		parent         : parent,
		childListeners : new Array<IChildListener>(),
		selfListeners  : new Array<IListener>(),
		children       : {},
		data           : data
	};

	if(parent)
		parent.children[name] = node;

	return node;
}

function callListeners(node: IStoreNode, path: string): void {
	callSelfListeners(node);

	if(node.parent)
		callParentListeners(node.parent, path, node.data);
}

function callSelfListeners(node: IStoreNode): void {
	for (var i = 0; i < node.selfListeners.length; i++) {
		var listener: IListener = node.selfListeners[i];
		listener(node.data);
	}
}

function callParentListeners(node: IStoreNode, path: string, value: any): void {
	for (var i = 0; i < node.childListeners.length; i++) {
		var listener: IChildListener = node.childListeners[i];

		listener(value, path);
	}

	if (node.parent)
		callParentListeners(node.parent, path, value);
}

export default Store;
