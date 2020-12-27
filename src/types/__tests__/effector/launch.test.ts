/* eslint-disable no-unused-vars */
import {step, createNode, createEvent, Event, launch, split} from 'effector'

const typecheck = '{global}'

test('launch(unit, payload)', () => {
  const foo = createEvent<number>()
  const customNode = createNode({
    scope: {max: 100, lastValue: -1, add: 10},
    child: [foo],
    node: [
      step.compute({
        fn: (arg, {add}) => arg + add,
      }),
      step.filter({
        fn: (arg, {max, lastValue}) => arg < max && arg !== lastValue,
      }),
      step.compute({
        fn(arg, scope) {
          scope.lastValue = arg
          return arg
        },
      }),
    ],
  })
  launch(foo, '')
  launch(foo, 0)
  launch(customNode, 100)
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Argument of type 'string' is not assignable to parameter of type 'number'.
    "
  `)
})
test('launch({target: unit})', () => {
  const foo = createEvent<number>()
  const customNode = createNode({
    scope: {max: 100, lastValue: -1, add: 10},
    child: [foo],
    node: [
      step.compute({
        fn: (arg, {add}) => arg + add,
      }),
      step.filter({
        fn: (arg, {max, lastValue}) => arg < max && arg !== lastValue,
      }),
      step.compute({
        fn(arg, scope) {
          scope.lastValue = arg
          return arg
        },
      }),
    ],
  })
  launch({target: foo, params: ''})
  launch({target: foo, params: 0})
  launch({target: customNode, params: 100})
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Type 'string' is not assignable to type 'number'.
    "
  `)
})
