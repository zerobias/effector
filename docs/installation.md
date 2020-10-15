---
id: installation
title: Installation
---

```bash npm2yarn
npm install --save effector
```

### For deno

Import `effector.mjs` from any CDN

```typescript
import {createStore} from 'https://unpkg.com/effector/effector.mjs'
```

:::note since
effector 21.0.0
:::

## Complementary packages

### For react

```bash npm2yarn
npm install --save effector-react
```

### For vue

```bash npm2yarn
npm install --save effector-vue
```

### For svelte

Svelte works with effector out of the box, no additional packages needed. See [word chain](https://github.com/today-/citycatch) game application written with svelte and effector.

## Compatibility

:::note since
effector 20.1.0
:::

Use `effector/compat`, `effector-react/compat` and `effector-vue/compat` modules to support IE11 and Chrome 47 (Smart TV browser) without babel.

```diff
- import {createStore} from 'effector'
+ import {createStore} from 'effector/compat'
```
