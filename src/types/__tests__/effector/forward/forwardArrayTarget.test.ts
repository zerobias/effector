/* eslint-disable no-unused-vars */
import {createStore, createEvent, forward, combine} from 'effector'
const typecheck = '{global}'

/** used as valid source type */
type AN = {a: number}
/** used as invalid source type */
type AS = {a: string}
/** used as valid source type */
type AB = {a: number; b: string}
/** used as invalid source type */
type ABN = {a: number; b: number}
const voidt = createEvent()
const anyt = createEvent<any>()
const str = createEvent<string>()
const num = createEvent<number>()
const numStr = createEvent<number | string>()
const strBool = createEvent<string | boolean>()
const numStrBool = createEvent<number | string | boolean>()
const $num = createStore<number>(0)
const $str = createStore<string>('')
const a_num = createEvent<AN>()
const a_str = createEvent<AS>()
const ab = createEvent<AB>()
const abn = createEvent<ABN>()
const l_num = createEvent<[number]>()
const l_str = createEvent<[string]>()
const l_num_str = createEvent<[number, string]>()
const l_num_num = createEvent<[number, number]>()

const fn = {
  noArgs: () => ({a: 2, b: ''}),
  assertFirst: {
    object: {
      solo: ({a}: AS, cl: number) => ({a: cl, b: a}),
      pair: ({a, b}: ABN, cl: number) => ({a: b + cl, b: ''}),
    },
    tuple: {
      solo: ([a]: [string], cl: number) => ({a: cl, b: a}),
      pair: ([a, b]: [number, number], cl: number) => ({a: b + cl, b: ''}),
    },
  },
  assertFirstOnly: {
    object: {
      solo: ({a}: AS) => ({a: 0, b: a}),
      pair: ({b}: ABN) => ({a: b, b: ''}),
    },
    tuple: {
      solo: ([a]: [string]) => ({a: 2, b: a}),
      pair: ([, b]: [number, number]) => ({a: b, b: ''}),
    },
  },
  assertSecond: {
    object: {
      solo: ({a}: AN, cl: string) => ({a, b: cl}),
      pair: ({a}: AB, cl: string) => ({a, b: cl}),
    },
    tuple: {
      solo: ([a]: [number], cl: string) => ({a, b: cl}),
      pair: ([a]: [number, string], cl: string) => ({a, b: cl}),
    },
  },
  typedSrc: {
    object: {
      solo: ({a}: AN) => ({a, b: ''}),
      pair: ({a, b}: AB) => ({a, b}),
    },
    tuple: {
      solo: ([a]: [number]) => ({a, b: ''}),
      pair: ([a, b]: [number, string]) => ({a, b}),
    },
  },
  typedSrcClock: {
    object: {
      solo: ({a}: AN, cl: number) => ({a: a + cl, b: ''}),
      pair: ({a, b}: AB, cl: number) => ({a: a + cl, b}),
    },
    tuple: {
      solo: ([a]: [number], cl: number) => ({a: a + cl, b: ''}),
      pair: ([a, b]: [number, string], cl: number) => ({a: a + cl, b}),
    },
  },
}

