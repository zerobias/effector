---
id: glossary
title: Glossary
---

This is a glossary of the core terms in Effector, along with their type signatures. The types are documented using [TypeScript notation](http://typescriptlang.org).

## Event

_Event_ is a function you can subscribe to. It can be an intention to change the store, indication of something happening in the application, a command to be executed, aggregated analytics trigger and so on.

[Event](./api/effector/Event.md) in api documentation

```typescript
function createEvent<E>(eventName?: string): Event<E>
```

- [createEvent(eventName)](./api/effector/createEvent.md) creates event

```typescript
type Event<Payload> = {
  (payload: Payload): Payload
  watch(watcher: (payload: Payload) => any): Subscription
  map<T>(fn: (payload: Payload) => T): Event<T>
  filter(options: {fn(payload: Payload): boolean}): Event<Payload>
  filterMap<T>(fn: (payload: Payload) => T | void): Event<T>
  prepend<Before>(fn: (params: Before) => Payload): Event<Before>
}
```

- `(payload)` calls `Event` with payload
- [watch(watcher)](./api/effector/Event.md#watchwatcher) listens to the event and calls provided [`watcher`](#watcher)
- [map(fn)](./api/effector/Event.md#mapfn) creates a new event, which will be trigger after the original event was triggered, transforming the payload with provided `fn`
- [filter({fn})](./api/effector/Event.md#filterfn) creates a new event that will tigger only if provided `fn` function returns `true`
- [filterMap(fn)](./api/effector/Event.md#filtermapfn) creates a new event that will be triggered with the result of `fn` applied to the payload, but only if the result is not `undefined`. Use cases: extract value from react's refs; statically typed filters;
- [prepend(fn)](./api/effector/Event.md#prependfn) creates a new event that will trigger the original event with a payload transformed by `fn`

## Store

_Store_ is an object that holds state.
There can be multiple stores.

[Store](./api/effector/Store.md) in api documentation

```typescript
function createStore<State>(defaultState: State): Store<State>
```

- [createStore(defaultState)](./api/effector/createStore.md) creates a new store
- [combine(stores)](./api/effector/combine.md) combines multiple stores into one

```typescript
type Store<State> = {
  on<E>(
    trigger: Event<E> | Effect<E, any, any> | Store<E>,
    reducer: (state: State, payload: E) => State | void,
  ): this
  map<T>(fn: (_: State) => T): Store<T>
  reset(
    ...triggers: Array<Event<any> | Effect<any, any, any> | Store<any>>
  ): this
  watch<E>(watcher: (state: State) => any): Subscription
  updates: Event<State>
  defaultState: State
}
```

- [on(event, reducer)](./api/effector/Store.md#ontrigger-handler) calls [`reducer`](#reducer) on store whenever an event occurs
- [map(fn)](./api/effector/Store.md#mapfn-state-state-laststate-t--t) creates computed store from given one
- [reset(...triggers)](./api/effector/Store.md#resettriggers) resets state to default whenever any of the triggers occur
- [watch(watcher)](./api/effector/Store.md#watchwatcher) registers a [`watcher`](#watcher) to be called with the new state when the store is updated
- [updates](./api/effector/Store.md#updates) is an `event` that triggers when the `store` is updated
- [defaultState](./api/effector/Store.md#defaultstate) initial state of the given store

## Effect

_Effect_ is a container for (possibly async) side effects.
It exposes special events and stores, such as `pending`, `done`, `fail`, `finally`, etc...

It can be safely used in place of the original async function.

It returns promise with result of a function call

The only requirement for the function:

- **Must** have zero or one argument

[Effect](./api/effector/Effect.md) in api documentation

```typescript
function createEffect<Params, Done, Fail>(config?: {
  handler?: (params: Params) => Promise<Done> | Done
}): Effect<Params, Done, Fail>
```

- [createEffect(config)](./api/effector/createEffect.md) creates an effect

```typescript
type Effect<Params, Done, Fail = Error> = {
  (payload: Params): Promise<Done>
  doneData: Event<Done>
  failData: Event<Fail>
  done: Event<{params: Params; result: Done}>
  fail: Event<{params: Params; error: Fail}>
  pending: Store<boolean>
  inFlight: Store<number>
  use: {
    (asyncFunction: (params: Params) => Promise<Done>): this
    getCurrent(): (params: Params) => Promise<Done>
  }
  watch(watcher: (payload: Params) => any): Subscription
}
```

- `(payload)` starts the `Effect` with payload and returns a Promise
- [use(function)](./api/effector/Effect.md#usehandler) replaces the handler in the effect (can be called multiple times)
- [watch(watcher)](./api/effector/Effect.md#watchwatcher) listens to the effect and calls provided [`watcher`](#watcher) when effect starts

## Domain

_Domain_ is a namespace for your events, stores and effects.

Domains are notified when events, stores, effects, or nested domains are created via `onCreateEvent`, `onCreateStore`, `onCreateEffect`, `onCreateDomain` methods. 

It is useful for logging or other side effects.

[Domain](./api/effector/Domain.md) in api documentation

```typescript
function createDomain(domainName?: string): Domain
```

- [createDomain(domainName)](./api/effector/createDomain.md) creates a new domain

```typescript
type Domain = {
  onCreateEvent(hook: (newEvent: Event<unknown>) => any): Subscription
  onCreateEffect(
    hook: (newEffect: Effect<unknown, unknown, unknown>) => any,
  ): Subscription
  onCreateStore(hook: (newStore: Store<unknown>) => any): Subscription
  onCreateDomain(hook: (newDomain: Domain) => any): Subscription
  createEvent<Payload>(name?: string): Event<Payload>
  createEffect<Params, Done, Fail>(name?: string): Effect<Params, Done, Fail>
  createStore<State>(defaultState: State): Store<State>
  createDomain(name?: string): Domain
}
```

- [onCreateEvent(hook)](./api/effector/Domain.md#oncreateeventhook) calls the hook when nested [`Event`](#Event) is created
- [onCreateEffect(hook)](./api/effector/Domain.md#oncreateeffecthook) calls the hook when nested [`Effect`](#Effect) is created
- [onCreateStore(hook)](./api/effector/Domain.md#oncreatestorehook) calls the hook when nested [`Store`](#Store) is created
- [onCreateDomain(hook)](./api/effector/Domain.md#oncreatedomainhook) calls the hook when nested [`Domain`](#Domain) is created
- [createEvent(name)](./api/effector/Domain.md#createeventname) creates a domain-bound [`Event`](#Event)
- [createEffect(name)](./api/effector/Domain.md#createeffectname) creates a domain-bound [`Effect`](#Effect)
- [createStore(defaultState)](./api/effector/Domain.md#createstoredefaultstate) creates a domain-bound [`Store`](#Store)
- [createDomain(name)](./api/effector/Domain.md#createdomainname) creates a nested, domain-bound [`Domain`](#Domain)

## Reducer

```typescript
type StoreReducer<State, E> = (state: State, payload: E) => State | void
type EventOrEffectReducer<T, E> = (state: T, payload: E) => T
```

_Reducer_ calculates a new state given the previous state and an event's payload. For stores, if reducer returns undefined or the same state (===), then there will be no update for a given store.

## Watcher

```typescript
type Watcher<T> = (update: T) => any
```

_Watcher_ is used for **side effects**. Accepted by [event.watch](./api/effector/Event.md#watchwatcher), [store.watch](./api/effector/Store.md#watchwatcher) and [domain.onCreate\* hooks](./api/effector/Domain.md#oncreateeventhook). Return value of a watcher is ignored.

## Subscription

```typescript
type Subscription = {
  (): void
  unsubscribe(): void
}
```

Function, returned by [forward](./api/effector/forward.md), [event.watch](./api/effector/Event.md#watchwatcher), [store.watch](./api/effector/Store.md#watchwatcher) and some others methods. Used for cancelling a subscription. After first call, subscription will do nothing

## Purity

Most of functions in api must not call other events or effects: it's easier to reason about application's data flow when imperative triggers are grouped inside watchers and effect handlers rather than spread across entire business logic.

**Correct**, imperative:

```js
import {createStore, createEvent} from 'effector'

const login = createStore('guest')

const loginSize = login.map(login => login.length)

const submitLoginSize = createEvent()

loginSize.watch(size => {
  submitLoginSize(size)
})
```

[Try it](https://share.effector.dev/D5hV8C70)

[store.map in docs](./api/effector/Store.md#mapfn-state-state-laststate-t--t)

[store.watch in docs](./api/effector/Store.md#watchwatcher)

**Correct**, declarative:

```js
import {createStore, createEvent, forward} from 'effector'

const login = createStore('guest')

const loginSize = login.map(login => login.length)

const submitLoginSize = createEvent()

forward({
  from: loginSize,
  to: submitLoginSize,
})
```

[Try it](https://share.effector.dev/it0gXQLI)

[forward in docs](./api/effector/forward.md)

**Incorrect**:

```js
import {createStore, createEvent, forward} from 'effector'

const submitLoginSize = createEvent()

const login = createStore('guest')
const loginSize = login.map(login => {
  // no! use forward or watch instead
  submitLoginSize(login.length)
  return login.length
})
```
