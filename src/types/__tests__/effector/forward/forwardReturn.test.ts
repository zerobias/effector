/* eslint-disable no-unused-vars */
import {createStore, createEvent, forward, Event, Store, Subscription} from 'effector'
const typecheck = '{global}'
type AN = {a: number}
const $num = createStore(0)
const a = createStore({a: 0})
const num = createEvent<number>()
const aNum = createEvent<AN>()
const aT = createStore({a: 0})
const aNumT = createEvent<AN>()
const fn0 = () => ({a: 0})
const fn1 = ({a}: AN) => ({a})
const fn2 = ({a}: AN, c: number) => ({a: a + c})

describe('unit target', () => {
  test('unit target, none clock (should pass)', () => {
    //prettier-ignore
    {
      {const result: Subscription = forward({clock:aNum    , target:aNumT})}
      {const result: Subscription = forward({clock:aNum    , target:aT   })}
      {const result: Subscription = forward({clock:a       , target:aT   })}
      {const result: Subscription = forward({clock:a       , target:aNumT})}
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('unit target, tuple clock (should pass)', () => {
    //prettier-ignore
    {
      {const result: Subscription = forward({clock:[num,$num], target:num   })}
      {const result: Subscription = forward({clock:[num,$num], target:[num]})}
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})
describe('tuple target', () => {
  test('tuple target, none clock (should pass)', () => {
    //prettier-ignore
    {
      {const result: Subscription = forward({clock:aNum    , target:[aNumT,aT]})}
      {const result: Subscription = forward({clock:a       , target:[aNumT,aT]})}
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})

// from/to


describe('unit target', () => {
  test('unit target, none clock (should pass)', () => {
    //prettier-ignore
    {
      {const result: Subscription = forward({from:aNum    , to:aNumT})}
      {const result: Subscription = forward({from:aNum    , to:aT   })}
      {const result: Subscription = forward({from:a       , to:aT   })}
      {const result: Subscription = forward({from:a       , to:aNumT})}
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('unit target, tuple clock (should pass)', () => {
    //prettier-ignore
    {
      {const result: Subscription = forward({from:[num,$num], to:num   })}
      {const result: Subscription = forward({from:[num,$num], to:[num]})}
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})
describe('tuple target', () => {
  test('tuple target, none clock (should pass)', () => {
    //prettier-ignore
    {
      {const result: Subscription = forward({from:aNum    , to:[aNumT,aT]})}
      {const result: Subscription = forward({from:a       , to:[aNumT,aT]})}
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})
