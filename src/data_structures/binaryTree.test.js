import { Node, traverseInorder, traversePreorder, traversePostorder } from './binaryTree'

describe('binaryTree', () => {
  const LeafNode = new Node(1)

  const OneHeightTree = new Node(1)
  OneHeightTree.left = new Node(2)
  OneHeightTree.right = new Node(3)

  const TwoHeightTree = new Node(1)
  TwoHeightTree.left = new Node(2)
  TwoHeightTree.left.left = new Node(3)
  TwoHeightTree.right = new Node(4)

  describe('traversePreorder', () => {
    it('returns an empty array from a null root', () => {
      expect(traversePreorder(null)).toEqual([])
    })

    it('returns an array with a null element from an empty root', () => {
      const root = new Node()
      expect(traversePreorder(root)).toEqual([null])
    })

    it('returns a single element array from a leaf node', () => {
      expect(traversePreorder(LeafNode)).toEqual([1])
    })

    it('returns a preordered array from an one height tree', () => {
      expect(traversePreorder(OneHeightTree)).toEqual([1, 2, 3])
    })

    it('returns a preordered array from a two height tree', () => {
      expect(traversePreorder(TwoHeightTree)).toEqual([1, 2, 3, 4])
    })
  })

  describe('traverseInorder', () => {
    it('returns an empty array from a null root', () => {
      expect(traverseInorder(null)).toEqual([])
    })

    it('returns an array with a null element from an empty root', () => {
      const root = new Node()
      expect(traverseInorder(root)).toEqual([null])
    })

    it('returns a single element array from a leaf node', () => {
      expect(traverseInorder(LeafNode)).toEqual([1])
    })

    it('returns an inordered array from a two height tree', () => {
      expect(traverseInorder(OneHeightTree)).toEqual([2, 1, 3])
    })

    it('returns a inordered array from a three height tree', () => {
      expect(traverseInorder(TwoHeightTree)).toEqual([3, 2, 1, 4])
    })
  })

  describe('traversePostorder', () => {
    it('returns an empty array from a null root', () => {
      expect(traversePostorder(null)).toEqual([])
    })

    it('returns an array with a null element from an empty root', () => {
      const root = new Node()
      expect(traversePostorder(root)).toEqual([null])
    })

    it('returns a single element array from a leaf node', () => {
      expect(traversePostorder(LeafNode)).toEqual([1])
    })

    it('returns an postordered array from a two height tree', () => {
      expect(traversePostorder(OneHeightTree)).toEqual([2, 3, 1])
    })

    it('returns a postordered array from a three height tree', () => {
      expect(traversePostorder(TwoHeightTree)).toEqual([3, 2, 4, 1])
    })
  })
})
