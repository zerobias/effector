/* eslint-disable no-unused-vars */
import {
  createStore,
  createEvent,
  createEffect,
  createApi,
  createStoreObject,
  restore,
  combine,
  Store,
  Event,
  /*::type*/ CompositeName,
  /*::type*/ kind,
  sample,
} from 'effector'

const typecheck = '{global}'

test('createStore', () => {
  const createStore_store1: Store<number> = createStore(0)
  //@ts-expect-error
  const createStore_store2: Store<string> = createStore(0)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Type 'Store<number>' is not assignable to type 'Store<string>'.
      The types returned by 'getState()' are incompatible between these types.
        Type 'number' is not assignable to type 'string'.
    "
  `)
})
test('createStoreObject', () => {
  const ev = createEvent()
  const a = createStore('')
  const b = createStore(0)
  const c = createStoreObject({a, b})
  c.on(ev, (state, payload) => state)
  c.reset(ev)
  c.off(ev)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
describe('createApi', () => {
  const store: Store<number> = createStore(0)
  test('check1', () => {
    const {event} = createApi(store, {
      event: (n, x: number) => x,
    })
    const createApi_check1: Event<number> = event
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('check2', () => {
    const {event} = createApi(store, {
      event: (n, x: number) => x,
    })
    //@ts-expect-error
    const createApi_check2: Event<string> = event
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'Event<number>' is not assignable to type 'Event<string>'.
      "
    `)
  })
  test('check3', () => {
    const {event} = createApi(store, {
      event: (n, x) => x,
    })
    //@ts-expect-error
    const createApi_check3: Event<string> = event
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'Event<void>' is not assignable to type 'Event<string>'.
        Types of property 'watch' are incompatible.
          Type '(watcher: (payload: void) => any) => Subscription' is not assignable to type '(watcher: (payload: string) => any) => Subscription'.
            Types of parameters 'watcher' and 'watcher' are incompatible.
              Types of parameters 'payload' and 'payload' are incompatible.
                Type 'void' is not assignable to type 'string'.
      "
    `)
  })
})
test('createApi voids', () => {
  const store = createStore(0)
  const api = createApi(store, {
    increment: count => count + 1,
    decrement: count => count - 1,
    double: count => count * 2,
    multiply: (count, mp = 2) => count * mp,
  })

  api.double() // Expected 1 arguments, but got 0.
  api.multiply() // Expected 1 arguments, but got 0.
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('combine', () => {
  const ev = createEvent()
  const a = createStore('')
  const b = createStore(0)
  const c = combine(a, b, (a, b) => a + b)
  c.on(ev, (state, payload) => state)
  c.reset(ev)
  c.off(ev)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('restore', () => {
  const eff = createEffect<{foo: number}, {bar: string}, any>()
  const foo = restore(eff, {bar: ''})
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#(properties)', () => {
  const store = createStore(0)
  const kind1: kind = store.kind
  const shortName: string = store.shortName
  const compositeName: CompositeName = store.compositeName
  const defaultState: number = store.defaultState

  const computed = store.map(() => 'hello')
  const kind2: kind = computed.kind
  const shortName1: string = computed.shortName
  const compositeName1: CompositeName = computed.compositeName
  const defaultState1: string = computed.defaultState
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#getState', () => {
  const store = createStore(0)
  const state: number = store.getState()

  const computed = store.map(() => 'hello')
  const state1: string = computed.getState()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#map', () => {
  const store = createStore(0)
  const computed = store.map(() => 'hello')

  const map_check1: Store<string> = computed
  //@ts-expect-error
  const map_check2: Store<number> = computed
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Type 'Store<string>' is not assignable to type 'Store<number>'.
    "
  `)
})

describe('#reset', () => {
  test('simple case', () => {
    const event = createEvent()
    const store = createStore(0)
    store.reset(event)
    const computed = store.map(() => 'hello')

    computed.reset(event)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('.reset(a, b)', () => {
    const a = createEvent<string>()
    const b = createEvent<number>()
    const store = createStore(0)
    store.reset(a, b)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('.reset([a, b])', () => {
    const a = createEvent<string>()
    const b = createEvent<number>()
    const store = createStore(0)
    store.reset([a, b])
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})

test('#on', () => {
  const event = createEvent()
  const store = createStore(0)
  store.on(event, (state, payload) => state)
  const computed = store.map(() => 'hello')

  computed.on(event, (state, payload) => state)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#on triggers[] (should pass)', () => {
  const event = createEvent<string>()
  const another = createStore('')
  const store = createStore(0)

  store.on([event, another], (state, payload) => state)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#on triggers[] failing', () => {
  const event = createEvent<number>()
  const another = createStore('')
  const store = createStore(0)
  //@ts-expect-error
  store.on([event, another], (state, payload) => state)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    No overload matches this call.
      Overload 1 of 2, '(trigger: Unit<unknown>, reducer: (state: number, payload: unknown) => number | void): Store<number>', gave the following error.
        Argument of type '(Store<string> | Event<number>)[]' is not assignable to parameter of type 'Unit<unknown>'.
          Type '(Store<string> | Event<number>)[]' is missing the following properties from type 'Unit<unknown>': kind, __
      Overload 2 of 2, '(triggers: Unit<string>[], reducer: (state: number, payload: string) => number | void): Store<number>', gave the following error.
        Type 'Event<number>' is not assignable to type 'Unit<string>'.
          Types of property '__' are incompatible.
            Type 'number' is not assignable to type 'string'.
    "
  `)
})

test('.on(sample()) inline (should pass)', () => {
  const store = createStore('111')
  const event = createEvent<any>()

  const anotherStore = createStore('123').on(
    sample({source: store, clock: event}),
    (_, str) => str,
  )
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#off', () => {
  const event = createEvent()
  const store = createStore(0)
  store.off(event)
  const computed = store.map(() => 'hello')

  computed.off(event)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#subscribe', () => {
  const event = createEvent()
  const store = createStore(0)
  // @ts-ignore I don't know type
  store.subscribe(() => {})
  const computed = store.map(() => 'hello')
  // @ts-ignore I don't know type
  computed.subscribe(() => {})
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#watch', () => {
  const event: Event<number> = createEvent()
  const store = createStore(0)
  store.watch((state, payload) => {
    const store_watch_check1: number = state
    const store_watch_check2: typeof undefined = payload
  })
  store.watch(event, (state, payload) => {
    const store_watchBy_check1: number = state
    const store_watchBy_check2: number = payload
  })
  const computed = store.map(() => 'hello')
  computed.watch((state, payload) => {
    const store_watchComputed_check1: string = state
    const store_watchComputed_check2: typeof undefined = payload
  })
  computed.watch(event, (state, payload) => {
    const store_watchByComputed_check1: string = state
    const store_watchByComputed_check2: number = payload
  })
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('#thru', () => {
  const event = createEvent()
  const store = createStore(0)
  const result = store.thru(store => {
    const thru_check1: Store<number> = store
    return thru_check1
  })

  const computed = store.map(() => 'hello')
  const result1 = computed.thru(store => {
    const thru_computed_check1: Store<string> = store
    return thru_computed_check1
  })
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
