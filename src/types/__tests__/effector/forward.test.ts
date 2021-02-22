/* eslint-disable no-unused-vars */
import {createStore, createEvent, createEffect, Event, forward} from 'effector'

const typecheck = '{global}'

test('forward between events', () => {
  const forward_event1 = createEvent<number>()
  const forward_event2 = createEvent<number>()
  forward({
    from: forward_event1,
    to: forward_event2,
  })
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
describe('forward between effects', () => {
  test('start in parallel with the same payload', () => {
    const forward_effect_par1 = createEffect<number, string, string>()
    const forward_effect_par2 = createEffect<number, string, string>()
    forward({
      from: forward_effect_par1,
      to: forward_effect_par2,
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('start sequentially', () => {
    const forward_effect_seq1 = createEffect<number, string, string>()
    const forward_effect_seq2 = createEffect<string, boolean, boolean>()
    forward({
      from: forward_effect_seq1.done.map(({result}) => result),
      to: forward_effect_seq2,
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})

test('forward between stores', () => {
  const e = createStore(0)
  const f = createStore(0)
  forward({from: e, to: f})
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
describe('forward with subtyping', () => {
  const str: Event<string> = createEvent()
  const strOrNum: Event<string | number> = createEvent()
  const num: Event<number> = createEvent()
  it('incompatible (should fail)', () => {
    //@ts-expect-error
    forward({from: str, to: num})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      No overload matches this call.
        The last overload gave the following error.
          Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
      "
    `)
  })
  it('same types (should pass)', () => {
    forward({from: str, to: str})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('more strict -> less strict type (should pass)', () => {
    forward({from: str, to: strOrNum})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('less strict -> more strict type (should fail)', () => {
    //@ts-expect-error
    forward({from: strOrNum, to: str})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      No overload matches this call.
        The last overload gave the following error.
          Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
      "
    `)
  })
  it('generic from (?)', () => {
    forward<string | number>({from: strOrNum, to: str})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('generic to (should fail)', () => {
    //@ts-expect-error
    forward<string>({from: strOrNum, to: str})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      No overload matches this call.
        The last overload gave the following error.
          Type 'Event<string | number>' is not assignable to type 'Clock<string>'.
            Type 'Event<string | number>' is not assignable to type 'Unit<string>'.
              Types of property '__' are incompatible.
                Type 'string | number' is not assignable to type 'string'.
                  Type 'number' is not assignable to type 'string'.
      "
    `)
  })
  it('generics `to` and `from` (should pass)', () => {
    forward<string | number, string>({to: strOrNum, from: str})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('generics `to` and `from` (should fail on providing generics)', () => {
    //@ts-expect-error
    forward<string, string | number>({to: str, from: strOrNum})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'string | number' does not satisfy the constraint 'Clock<string>'.
        Type 'string' is not assignable to type 'Clock<string>'.
      "
    `)
  })
})

describe('any to void support', () => {
  it('should forward from `Unit<*>` to `Unit<void>` (should pass)', () => {
    const from = createEvent<string>()
    const to = createEvent<void>()

    forward({from, to})

    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('should forward from `Unit<*>[]` to `Unit<void>[]` (should pass)', () => {
    const from = createEvent<string>()
    const to = createEvent<void>()

    forward({from: [from], to: [to]})

    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('should forward from `Unit<*>` to `Unit<void>[]` (should pass)', () => {
    const from = createEvent<string>()
    const to = createEvent<void>()

    forward({from, to: [to]})

    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('should forward from `Unit<*>` to array with mixed units (should pass)', () => {
    const from = createEvent<string>()
    const to1 = createEvent<void>()
    const to2 = createEvent<string>()
    forward({from, to: [to1, to2]})

    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  it('should forward from `Unit<*>[]` to `Unit<void>` (should pass)', () => {
    const from = createEvent<string>()
    const to = createEvent<void>()

    forward({from: [from], to})

    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})

test('forward form event.map (should pass)', () => {
  const event1 = createEvent<string>()
  const event2 = createEvent<{value: string}>()

  forward({
    from: event1.map(value => ({value})),
    to: event2,
  })

  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('forward to event.prepend (should pass)', () => {
  const event1 = createEvent<string>()
  const event2 = createEvent<{value: string}>()

  forward({
    from: event1,
    to: event2.prepend(value => ({value})),
  })

  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

test('edge case #1 (should fail)', () => {
  const event1 = createEvent<string>()
  const event2 = createEvent<{value: string}>()

  forward({
    //@ts-expect-error
    from: event1,
    to: event2.map(value => ({value})),
  })

  expect(typecheck).toMatchInlineSnapshot(`
    "
    No overload matches this call.
      The last overload gave the following error.
        Type 'Event<{ value: { value: string; }; }>' is not assignable to type '\\"incompatible unit in target\\"'.
    "
  `)
})

describe('array support', () => {
  describe('forward to array', () => {
    test('valid (should pass)', () => {
      const s1 = createEvent<string>()
      const t1 = createEvent<string>()
      const t2 = createEvent<string>()
      forward({
        from: s1,
        to: [t1, t2],
      })
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    describe('invalid', () => {
      test('type mismatch (should fail)', () => {
        const s1 = createEvent<number>()
        const t1 = createEvent<string>()
        const t2 = createEvent<string>()
        forward({
          //@ts-expect-error
          from: s1,
          to: [t1, t2],
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          No overload matches this call.
            The last overload gave the following error.
              Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
                Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
          No overload matches this call.
            The last overload gave the following error.
              Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
                Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
          "
        `)
      })
      test('array mismatch (should fail)', () => {
        const s1 = createEvent<string>()
        const t1 = createEvent<string>()
        const t2 = createEvent<number>()
        forward({
          //@ts-expect-error
          from: s1,
          //@ts-expect-error
          to: [t1, t2],
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          No overload matches this call.
            The last overload gave the following error.
              Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
          "
        `)
      })
    })
  })
  describe('forward from array', () => {
    test('valid (should pass)', () => {
      const s1 = createEvent<string>()
      const s2 = createEvent<string>()
      const t1 = createEvent<string>()
      forward({
        from: [s1, s2],
        to: t1,
      })
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    describe('invalid', () => {
      test('type mismatch (should fail)', () => {
        const s1 = createEvent<string>()
        const s2 = createEvent<string>()
        const t1 = createEvent<number>()
        forward({
          //@ts-expect-error
          from: [s1, s2],
          to: t1,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          No overload matches this call.
            The last overload gave the following error.
              Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
          "
        `)
      })
      test('array mismatch (should fail)', () => {
        const s1 = createEvent<string>()
        const s2 = createEvent<number>()
        const t1 = createEvent<string>()
        forward({
          //@ts-expect-error
          from: [s1, s2],
          to: t1,
        })
        expect(typecheck).toMatchInlineSnapshot(`
          "
          No overload matches this call.
            The last overload gave the following error.
              Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
          "
        `)
      })
    })
  })
})
