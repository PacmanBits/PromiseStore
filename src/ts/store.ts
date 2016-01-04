
interface IStore {
	get: (path: string) => any;
	set: (path: string, value: any) => void;
	listen: (path: string) => IListenPromises;
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
interface IListenPromises {
	changed: (callback: (value: any) => void) => IListenPromises;
	childChanged: (callback: (value: any, path: string) => void) => IListenPromises;
}

interface IStoreNode { 
	parent: IStoreNode;
	children: { [name: string]: IStoreNode };
	data: any;
	selfListeners: IListener[];
	childListeners: IChildListener[];
}

var root = createNode("", null, null);

var Store: IStore = {
	get: function(path: string): any {
		var node: IStoreNode = getNodeAtPath(path);

		if (node)
			return node.data;
		else
			return null;
	},

	set: function(path: string, value: any): void {
		var node: IStoreNode = getNodeAtPath(path, true);
		node.data = value;

		callListeners(node, path);
	},

	listen: function(path: string): IListenPromises {
		var node: IStoreNode = getNodeAtPath(path, true);

		var promises: IListenPromises = {
			changed: function(callback: IListener){
				node.selfListeners.push(callback);
				return promises;
			},
			childChanged: function(callback: IChildListener) {
				node.childListeners.push(callback);
				return promises;
			}
		}

		return promises;
	}
};

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
		parent: parent,
		childListeners: new Array<IChildListener>(),
		selfListeners: new Array<IListener>(),
		children: {},
		data: data
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
