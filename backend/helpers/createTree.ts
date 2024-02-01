import { TreeNode, TreeSelectNode } from '../commonTypes';

function createTree(arr: TreeNode[], parentId = ""): TreeSelectNode[] {
  const tree: TreeSelectNode[] = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      const newItem: TreeSelectNode = { value: item._id.toString(), title: item.title };

      const children = createTree(arr, item._id.toString()); // convert ObjectId to string
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}

export const createTreeHelper = (arr: TreeNode[], parentId = ""): TreeSelectNode[] => {
  const resultTree = createTree(arr, parentId);
  return resultTree;
};
