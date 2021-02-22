/* eslint-disable no-unused-vars */
import {createStore, createEvent, forward} from 'effector'
const typecheck = '{global}'

type AB = {a: string; b: number}
const voidt = createEvent()
const anyt = createEvent<any>()
const voidStr = createEvent<string | undefined>()
const str = createEvent<string>()
const strClk = createEvent<string>()
const num = createEvent<number>()
const a = createStore('')
const b = createStore(0)
const aTarget = createEvent<{a: string}>()
const abTarget = createEvent<AB>()
const aclock = createEvent<{a: string; clock: any}>()
const abclock = createEvent<{a: string; b: number; clock: any}>()
const fnAbClockString = ({a, b}: AB, clock: string) => ({a, b, clock})
const fnAbClockAny = ({a, b}: AB, clock: any) => ({a, b, clock})
const fnAString = (a: string) => ({a})
const fnAStringClockString = (a: string, clock: string) => ({a, clock})
const fnAStringClockAny = (a: string, clock: any) => ({a, clock})
const fnAb = ({a, b}: AB) => ({a, b})

describe('clock only', () => {
  test('noSource (should pass)', () => {
    //prettier-ignore
    {
      forward({clock:strClk       , target:str})
      forward({clock:anyt         , target:str})
      forward({clock:[strClk]     , target:str})
      forward({clock:[anyt]       , target:str})
      forward({clock:[strClk,anyt], target:str})
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})
test('noClock (should pass)', () => {
  //prettier-ignore
  {
    forward({clock:a    , target:str     })
  }
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test(' (should pass)', () => {
  //prettier-ignore
  {
    forward({clock:[voidt]         , target:voidt     })
    forward({clock:[str]           , target:str     })
    forward({clock:[voidt,str]     , target:voidStr     })
    forward({clock:[str,voidt,anyt], target:voidStr     })
    forward({clock:[voidt,anyt,str], target:voidStr     })
    forward({clock:[anyt,str,voidt], target:voidStr     })
    forward({clock:[voidt,str,anyt], target:voidStr     })
    forward({clock:[str,anyt,voidt], target:voidStr     })
    forward({clock:[anyt,voidt,str], target:voidStr     })
  }
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})

// from/to

describe('clock only', () => {
  test('noSource (should pass)', () => {
    //prettier-ignore
    {
      forward({from:strClk       , to:str})
      forward({from:anyt         , to:str})
      forward({from:[strClk]     , to:str})
      forward({from:[anyt]       , to:str})
      forward({from:[strClk,anyt], to:str})
    }
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})
test('noClock (should pass)', () => {
  //prettier-ignore
  {
    forward({from:a    , to:str     })
  }
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
test(' (should pass)', () => {
  //prettier-ignore
  {
    forward({from:[voidt]         , to:voidt     })
    forward({from:[str]           , to:str     })
    forward({from:[voidt,str]     , to:voidStr     })
    forward({from:[str,voidt,anyt], to:voidStr     })
    forward({from:[voidt,anyt,str], to:voidStr     })
    forward({from:[anyt,str,voidt], to:voidStr     })
    forward({from:[voidt,str,anyt], to:voidStr     })
    forward({from:[str,anyt,voidt], to:voidStr     })
    forward({from:[anyt,voidt,str], to:voidStr     })
  }
  expect(typecheck).toMatchInlineSnapshot(`
    "
    no errors
    "
  `)
})
