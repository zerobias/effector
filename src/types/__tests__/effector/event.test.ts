/* eslint-disable no-unused-vars */
import {
  createEvent,
  Event,
  CompositeName,
  kind,
} from 'effector'

const typecheck = '{global}'

test('createEvent', () => {
  const createEvent_event1: Event<number> = createEvent()
  const createEvent_event2: Event<number> = createEvent('event name [1]')
  const createEvent_event3: Event<number> = createEvent({
    name: 'event name [2]',
  })
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('#(properties)', () => {
  const event = createEvent()
  const kind1: kind = event.kind
  const shortName: string = event.shortName
  const compositeName: CompositeName = event.compositeName

  const computed = event.map(() => 'hello')
  const kind2: kind = computed.kind
  const shortName1: string = computed.shortName
  const compositeName1: CompositeName = computed.compositeName
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('#map', () => {
  const event: Event<number> = createEvent()
  const computed = event.map(() => 'foo')

  //const check1: Event<string> = computed
  //@ts-expect-error
  const event_map_check2: Event<number> = computed
  event(2)
  computed('')
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Type 'Event<string>' is not assignable to type 'Event<number>'.
      Types of property 'watch' are incompatible.
        Type '(watcher: (payload: string) => any) => Subscription' is not assignable to type '(watcher: (payload: number) => any) => Subscription'.
          Types of parameters 'watcher' and 'watcher' are incompatible.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type 'string' is not assignable to type 'number'.
    "
  `)
})
test('#watch', () => {
  const event: Event<number> = createEvent()
  event.watch(state => {
    const check1: number = state
    return state
  })
  event.watch(state => 'foo')
  event.watch(state => {})
  event.watch(state => {})
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
describe('#filterMap', () => {
  test('#filterMap ok', () => {
    const event: Event<number> = createEvent()
    const filteredEvent_ok: Event<string> = event.filterMap(n => {
      if (n % 2) return n.toString()
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('#filterMap incorrect', () => {
    const event: Event<number> = createEvent()
    //@ts-expect-error
    const filteredEvent_error: Event<number> = event.filterMap(n => {
      if (n % 2) return n.toString()
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'Event<string>' is not assignable to type 'Event<number>'.
      "
    `)
  })
})
describe('#prepend', () => {
  test('infer argument type', () => {
    const event = createEvent<string>()
    const prepended = event.prepend((arg: number) => 'foo')
    prepended(1)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('infer void type', () => {
    const event = createEvent<string>()
    const prepended = event.prepend<void>(() => 'foo')
    prepended()
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('infer optional type', () => {
    const event = createEvent<string>()
    const prepended = event.prepend((arg?: number) => 'foo')
    prepended()
    prepended(1)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('infer optional unknown type', () => {
    const event = createEvent<string>()
    const prepended = event.prepend((arg?: unknown) => 'foo')
    prepended()
    prepended(1)
    prepended('')
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('argument type mismatch', () => {
    const event = createEvent<string>()
    const prepended = event.prepend((arg: number) => 'foo')
    //@ts-expect-error
    prepended('')
    expect(typecheck).toMatchInlineSnapshot(`
      "
      No overload matches this call.
        Overload 1 of 2, '(payload: number): number', gave the following error.
          Argument of type 'string' is not assignable to parameter of type 'number'.
        Overload 2 of 2, '(this: \\"Error: Expected 1 argument, but got 0\\", payload?: number | undefined): void', gave the following error.
          The 'this' context of type 'void' is not assignable to method's 'this' of type '\\"Error: Expected 1 argument, but got 0\\"'.
      "
    `)
  })
  test('void type mismatch', () => {
    const event = createEvent<string>()
    const prepended = event.prepend(() => 'foo')
    //@ts-expect-error
    prepended('')
    expect(typecheck).toMatchInlineSnapshot(`
      "
      No overload matches this call.
        Overload 1 of 2, '(payload: void): void', gave the following error.
          Argument of type 'string' is not assignable to parameter of type 'void'.
        Overload 2 of 2, '(this: void, payload?: void | undefined): void', gave the following error.
          Argument of type '\\"\\"' is not assignable to parameter of type 'void | undefined'.
      "
    `)
  })
  test('target event type mismatch', () => {
    const event = createEvent<number>()
    //@ts-expect-error
    const prepended = event.prepend((arg: boolean) => 'foo')
    prepended(true)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Argument of type '(arg: boolean) => string' is not assignable to parameter of type '(_: boolean) => number'.
        Type 'string' is not assignable to type 'number'.
      "
    `)
  })
  test('void target event edge case', () => {
    const event: Event<void> = createEvent()
    const prepended = event.prepend((arg: number) => 'foo') // returns string
    prepended(1)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})
test('void function interop (should pass)', () => {
  const voidFn: () => void = createEvent<void>()
  const voidFn1: () => void = createEvent<undefined>()
  const voidFn2: () => void = createEvent<any>()
  const voidFn3: () => void = createEvent<never>()
  const voidFn4: () => void = createEvent<unknown>()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('call event without params (should pass)', () => {
  const event = createEvent()
  event()
  const event1 = createEvent<undefined>()
  event1()
  const event2 = createEvent<any>()
  event2()
  const event3 = createEvent<unknown>()
  event3()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('call event without params (should fail)', () => {
  const event = createEvent<number>()
  //@ts-expect-error
  event()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    The 'this' context of type 'void' is not assignable to method's 'this' of type '\\"Error: Expected 1 argument, but got 0\\"'.
    "
  `)
})
test('call event without params (never)', () => {
  // Should never be called
  const event = createEvent<never>()
  //@ts-expect-error
  event()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    The 'this' context of type 'void' is not assignable to method's 'this' of type 'never'.
    "
  `)
})
test('assign event to a function (should pass)', () => {
  const fn1: (event: number) => number = createEvent<number>()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('assign event to a function (should fail)', () => {
  //@ts-expect-error
  const fn1: (event: number) => unknown = createEvent<string>()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Type 'Event<string>' is not assignable to type '(event: number) => unknown'.
      Types of parameters 'payload' and 'event' are incompatible.
        Type 'number' is not assignable to type 'string'.
    "
  `)
})
describe('event as function argument', () => {
  test('direct pass', () => {
    function fn(arg: (_: number) => number) {}
    const event = createEvent<string>()
    //@ts-expect-error
    fn(event)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Argument of type 'Event<string>' is not assignable to parameter of type '(_: number) => number'.
        Types of parameters 'payload' and '_' are incompatible.
          Type 'number' is not assignable to type 'string'.
      "
    `)
  })
  test('indirect pass', () => {
    function fn(arg: (_: number) => number) {}
    const event = createEvent<string>()
    //@ts-expect-error
    fn(e => event(e))
    expect(typecheck).toMatchInlineSnapshot(`
      "
      No overload matches this call.
        Overload 1 of 2, '(payload: string): string', gave the following error.
          Argument of type 'number' is not assignable to parameter of type 'string'.
        Overload 2 of 2, '(this: \\"Error: Expected 1 argument, but got 0\\", payload?: string | undefined): void', gave the following error.
          The 'this' context of type 'void' is not assignable to method's 'this' of type '\\"Error: Expected 1 argument, but got 0\\"'.
      "
    `)
  })
})
test('createEvent edge case', () => {
  // Default type is inferred
  const fn: (event: number) => number = createEvent()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test('void function edge case (should fail)', () => {
  // Typed event is assignable to a void function
  const voidFn: () => void = createEvent<number>()
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
