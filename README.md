# ☄️ Effector

The state manager

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
  - [Effector follows five basic principles:](#effector-follows-five-basic-principles)
- [Installation](#installation)
- [Documentation](#documentation)
- [Packages](#packages)
- [Articles](#articles)
- [Community](#community)
- [Online playground](#online-playground)
- [Examples](#examples)
  - [Increment/decrement with React](#incrementdecrement-with-react)
  - [Hello world with events and nodejs](#hello-world-with-events-and-nodejs)
  - [Stores and events](#stores-and-events)
- [More examples](#more-examples)
- [API](#api)
  - [Event](#event)
  - [Effect](#effect)
  - [Store](#store)
    - [Store composition/decomposition](#store-compositiondecomposition)
  - [Domain](#domain)
  - [Learn more](#learn-more)
- [Support us](#support-us)
- [Tested with browserstack](#tested-with-browserstack)
- [Contributors](#contributors)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

Effector is an effective multi-store state manager for Javascript apps **(React/React Native/Vue/Node.js)**, that allows you to manage data in complex applications without the risk of inflating the monolithic central store, with clear control flow, good type support and high capacity API. Effector supports both **TypeScript** and **Flow** type annotations _out of the box_.

### Effector follows five basic principles:

- **Application stores should be as light as possible** - the idea of adding a store for specific needs should not be frightening or damaging to the developer.
- **Application stores should be freely combined** - data that the application needs can be statically distributed, showing how it will be converted in runtime.
- **Autonomy from controversial concepts** - no decorators, no need to use classes or proxies - this is not required to control the state of the application and therefore the api library uses only functions and plain js objects
- **Predictability and clarity of API** - a small number of basic principles are reused in different cases, reducing the user's workload and increasing recognition. For example, if you know how .watch works for events, you already know how .watch works for stores.
- **The application is built from simple elements** - space and way to take any required business logic out of the view, maximizing the simplicity of the components.

## Installation

```sh
npm install --save effector
# or
yarn add effector
```

**React**

```sh
npm install --save effector effector-react
# or
yarn add effector effector-react
```

**Vue**

```sh
npm install --save effector effector-vue
# or
yarn add effector effector-vue
```

**Svelte**

Svelte works with effector out from a box, no additional packages needed. See [word chain](https://github.com/today-/citycatch) game application written with svelte and effector.

**CDN**

- https://unpkg.com/effector/effector.cjs.js
- https://unpkg.com/effector/effector.mjs
- https://unpkg.com/effector-react/effector-react.cjs.js
- https://unpkg.com/effector-vue/effector-vue.cjs.js

## Documentation

For additional information, guides and api reference visit [our documentation site](https://effector.now.sh/docs/introduction/core-concepts)

## Packages

|      Package       |             Version              |               Size               |
| :----------------: | :------------------------------: | :------------------------------: |
|    [`effector`]    | [![npm-effector]][pack-effector] | [![size-effector]][pho-effector] |
| [`effector-react`] |    [![npm-react]][pack-react]    |    [![size-react]][pho-react]    |
|  [`effector-vue`]  |      [![npm-vue]][pack-vue]      |      [![size-vue]][pho-vue]      |

[`effector`]: https://effector.now.sh/docs/api/effector
[`effector-react`]: https://effector.now.sh/docs/api/effector-react/effector-react
[`effector-vue`]: https://effector.now.sh/docs/api/effector-vue/effector-vue
[npm-effector]: https://img.shields.io/npm/v/effector.svg?maxAge=3600
[npm-react]: https://img.shields.io/npm/v/effector-react.svg?maxAge=3600
[npm-vue]: https://img.shields.io/npm/v/effector-vue.svg?maxAge=3600
[pack-effector]: https://npmjs.com/effector
[pack-react]: https://npmjs.com/effector-react
[pack-vue]: https://npmjs.com/effector-vue
[size-effector]: https://img.shields.io/bundlephobia/minzip/effector
[size-react]: https://img.shields.io/bundlephobia/minzip/effector-react
[size-vue]: https://img.shields.io/bundlephobia/minzip/effector-vue
[pho-effector]: https://bundlephobia.com/result?p=effector
[pho-react]: https://bundlephobia.com/result?p=effector-react
[pho-vue]: https://bundlephobia.com/result?p=effector-vue

## Articles

- [Why I choose Effector instead of Redux or MobX](https://dev.to/lessmess/why-i-choose-effector-instead-of-redux-or-mobx-3dl7)
- [Effector — State Manager You Should Give a Try](https://itnext.io/effector-state-manager-you-should-give-a-try-b46b917e51cc)
- [Effector vs. Vuex. Which storage management is better for VueJS app?](https://medium.com/blue-harvest-tech-blog/effector-vs-vuex-which-storage-management-is-better-for-vuejs-app-54f3c3257b53)
- [Powerful and fast state manager](https://codeburst.io/effector-state-manager-6ee2e72e8e0b)
- [Testing api calls with effects and stores](https://www.patreon.com/posts/testing-api-with-32415095)

## Community

- [awesome-effector](https://github.com/effector/awesome-effector) a curated list of awesome effector packages, videos and articles
- [Twitter](https://twitter.com/effectorjs)
- [Telegram](https://t.me/effector_en) (@effector_en)
- [Telegram 🇷🇺](https://t.me/effector_ru) (@effector_ru)
- [Gitter](https://gitter.im/effector-js/community)
- Add a [GitHub Topic `effector`](https://github.com/topics/effector) to your project's home page

## Online playground

You can try effector in [our repl](https://share.effector.dev)

Code sharing, Typescript and react supported out of the box; and of course, it [built with effector](https://github.com/effector/effector/tree/master/website/editor/src)

## Examples

### Increment/decrement with React

```jsx
import {createStore, createEvent} from 'effector'
import {useStore} from 'effector-react'

const increment = createEvent()
const decrement = createEvent()
const resetCounter = createEvent()

const counter = createStore(0)
  .on(increment, state => state + 1)
  .on(decrement, state => state - 1)
  .reset(resetCounter)

counter.watch(console.log)

const Counter = () => {
  const value = useStore(counter)
  return <div>{value}</div>
}

const App = () => {
  const value = useStore(counter)

  return (
    <>
      <Counter />
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={resetCounter}>reset</button>
    </>
  )
}
```

[Run example](https://share.effector.dev/qVLO42Cs)

<hr />

### Hello world with events and nodejs

```js
const {createEvent} = require('effector')

const messageEvent = createEvent()

messageEvent.watch(text => console.log(`new message: ${text}`))

messageEvent('hello world')
// => new message: hello world
```

[Run example](https://share.effector.dev/CSKJUI4E)

<hr />

### Stores and events

```js
const {createStore, createEvent} = require('effector')

const turnOn = createEvent()
const turnOff = createEvent()

const status = createStore('offline')
  .on(turnOn, () => 'online')
  .on(turnOff, () => 'offline')

status.watch(newStatus => {
  console.log(`status changed: ${newStatus}`)
})
// for store watchs callback invokes immediately
// "status changed: offline"

turnOff() // nothing has changed, callback is not triggered
turnOn() // "status changed: online"
turnOff() // "status changed: offline"
turnOff() // nothing has changed
```

[Run example](https://share.effector.dev/iXQVXIEv)

<hr />

## More examples

- [Snake game (interactive A\* algorithm visualisation)](https://dmitryshelomanov.github.io/snake/) ([source code](https://github.com/dmitryshelomanov/snake))
- [Ballcraft game](https://ballcraft.now.sh/) ([source code](https://github.com/kobzarvs/effector-craftball))
- [Client-server interaction with effects](https://github.com/effector/effector/tree/master/examples/worker-rpc) Github
- [Reddit reader](https://share.effector.dev/T5CyxSFl) With effects for data fetching and effector-react hooks
- [Lists rendering](https://share.effector.dev/OlakwECa) With `useList` hook
- [Dynamic typing status](https://share.effector.dev/tAnzG5oJ)
- [Forward data between effects](https://share.effector.dev/RYQ5z59Q)
- [Range input component](https://share.effector.dev/oRB2iB8M)
- [Modal dialog](https://share.effector.dev/B2ShiBzm)
- [Conditional filtering](https://share.effector.dev/1EsAGMyq)
- [Request cancellation](https://share.effector.dev/W4I0ghLt)
- [Dynamic form fields, saving and loading from localStorage with effects](https://share.effector.dev/Qxt0zAdd)
- [Loading initial state from localStorage with domains](https://share.effector.dev/YbiBnyAD)
- [Dynamic page selection with useStoreMap](https://share.effector.dev/AvWnrFXy)
- [Update on scroll with `guard`](https://share.effector.dev/avjCFH22)
- [Night theme switcher component](https://share.effector.dev/4MU8H3YW)
- [Computed bounce menu animation](https://share.effector.dev/ZXEtGBBq)
- [Values history](https://share.effector.dev/NsPi84mV)
- [Read default state from backend](https://share.effector.dev/hA3WTBIT)
- [Requests cache](https://share.effector.dev/jvE7r0By)
- [Watch last two store state values](https://share.effector.dev/LRVsYhIc)
- [Stores from react context](https://codesandbox.io/s/pensive-euler-i4qs5) Codesandbox
- [Basic todolist example](https://codesandbox.io/s/vmx6wxww43) Codesandbox
- [RealWorld app](https://github.com/mg901/react-effector-realworld-example-app) ([RealWorld apps](https://github.com/gothinkster/realworld))
- [Recent users projects](https://github.com/effector/effector/network/dependents)

## API

### Event

Event is an intention to change state.

```js
import {createEvent} from 'effector'
const send = createEvent() // unnamed event
const onMessage = createEvent('message') // named event

const socket = new WebSocket('wss://echo.websocket.org')
socket.onmessage = msg => onMessage(msg)
socket.onopen = () => send('{"text": "hello"}')

const onMessageParse = onMessage.map(msg => JSON.parse(msg.data))

onMessageParse.watch(data => {
  console.log('Message from server ', data)
})

send.watch(data => {
  socket.send(data)
})
```

[Run example](https://share.effector.dev/8rZm1G6k)

### Effect

**Effect** is a container for async function.
It can be safely used in place of the original async function.

```js
import {createEffect} from 'effector'

const fetchUserReposFx = createEffect(async ({name}) => {
  const url = `https://api.github.com/users/${name}/repos`
  const req = await fetch(url)
  return req.json()
})

// subscribe to pending store status
fetchUserReposFx.pending.watch(pending => {
  console.log(pending) // false
})

// subscribe to handler resolve
fetchUserReposFx.done.watch(({params, result}) => {
  console.log(params) // {name: 'zerobias'}
  console.log(result) // resolved value
})

// subscribe to handler reject or throw error
fetchUserReposFx.fail.watch(({params, error}) => {
  console.error(params) // {name: 'zerobias'}
  console.error(error) // rejected value
})

// subscribe to both cases
fetchUserReposFx.finally.watch(data => {
  if (data.status === 'done') {
    const {params, result} = data
    console.log(params) // {name: 'zerobias'}
    console.log(result) // resolved value
  } else {
    const {params, error} = data
    console.error(params) // {name: 'zerobias'}
    console.error(error) // rejected value
  }
})

// you can replace handler anytime
fetchUserReposFx.use(requestMock)

// calling effect will return a promise
const result = await fetchUserReposFx({name: 'zerobias'})
```

[Run example](https://share.effector.dev/iMJILHbh)

### Store

**Store** is an object that holds the state tree. There can be multiple stores.

```js
// `getUsers` - is an effect
// `addUser` - is an event
const users = createStore([{ name: Joe }])
  // subscribe store reducers to events
  .on(getUsers.done, (oldState, payload) => payload)
  .on(addUser, (oldState, payload) => [...oldState, payload]))

// subscribe to store updates
users.watch(state => console.log(state)) // `.watch` for a store is triggered immediately: `[{ name: Joe }]`
// `callback` will be triggered each time when `.on` handler returns the new state
```

#### Store composition/decomposition

Most profit thing of stores.

Get smaller part of the store:

```js
// `.map` accept state of parent store and return new memoized store. No more reselect ;)
const firstUser = users.map(list => list[0])
firstUser.watch(newState => console.log(`first user name: ${newState.name}`)) // "first user name: Joe"

addUser({name: Joseph}) // `firstUser` is not updated
getUsers() // after promise resolve `firstUser` is updated and call all watchers (subscribers)
```

Compose stores:

```js
import {createStore, combine} from 'effector'

const a = createStore(1)
const b = createStore('b')

const c = combine({a, b})

c.watch(console.log)
// => {a: 1, b: "b"}
```

See [`combine`](http://effector.now.sh/api/effector/combine) in docs

[Run example](https://share.effector.dev/MuLF8xGB)

### Domain

**Domain** is a namespace for your events, stores and effects.
Domain can subscribe to event, effect, store or nested domain creation with **onCreateEvent**, **onCreateStore**, **onCreateEffect**, **onCreateDomain(to handle nested domains)** methods.

```js
import {createDomain} from 'effector'
const mainPage = createDomain('main page')
mainPage.onCreateEvent(event => {
  console.log('new event: ', event.getType())
})
mainPage.onCreateStore(store => {
  console.log('new store: ', store.getState())
})
const mount = mainPage.createEvent('mount')
// => new event: main page/mount

const pageStore = mainPage.createStore(0)
// => new store: 0
```

See [`Domain`](http://effector.now.sh/api/effector/domain) in docs

[Run example](https://share.effector.dev/PgwRuYja)

> See also [worker-rpc](https://github.com/effector/effector/tree/master/examples/worker-rpc) example, which uses shared domain for effects

### Learn more

- [Core concepts](https://effector.now.sh/en/introduction/core-concepts)
- [API docs](https://effector.now.sh/en/api/effector)
- [Usage with TypeScript](https://effector.now.sh/en/recipes/usage-with-typescript)
- [Glossary](https://effector.now.sh/en/glossary)
- [Changelog](https://changelog.effector.dev)

![Effector Diagram](./diagram.png)

## Support us

More articles about effector at patreon
<a href="https://www.patreon.com/zero_bias/overview"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png"/></a>

## Tested with browserstack

[![Tested with browserstack](https://raw.githubusercontent.com/effector/effector/master/website/media/Browserstack-logo.svg?sanitize=true)](https://BrowserStack.com)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://zerobias.net"><img src="https://avatars0.githubusercontent.com/u/15912112?v=4" width="100px;" alt=""/><br /><sub><b>Dmitry</b></sub></a><br /><a href="#question-zerobias" title="Answering Questions">💬</a> <a href="https://github.com/effector/effector/commits?author=zerobias" title="Code">💻</a> <a href="https://github.com/effector/effector/commits?author=zerobias" title="Documentation">📖</a> <a href="#example-zerobias" title="Examples">💡</a> <a href="#ideas-zerobias" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-zerobias" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/effector/effector/commits?author=zerobias" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/goodmind"><img src="https://avatars2.githubusercontent.com/u/3275424?v=4" width="100px;" alt=""/><br /><sub><b>andretshurotshka</b></sub></a><br /><a href="#question-goodmind" title="Answering Questions">💬</a> <a href="https://github.com/effector/effector/commits?author=goodmind" title="Code">💻</a> <a href="https://github.com/effector/effector/commits?author=goodmind" title="Documentation">📖</a> <a href="#platform-goodmind" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/effector/effector/commits?author=goodmind" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://sergeysova.com"><img src="https://avatars0.githubusercontent.com/u/5620073?v=4" width="100px;" alt=""/><br /><sub><b>Sergey Sova</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=sergeysova" title="Documentation">📖</a> <a href="#example-sergeysova" title="Examples">💡</a> <a href="https://github.com/effector/effector/commits?author=sergeysova" title="Code">💻</a> <a href="https://github.com/effector/effector/commits?author=sergeysova" title="Tests">⚠️</a> <a href="#ideas-sergeysova" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://t.me/artalar"><img src="https://avatars0.githubusercontent.com/u/27290320?v=4" width="100px;" alt=""/><br /><sub><b>Arutyunyan Artyom</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=artalar" title="Documentation">📖</a> <a href="#example-artalar" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/Komar0ff"><img src="https://avatars2.githubusercontent.com/u/10588170?v=4" width="100px;" alt=""/><br /><sub><b>Ilya</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=Komar0ff" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/dpr-dev"><img src="https://avatars3.githubusercontent.com/u/23157659?v=4" width="100px;" alt=""/><br /><sub><b>Arthur Irgashev</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=dpr-dev" title="Documentation">📖</a> <a href="https://github.com/effector/effector/commits?author=dpr-dev" title="Code">💻</a> <a href="#example-dpr-dev" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/hexagon141"><img src="https://avatars0.githubusercontent.com/u/15704394?v=4" width="100px;" alt=""/><br /><sub><b>Igor Ryzhov</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=hexagon141" title="Documentation">📖</a> <a href="https://github.com/effector/effector/commits?author=hexagon141" title="Code">💻</a> <a href="#example-hexagon141" title="Examples">💡</a></td>
  </tr>
  <tr>
    <td align="center"><img src="https://avatars1.githubusercontent.com/u/22044607?v=4" width="100px;" alt=""/><br /><sub><b>Egor Guscha</b></sub><br /><a href="https://github.com/effector/effector/commits?author=egorguscha" title="Documentation">📖</a></td>
    <td align="center"><img src="https://avatars0.githubusercontent.com/u/47696795?v=4" width="100px;" alt=""/><br /><sub><b>bakugod</b></sub><br /><a href="https://github.com/effector/effector/commits?author=bakugod" title="Documentation">📖</a> <a href="#example-bakugod" title="Examples">💡</a></td>
    <td align="center"><img src="https://avatars0.githubusercontent.com/u/29141708?v=4" width="100px;" alt=""/><br /><sub><b>Ruslan</b></sub><br /><a href="https://github.com/effector/effector/commits?author=doasync" title="Documentation">📖</a> <a href="https://github.com/effector/effector/commits?author=doasync" title="Code">💻</a> <a href="#ideas-doasync" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/effector/effector/commits?author=doasync" title="Tests">⚠️</a></td>
    <td align="center"><img src="https://avatars2.githubusercontent.com/u/7874664?v=4" width="100px;" alt=""/><br /><sub><b>Maxim Alyoshin</b></sub><br /><a href="https://github.com/effector/effector/commits?author=mg901" title="Documentation">📖</a></td>
    <td align="center"><img src="https://avatars0.githubusercontent.com/u/25362218?v=4" width="100px;" alt=""/><br /><sub><b>Andrey Gopienko</b></sub><br /><a href="https://github.com/effector/effector/commits?author=tehSLy" title="Documentation">📖</a></td>
    <td align="center"><img src="https://avatars2.githubusercontent.com/u/13759065?v=4" width="100px;" alt=""/><br /><sub><b>Vadim Ivanov</b></sub><br /><a href="https://github.com/effector/effector/commits?author=ivanov-v" title="Documentation">📖</a></td>
    <td align="center"><img src="https://avatars3.githubusercontent.com/u/14825383?v=4" width="100px;" alt=""/><br /><sub><b>Aleksandr Anokhin</b></sub><br /><a href="https://github.com/effector/effector/commits?author=sanohin" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><img src="https://avatars2.githubusercontent.com/u/4208480?v=4" width="100px;" alt=""/><br /><sub><b>Anton Kosykh</b></sub><br /><a href="https://github.com/effector/effector/commits?author=Kelin2025" title="Code">💻</a></td>
    <td align="center"><img src="https://avatars0.githubusercontent.com/u/1109562?v=4" width="100px;" alt=""/><br /><sub><b>Konstantin Lebedev</b></sub><br /><a href="#example-RubaXa" title="Examples">💡</a></td>
    <td align="center"><img src="https://avatars3.githubusercontent.com/u/1121997?v=4" width="100px;" alt=""/><br /><sub><b>Pavel Tereschenko</b></sub><br /><a href="https://github.com/effector/effector/commits?author=bigslycat" title="Code">💻</a></td>
    <td align="center"><img src="https://avatars2.githubusercontent.com/u/29819102?v=4" width="100px;" alt=""/><br /><sub><b>Satya Rohith</b></sub><br /><a href="https://github.com/effector/effector/commits?author=satyarohith" title="Documentation">📖</a></td>
    <td align="center"><img src="https://avatars1.githubusercontent.com/u/13378944?v=4" width="100px;" alt=""/><br /><sub><b>Vladislav Melnikov</b></sub><br /><a href="https://github.com/effector/effector/commits?author=vladmelnikov" title="Code">💻</a></td>
    <td align="center"><img src="https://avatars3.githubusercontent.com/u/15311091?v=4" width="100px;" alt=""/><br /><sub><b>Grigory Zaripov</b></sub><br /><a href="https://github.com/effector/effector/commits?author=gzaripov" title="Code">💻</a></td>
    <td align="center"><img src="https://avatars1.githubusercontent.com/u/37388187?v=4" width="100px;" alt=""/><br /><sub><b>Marina Miyaoka</b></sub><br /><a href="https://github.com/effector/effector/commits?author=miyaokamarina" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><img src="https://avatars2.githubusercontent.com/u/35740512?v=4" width="100px;" alt=""/><br /><sub><b>Evgeny Zakharov</b></sub><br /><a href="https://github.com/effector/effector/commits?author=risenforces" title="Documentation">📖</a></td>
    <td align="center"><a href="http://bloadvenro.ru"><img src="https://avatars1.githubusercontent.com/u/11679418?v=4" width="100px;" alt=""/><br /><sub><b>Viktor</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=bloadvenro" title="Code">💻</a> <a href="https://github.com/effector/effector/commits?author=bloadvenro" title="Documentation">📖</a> <a href="https://github.com/effector/effector/commits?author=bloadvenro" title="Tests">⚠️</a> <a href="#ideas-bloadvenro" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/abliarsar"><img src="https://avatars3.githubusercontent.com/u/9501504?v=4" width="100px;" alt=""/><br /><sub><b>Ivan Savichev</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=abliarsar" title="Code">💻</a> <a href="#ideas-abliarsar" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://vk.com/dimensi"><img src="https://avatars0.githubusercontent.com/u/11390039?v=4" width="100px;" alt=""/><br /><sub><b>Nikita Nafranets</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=dimensi" title="Documentation">📖</a> <a href="#example-dimensi" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/Tauka"><img src="https://avatars3.githubusercontent.com/u/15087247?v=4" width="100px;" alt=""/><br /><sub><b>Tauyekel Kunzhol</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=Tauka" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Laiff"><img src="https://avatars0.githubusercontent.com/u/575885?v=4" width="100px;" alt=""/><br /><sub><b>Andrew Laiff</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=Laiff" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/ilajosmanov"><img src="https://avatars3.githubusercontent.com/u/18512404?v=4" width="100px;" alt=""/><br /><sub><b>Illia Osmanov</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=ilajosmanov" title="Code">💻</a> <a href="#ideas-ilajosmanov" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/YanLobat"><img src="https://avatars3.githubusercontent.com/u/5307423?v=4" width="100px;" alt=""/><br /><sub><b>Yan</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=YanLobat" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/egaris"><img src="https://avatars2.githubusercontent.com/u/5036934?v=4" width="100px;" alt=""/><br /><sub><b>Egor Aristov</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=egaris" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Sozonov"><img src="https://avatars2.githubusercontent.com/u/1931637?v=4" width="100px;" alt=""/><br /><sub><b>Sozonov</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=Sozonov" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Fl0pZz"><img src="https://avatars2.githubusercontent.com/u/9510124?v=4" width="100px;" alt=""/><br /><sub><b>Rafael Fakhreev</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=Fl0pZz" title="Code">💻</a> <a href="#ideas-Fl0pZz" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/effector/effector/commits?author=Fl0pZz" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/yumauri"><img src="https://avatars0.githubusercontent.com/u/6583994?v=4" width="100px;" alt=""/><br /><sub><b>Victor</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=yumauri" title="Code">💻</a> <a href="#ideas-yumauri" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/effector/effector/commits?author=yumauri" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/zarabotaet"><img src="https://avatars0.githubusercontent.com/u/15930980?v=4" width="100px;" alt=""/><br /><sub><b>Dmitrij Shuleshov</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=zarabotaet" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/kobzarvs"><img src="https://avatars3.githubusercontent.com/u/1615093?v=4" width="100px;" alt=""/><br /><sub><b>Valeriy Kobzar</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=kobzarvs" title="Code">💻</a> <a href="#infra-kobzarvs" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-kobzarvs" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Spoki4"><img src="https://avatars3.githubusercontent.com/u/2562688?v=4" width="100px;" alt=""/><br /><sub><b>Ivan</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=Spoki4" title="Code">💻</a> <a href="https://github.com/effector/effector/commits?author=Spoki4" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/oas89"><img src="https://avatars1.githubusercontent.com/u/5285065?v=4" width="100px;" alt=""/><br /><sub><b>Aleksandr Osipov</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=oas89" title="Documentation">📖</a> <a href="https://github.com/effector/effector/commits?author=oas89" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/popuguytheparrot"><img src="https://avatars1.githubusercontent.com/u/19804652?v=4" width="100px;" alt=""/><br /><sub><b>popuguy</b></sub></a><br /><a href="https://github.com/effector/effector/commits?author=popuguytheparrot" title="Documentation">📖</a> <a href="#infra-popuguytheparrot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-popuguytheparrot" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT](LICENSE)