describe('basic cases', () => {
  describe('no fn', () => {
    test('no fn (should pass)', () => {
      //prettier-ignore
      {
        forward({clock:num,target:[anyt]          })
        forward({clock:num,target:[anyt]          })
        forward({clock:num,target:[num]           })
        forward({clock:num,target:[num]           })
        forward({clock:str,target:[anyt]          })
        forward({clock:str,target:[anyt,voidt]    })
        forward({clock:str,target:[numStr]        })
        forward({clock:str,target:[voidt]         })
        forward({clock:num,target:[voidt]         })
        forward({clock:num,target:[numStr,anyt]   })
        forward({clock:str,target:[numStr,anyt]   })
        forward({clock:str,target:[numStr,voidt]  })
        forward({clock:str,target:[strBool,numStr]})
        forward({clock:str,target:[strBool,anyt]  })
        forward({clock:str,target:[strBool,voidt] })
        forward({clock:str,target:[anyt,numStr]   })
        forward({clock:str,target:[anyt,voidt]    })
        forward({clock:str,target:[str,numStr]    })
        forward({clock:str,target:[str,anyt]      })
        forward({clock:str,target:[str,voidt]     })
        forward({clock:str,target:[voidt,numStr]  })
        forward({clock:str,target:[voidt,strBool] })
        forward({clock:str,target:[voidt,anyt]    })
        forward({clock:str,target:[numStr]        })
        forward({clock:str,target:[strBool]       })
        forward({clock:str,target:[anyt]          })
        forward({clock:str,target:[str]           })
        forward({clock:str,target:[voidt]         })
        forward({clock:num,target:[voidt]         })
        forward({clock:str,target:[str,anyt]      })
        forward({clock:str,target:[strBool,voidt] })
        forward({clock:num,target:[numStr,anyt]   })
        forward({clock:str,target:[str,numStr]    })
        forward({clock:str,target:[numStr,anyt]   })
        forward({clock:str,target:[strBool]       })
        forward({clock:str,target:[str]           })
        forward({clock:str,target:[str,voidt]     })
        forward({clock:str,target:[strBool,numStr]})
        forward({clock:num,target:[num,anyt]      })
        forward({clock:num,target:[num,anyt]      })
        forward({clock:str,target:[numStr,voidt]  })
        forward({clock:num,target:[voidt,numStr]  })
        forward({clock:num,target:[voidt,anyt]    })
        forward({clock:str,target:[voidt,numStr]  })
        forward({clock:num,target:[voidt,anyt]    })
        forward({clock:num,target:[num,numStr]    })
        forward({clock:num,target:[voidt,numStr]  })
        forward({clock:num,target:[num,voidt]     })
        forward({clock:num,target:[num,voidt]     })
        forward({clock:num,target:[numStr]        })
        forward({clock:str,target:[anyt,numStr]   })
        forward({clock:str,target:[voidt,strBool] })
        forward({clock:num,target:[anyt,numStr]   })
        forward({clock:num,target:[num,numStr]    })
        forward({clock:str,target:[voidt,anyt]    })
        forward({clock:num,target:[anyt,voidt]    })
        forward({clock:str,target:[strBool,anyt]  })
        forward({clock:num,target:[anyt,voidt]    })
        forward({clock:num,target:[numStr]        })
        forward({clock:num,target:[numStr,voidt]  })
        forward({clock:num,target:[numStr,voidt]  })
        forward({clock:num,target:[anyt,numStr]   })
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('no fn (should fail)', () => {
      //prettier-ignore
      {
        //@ts-expect-error
        forward({clock:str,target:[num,strBool]   })
        //@ts-expect-error
        forward({clock:str,target:[num]           })
        //@ts-expect-error
        forward({clock:str,target:[num]           })
        //@ts-expect-error
        forward({clock:num,target:[str]           })
        //@ts-expect-error
        forward({clock:str,target:[num,voidt]     })
        //@ts-expect-error
        forward({clock:str,target:[num,numStr]    })
        //@ts-expect-error
        forward({clock:str,target:[num,strBool]   })
        //@ts-expect-error
        forward({clock:str,target:[num,anyt]      })
        //@ts-expect-error
        forward({clock:str,target:[num,str]       })
        //@ts-expect-error
        forward({clock:str,target:[num,voidt]     })
        //@ts-expect-error
        forward({clock:num,target:[str]           })
        //@ts-expect-error
        forward({clock:str,target:[num,str]       })
        //@ts-expect-error
        forward({clock:str,target:[num,anyt]      })
        //@ts-expect-error
        forward({clock:num,target:[num,str]       })
        //@ts-expect-error
        forward({clock:num,target:[num,str]       })
        //@ts-expect-error
        forward({clock:str,target:[num,numStr]    })
        //@ts-expect-error
        forward({clock:num,target:[str,voidt]     })
        //@ts-expect-error
        forward({clock:num,target:[strBool,voidt] })
        //@ts-expect-error
        forward({clock:num,target:[num,strBool]   })
        //@ts-expect-error
        forward({clock:num,target:[str,numStr]    })
        //@ts-expect-error
        forward({clock:num,target:[str,numStr]    })
        //@ts-expect-error
        forward({clock:num,target:[str,voidt]     })
        //@ts-expect-error
        forward({clock:num,target:[strBool]       })
        //@ts-expect-error
        forward({clock:num,target:[strBool]       })
        //@ts-expect-error
        forward({clock:num,target:[num,strBool]   })
        //@ts-expect-error
        forward({clock:num,target:[strBool,anyt]  })
        //@ts-expect-error
        forward({clock:num,target:[strBool,voidt] })
        //@ts-expect-error
        forward({clock:num,target:[voidt,strBool] })
        //@ts-expect-error
        forward({clock:num,target:[strBool,anyt]  })
        //@ts-expect-error
        forward({clock:num,target:[strBool,numStr]})
        //@ts-expect-error
        forward({clock:num,target:[str,anyt]      })
        //@ts-expect-error
        forward({clock:num,target:[str,anyt]      })
        //@ts-expect-error
        forward({clock:num,target:[voidt,strBool] })
        //@ts-expect-error
        forward({clock:num,target:[strBool,numStr]})
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        "
      `)
    })
  })
})
describe('combinable', () => {
  describe('clock:wide', () => {
    test('clock:wide (should pass)', () => {
      //prettier-ignore
      {
        forward({clock:combine({a:$num,b:$str}), target:[a_num]    })
        forward({clock:combine({a:$num,b:$str}), target:[a_num,ab] })
        forward({clock:combine({a:$num,b:$str}), target:[ab]       })
        forward({clock:combine({a:$num,b:$str}),target:[a_num]    })
        forward({clock:combine({a:$num,b:$str}),target:[a_num,ab] })
        forward({clock:combine({a:$num,b:$str}),target:[ab]       })
        forward({clock:[$num,$str]    , target:numStrBool})
        forward({clock:[$num,$str]    , target:numStr})
        forward({clock:[$num,$str]    , target:[numStrBool]})
        forward({clock:[$num,$str]    , target:[numStr]})
        forward({clock:[$num,$str]    , target:[numStr, numStrBool]})
        forward({clock:[$num,$str]    , target:[numStrBool, numStr, voidt]})
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('clock:wide (should fail)', () => {
      //prettier-ignore
      {
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[abn]                })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[a_num,a_str]        })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[abn,a_str]          })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[a_str]              })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[a_num,abn]          })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[abn,ab]             })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[ab,a_str]           })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}), target:[a_str,ab]           })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[abn]                })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[abn,a_str]          })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[ab,a_str]           })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[a_str]              })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[a_num,abn]          })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[abn,ab]             })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[a_str,ab]           })
        //@ts-expect-error
        forward({clock:combine({a:$num,b:$str}),target:[a_num,a_str]        })
        //@ts-expect-error
        forward({clock:[$num,$str]    , target:[strBool]              })
        //@ts-expect-error
        forward({clock:[$num,$str]    , target:[numStr, strBool]        })
        //@ts-expect-error
        forward({clock:[$num,$str]    , target:[numStr, strBool, voidt]})
        //@ts-expect-error
        forward({clock:[$num,$str]    , target:[anyt, numStr, strBool, voidt]})
        //@ts-expect-error
        forward({clock:[$num,$str]    , target:[numStr,numStrBool,strBool]    })
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        "
      `)
    })
  })
  describe('clock:same', () => {
    test('clock:same (should pass)', () => {
      //prettier-ignore
      {
        forward({clock:combine({a:$num}), target:[a_num]})
        forward({clock:combine({a:$num}),target:[a_num]})
        forward({clock:[$num]  , target:[numStr]})
        forward({clock:[$num]  ,target:[num]})
        forward({clock:[$num]  ,target:[num, numStr, numStrBool, voidt, anyt]})
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('clock:same (should fail)', () => {
      //prettier-ignore
      {
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[a_str]              })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[abn]                })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[ab]                 })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[a_num,a_str]        })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[a_num,abn]          })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[a_num,ab]           })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[a_str,ab]           })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[abn,a_str]          })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[abn,ab]             })
        //@ts-expect-error
        forward({clock:combine({a:$num}), target:[ab,a_str]           })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[a_str]              })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[a_num,abn]          })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[abn,ab]             })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[abn,a_str]          })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[abn]                })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[ab,a_str]           })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[a_num,a_str]        })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[a_num,ab]           })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[ab]                 })
        //@ts-expect-error
        forward({clock:combine({a:$num}),target:[a_str,ab]           })
        //@ts-expect-error
        forward({clock:[$num]  , target:[strBool]              })
        //@ts-expect-error
        forward({clock:$num  , target:strBool          })
        //@ts-expect-error
        forward({clock:[$num]  , target:[numStr, strBool]          })
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, string]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<[number, number]>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<[string]>' is not assignable to type '\\"incompatible unit in target\\"'.
        "
      `)
    })
  })
})
// from/to
describe('basic cases', () => {
  describe('no fn', () => {
    test('no fn (should pass)', () => {
      //prettier-ignore
      {
        forward({from:num,to:[anyt]          })
        forward({from:num,to:[anyt]          })
        forward({from:num,to:[num]           })
        forward({from:num,to:[num]           })
        forward({from:str,to:[anyt]          })
        forward({from:str,to:[anyt,voidt]    })
        forward({from:str,to:[numStr]        })
        forward({from:str,to:[voidt]         })
        forward({from:num,to:[voidt]         })
        forward({from:num,to:[numStr,anyt]   })
        forward({from:str,to:[numStr,anyt]   })
        forward({from:str,to:[numStr,voidt]  })
        forward({from:str,to:[strBool,numStr]})
        forward({from:str,to:[strBool,anyt]  })
        forward({from:str,to:[strBool,voidt] })
        forward({from:str,to:[anyt,numStr]   })
        forward({from:str,to:[anyt,voidt]    })
        forward({from:str,to:[str,numStr]    })
        forward({from:str,to:[str,anyt]      })
        forward({from:str,to:[str,voidt]     })
        forward({from:str,to:[voidt,numStr]  })
        forward({from:str,to:[voidt,strBool] })
        forward({from:str,to:[voidt,anyt]    })
        forward({from:str,to:[numStr]        })
        forward({from:str,to:[strBool]       })
        forward({from:str,to:[anyt]          })
        forward({from:str,to:[str]           })
        forward({from:str,to:[voidt]         })
        forward({from:num,to:[voidt]         })
        forward({from:str,to:[str,anyt]      })
        forward({from:str,to:[strBool,voidt] })
        forward({from:num,to:[numStr,anyt]   })
        forward({from:str,to:[str,numStr]    })
        forward({from:str,to:[numStr,anyt]   })
        forward({from:str,to:[strBool]       })
        forward({from:str,to:[str]           })
        forward({from:str,to:[str,voidt]     })
        forward({from:str,to:[strBool,numStr]})
        forward({from:num,to:[num,anyt]      })
        forward({from:num,to:[num,anyt]      })
        forward({from:str,to:[numStr,voidt]  })
        forward({from:num,to:[voidt,numStr]  })
        forward({from:num,to:[voidt,anyt]    })
        forward({from:str,to:[voidt,numStr]  })
        forward({from:num,to:[voidt,anyt]    })
        forward({from:num,to:[num,numStr]    })
        forward({from:num,to:[voidt,numStr]  })
        forward({from:num,to:[num,voidt]     })
        forward({from:num,to:[num,voidt]     })
        forward({from:num,to:[numStr]        })
        forward({from:str,to:[anyt,numStr]   })
        forward({from:str,to:[voidt,strBool] })
        forward({from:num,to:[anyt,numStr]   })
        forward({from:num,to:[num,numStr]    })
        forward({from:str,to:[voidt,anyt]    })
        forward({from:num,to:[anyt,voidt]    })
        forward({from:str,to:[strBool,anyt]  })
        forward({from:num,to:[anyt,voidt]    })
        forward({from:num,to:[numStr]        })
        forward({from:num,to:[numStr,voidt]  })
        forward({from:num,to:[numStr,voidt]  })
        forward({from:num,to:[anyt,numStr]   })
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('no fn (should fail)', () => {
      //prettier-ignore
      {
        //@ts-expect-error
        forward({from:str,to:[num,strBool]   })
        //@ts-expect-error
        forward({from:str,to:[num]           })
        //@ts-expect-error
        forward({from:str,to:[num]           })
        //@ts-expect-error
        forward({from:num,to:[str]           })
        //@ts-expect-error
        forward({from:str,to:[num,voidt]     })
        //@ts-expect-error
        forward({from:str,to:[num,numStr]    })
        //@ts-expect-error
        forward({from:str,to:[num,strBool]   })
        //@ts-expect-error
        forward({from:str,to:[num,anyt]      })
        //@ts-expect-error
        forward({from:str,to:[num,str]       })
        //@ts-expect-error
        forward({from:str,to:[num,voidt]     })
        //@ts-expect-error
        forward({from:num,to:[str]           })
        //@ts-expect-error
        forward({from:str,to:[num,str]       })
        //@ts-expect-error
        forward({from:str,to:[num,anyt]      })
        //@ts-expect-error
        forward({from:num,to:[num,str]       })
        //@ts-expect-error
        forward({from:num,to:[num,str]       })
        //@ts-expect-error
        forward({from:str,to:[num,numStr]    })
        //@ts-expect-error
        forward({from:num,to:[str,voidt]     })
        //@ts-expect-error
        forward({from:num,to:[strBool,voidt] })
        //@ts-expect-error
        forward({from:num,to:[num,strBool]   })
        //@ts-expect-error
        forward({from:num,to:[str,numStr]    })
        //@ts-expect-error
        forward({from:num,to:[str,numStr]    })
        //@ts-expect-error
        forward({from:num,to:[str,voidt]     })
        //@ts-expect-error
        forward({from:num,to:[strBool]       })
        //@ts-expect-error
        forward({from:num,to:[strBool]       })
        //@ts-expect-error
        forward({from:num,to:[num,strBool]   })
        //@ts-expect-error
        forward({from:num,to:[strBool,anyt]  })
        //@ts-expect-error
        forward({from:num,to:[strBool,voidt] })
        //@ts-expect-error
        forward({from:num,to:[voidt,strBool] })
        //@ts-expect-error
        forward({from:num,to:[strBool,anyt]  })
        //@ts-expect-error
        forward({from:num,to:[strBool,numStr]})
        //@ts-expect-error
        forward({from:num,to:[str,anyt]      })
        //@ts-expect-error
        forward({from:num,to:[str,anyt]      })
        //@ts-expect-error
        forward({from:num,to:[voidt,strBool] })
        //@ts-expect-error
        forward({from:num,to:[strBool,numStr]})
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<number>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        "
      `)
    })
  })
})
describe('combinable', () => {
  describe('from:wide', () => {
    test('from:wide (should pass)', () => {
      //prettier-ignore
      {
        forward({from:combine({a:$num,b:$str}), to:[a_num]    })
        forward({from:combine({a:$num,b:$str}), to:[a_num,ab] })
        forward({from:combine({a:$num,b:$str}), to:[ab]       })
        forward({from:combine({a:$num,b:$str}),to:[a_num]    })
        forward({from:combine({a:$num,b:$str}),to:[a_num,ab] })
        forward({from:combine({a:$num,b:$str}),to:[ab]       })
        forward({from:[$num,$str]    , to:numStrBool})
        forward({from:[$num,$str]    , to:numStr})
        forward({from:[$num,$str]    , to:[numStrBool]})
        forward({from:[$num,$str]    , to:[numStr]})
        forward({from:[$num,$str]    , to:[numStr, numStrBool]})
        forward({from:[$num,$str]    , to:[numStrBool, numStr, voidt]})
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('from:wide (should fail)', () => {
      //prettier-ignore
      {
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[abn]                })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[a_num,a_str]        })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[abn,a_str]          })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[a_str]              })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[a_num,abn]          })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[abn,ab]             })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[ab,a_str]           })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}), to:[a_str,ab]           })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[abn]                })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[abn,a_str]          })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[ab,a_str]           })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[a_str]              })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[a_num,abn]          })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[abn,ab]             })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[a_str,ab]           })
        //@ts-expect-error
        forward({from:combine({a:$num,b:$str}),to:[a_num,a_str]        })
        //@ts-expect-error
        forward({from:[$num,$str]    , to:[strBool]              })
        //@ts-expect-error
        forward({from:[$num,$str]    , to:[numStr, strBool]        })
        //@ts-expect-error
        forward({from:[$num,$str]    , to:[numStr, strBool, voidt]})
        //@ts-expect-error
        forward({from:[$num,$str]    , to:[anyt, numStr, strBool, voidt]})
        //@ts-expect-error
        forward({from:[$num,$str]    , to:[numStr,numStrBool,strBool]    })
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        "
      `)
    })
  })
  describe('from:same', () => {
    test('from:same (should pass)', () => {
      //prettier-ignore
      {
        forward({from:combine({a:$num}), to:[a_num]})
        forward({from:combine({a:$num}),to:[a_num]})
        forward({from:[$num]  , to:[numStr]})
        forward({from:[$num]  ,to:[num]})
        forward({from:[$num]  ,to:[num, numStr, numStrBool, voidt, anyt]})
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        no errors
        "
      `)
    })
    test('from:same (should fail)', () => {
      //prettier-ignore
      {
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[a_str]              })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[abn]                })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[ab]                 })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[a_num,a_str]        })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[a_num,abn]          })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[a_num,ab]           })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[a_str,ab]           })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[abn,a_str]          })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[abn,ab]             })
        //@ts-expect-error
        forward({from:combine({a:$num}), to:[ab,a_str]           })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[a_str]              })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[a_num,abn]          })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[abn,ab]             })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[abn,a_str]          })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[abn]                })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[ab,a_str]           })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[a_num,a_str]        })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[a_num,ab]           })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[ab]                 })
        //@ts-expect-error
        forward({from:combine({a:$num}),to:[a_str,ab]           })
        //@ts-expect-error
        forward({from:[$num]  , to:[strBool]              })
        //@ts-expect-error
        forward({from:$num  , to:strBool          })
        //@ts-expect-error
        forward({from:[$num]  , to:[numStr, strBool]          })
      }
      expect(typecheck).toMatchInlineSnapshot(`
        "
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<ABN>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<AS>' is not assignable to type '\\"incompatible unit in target\\"'.
              Type 'Event<AB>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        No overload matches this call.
          The last overload gave the following error.
            Type 'Event<string | boolean>' is not assignable to type '\\"incompatible unit in target\\"'.
        "
      `)
    })
  })
})
