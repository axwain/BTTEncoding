export class Node {
  constructor (data = null) {
    this.data = data
    this.left = null
    this.right = null
  }
}

export function traverseInorder (node, list) {
  const List = list || []
  if (node) {
    traverseInorder(node.left, List)
    List.push(node.data)
    traverseInorder(node.right, List)
  }

  return List
}

export function traversePreorder (node, list) {
  const List = list || []
  if (node) {
    List.push(node.data)
    traversePreorder(node.left, List)
    traversePreorder(node.right, List)
  }

  return List
}

export function traversePostorder (node, list) {
  const List = list || []
  if (node) {
    traversePostorder(node.left, List)
    traversePostorder(node.right, List)
    List.push(node.data)
  }

  return List
}
