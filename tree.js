var data = [
  {
    name: 'a',
    children: [
      {
        name: 'b',
        children: [{name: 'c'}, {name: 'd', children: [{name: 'e'}]}],
      },
    ],
  },
  {
    name: 'f',
    children: [{name: 'g'}, {name: 'h'}, {name: 'i'}],
  },
  {
    name: 'j',
    name: 'b',
  },
]

function getNodeByName(data, name, result = []) {
  for (var i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.name === name) {
      // return item
      result.push(item)
    }
    if (item.children && item.children.length) {
      getNodeByName(item.children, name, result)
    }
  }
  return result
}

function toMap(data, map = new Map()) {
  // 遍历数据
  data.forEach((item) => {
    // 如果map中没有name属性，则将name属性设置为空数组
    if (!map.get(item.name)) {
      map.set(item.name, [])
    }
    // 将item添加到map中
    map.get(item.name).push(item)
    // 如果item有children属性，并且children属性的长度大于0，则递归调用toMap函数
    if (item.children && item.children.length) {
      toMap(item.children, map)
    }
  })
  // 返回map
  return map
}

function toMap1(data) {
  let result = {}
  data.forEach((item) => {
    if (!result[item.name]) {
      result[item.name] = []
    }
    result[item.name].push(item)
    if (item.children && item.children.length) {
      result = Object.assign(result, toMap1(item.children))
    }
  })
  return result
}
// input ⬇
//        a
//        |
//        b
//       / \
//      c   d
//           \
//            e
// output ⬇
// [
//   ['a','b','c'],
//   ['a','b','d','e']
// ]
function getTreePathNodes(tree, parentNode = null) {
  const result = []
  if (!parentNode) {
    tree.path = [tree]
  } else {
    tree.path = [...parentNode.path, tree]
  }
  if (!tree.children) {
    result.push(tree.path)
  }
  if (tree.children && tree.children.length) {
    tree.children.forEach((item) => {
      result.push(...getTreePathNodes(item, tree))
    })
  }
  return result
}
// getTreePathNodes(data[0])
function getTreePathNodes1(tree, parentNode = null, result = []) {
  if (!parentNode) {
    tree.path = [tree]
  } else {
    tree.path = [...parentNode.path, tree]
  }
  if (!tree.children) {
    result.push(tree.path)
  }
  if (tree.children && tree.children.length) {
    tree.children.forEach((item) => {
      getTreePathNodes1(item, tree, result)
    })
  }
  return result
}

function getTreeArrPathNodes(data) {
  const result = []
  data.forEach((item) => {
    result.push({name: item.name, data: getTreePathNodes1(item)})
  })
  return result
}
// getTreeArrPathNodes(data)

function getFlatTreeArr(data, result = [], pid = -1) {
  data.forEach((item) => {
    result.push({name: item.name, pid})
    if (item.children && item.children.length) {
      getFlatTreeArr(item.children, result, item.name)
    }
  })
  return result
}
getFlatTreeArr(data)
