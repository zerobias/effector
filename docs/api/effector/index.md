---
id: effector
slug: /
title: API Reference
---

## Unit creators

- [createEvent](./createEvent.md)
- [createStore](./createStore.md)
- [createEffect](./createEffect.md)
- [createDomain](./createDomain.md)

## Unit definitions

- [Event](./Event.md)
- [Effect](./Effect.md)
- [Store](./Store.md)
- [Domain](./Domain.md)

## Top-Level Exports

- [combine(...stores, f)](./combine.md)
- [attach({effect, mapParams, source?})](./attach.md)
- [createApi(store, api)](./createApi.md)
- [forward({from, to})](./forward.md)
- [merge([eventA, eventB])](./merge.md)
- [sample({source, clock, fn, target})](./sample.md)
- [guard({source, filter, target})](./guard.md)
- [split(event, cases)](./split.md)
- [is](./is.md)
- [fromObservable(observable)](./fromObservable.md)

## Fork api

- [Scope](./Scope.md)
- [fork](./fork.md)
- [serialize](./serialize.md)
- [hydrate](./hydrate.md)
- [allSettled](./allSettled.md)
- [scopeBind](./scopeBind.md)

## Babel plugin

- [effector/babel-plugin](./babel-plugin.md)

## Low level api

- [clearNode](./clearNode.md)
- [withRegion](./withRegion.md)
