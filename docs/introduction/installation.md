---
id: installation
title: Installation
---
**Online playground**

If you’re interested in playing around with Effector, you can use an [online code playground](https://effector.now.sh/try).

**CDN**

For fast prototyping, you can use the latest version with:

```
<script src="https://unpkg.com/effector@0.18.6/effector.umd.js"></script>
```

**NPM/Yarn**

**Prerequisite**: either NPM (comes with [node]) or [Yarn].

    npm install --save effector

Or

    yarn add effector

**Complementary packages**

You can also add an additional package for your instrument to extend the effector's capabilities.


* __For Web Framework/Libraries:__

  |                                           Package                                            |                                                       Version                                                       |                                                                             Dependencies                                                                             |
  | :------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
  | [`effector-react`](https://github.com/zerobias/effector/tree/master/packages/effector-react) | [![npm](https://img.shields.io/npm/v/effector-react.svg?maxAge=3600)](https://www.npmjs.com/package/effector-react) | [![Dependency Status](https://david-dm.org/zerobias/effector.svg?path=packages/effector-react)](https://david-dm.org/zerobias/effector?path=packages/effector-react) |
  |   [`effector-vue`](https://github.com/zerobias/effector/tree/master/packages/effector-vue)   |   [![npm](https://img.shields.io/npm/v/effector-vue.svg?maxAge=3600)](https://www.npmjs.com/package/effector-vue)   |   [![Dependency Status](https://david-dm.org/zerobias/effector.svg?path=packages/effector-vue)](https://david-dm.org/zerobias/effector?path=packages/effector-vue)   |
* __For another languages:__

  |                                              Package                                               |                                                          Version                                                          |                                                                                Dependencies                                                                                |
  | :------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
  |       [`bs-effector`](https://github.com/zerobias/effector/tree/master/packages/bs-effector)       |       [![npm](https://img.shields.io/npm/v/bs-effector.svg?maxAge=3600)](https://www.npmjs.com/package/bs-effector)       |       [![Dependency Status](https://david-dm.org/zerobias/effector.svg?path=packages/bs-effector)](https://david-dm.org/zerobias/effector?path=packages/bs-effector)       |
  | [`bs-effector-react`](https://github.com/zerobias/effector/tree/master/packages/bs-effector-react) | [![npm](https://img.shields.io/npm/v/bs-effector-react.svg?maxAge=3600)](https://www.npmjs.com/package/bs-effector-react) | [![Dependency Status](https://david-dm.org/zerobias/effector.svg?path=packages/bs-effector-react)](https://david-dm.org/zerobias/effector?path=packages/bs-effector-react) |

These packages are not necessary when using the effector, but they are very useful.

For example: If you are using React and need to connect the storage to a functional component, you can add [effector-react]() package and use [useStore]() hook. Read more about this and other things [here]

### **Release Notes**

Latest stable version: 0.18.6

Detailed release notes for each version effector and other packages are available on [**github**](https://github.com/zerobias/effector/releases).