import type {Spawn} from '../forest/index.h'

import type {Cmd, Node, NodeUnit, StateRef} from './index.h'
import {createStateRef, readRef} from './stateRef'
import {getForkPage, getGraph, getParent, getValue} from './getter'
import {
  STORE,
  EFFECT,
  SAMPLER,
  STACK,
  BARRIER,
  VALUE,
  FILTER,
  REG_A,
  MAP,
} from './tag'
import type {Scope} from './unit.h'
import {forEach} from './collection'

/** Names of priority groups */
type PriorityTag = 'child' | 'pure' | 'barrier' | 'sampler' | 'effect'

/**
 * Position in the current branch,
 * including call stack, priority type
 * and index of next step in the executed Node
 */
type Layer = {
  idx: number
  stack: Stack
  type: PriorityTag
  id: number
}

/** Call stack */
export type Stack = {
  value: any
  a: any
  b: any
  parent: Stack | null
  node: Node
  page: Spawn | null
  forkPage?: Scope | null | void
}

/** Queue as linked list or skew heap */
type QueueItem = {
  /** node value */
  v: Layer
  /** left node. always null in queue but used in skew heap */
  l: QueueItem | null
  /** right node */
  r: QueueItem | null
}
type QueueBucket = {
  first: QueueItem | null
  last: QueueItem | null
  size: number
}

/** Dedicated local metadata */
type Local = {
  fail: boolean
  scope: {[key: string]: any}
}

let heap: QueueItem | null = null

const merge = (a: QueueItem | null, b: QueueItem | null): QueueItem | null => {
  if (!a) return b
  if (!b) return a

  let ret
  const isSameType = a.v.type === b.v.type
  if (
    /**
     * if both nodes has the same PriorityType
     * and first node is created after second one
     */
    (isSameType && a.v.id > b.v.id) ||
    /** if first node is "sampler" and second node is "barrier" */
    (!isSameType && a.v.type === SAMPLER)
  ) {
    ret = a
    a = b
    b = ret
  }
  ret = merge(a.r, b)
  a.r = a.l
  a.l = ret

  return a
}

/** queue buckets for each PriorityType */
const queue: QueueBucket[] = []
let ix = 0
while (ix < 5) {
  /**
   * although "sampler" and "barrier" are using heap instead of linked list,
   * their buckets are still useful: they maintains size of heap queue
   */
  queue.push({first: null, last: null, size: 0})
  ix += 1
}

const deleteMin = () => {
  for (let i = 0; i < 5; i++) {
    const list = queue[i]
    if (list.size > 0) {
      /**
       * second bucket is for "barrier" PriorityType (used in combine)
       * and third bucket is for "sampler" PriorityType (used in sample and guard)
       */
      if (i === 2 || i === 3) {
        list.size -= 1
        const value = heap!.v
        heap = merge(heap!.l, heap!.r)
        return value
      }
      if (list.size === 1) {
        list.last = null
      }
      const item = list.first
      list.first = item!.r
      list.size -= 1
      return item!.v
    }
  }
}
const pushFirstHeapItem = (
  type: PriorityTag,
  page: Spawn | null,
  node: Node,
  parent: Stack | null,
  value: any,
  forkPage?: Scope | null | void,
) =>
  pushHeap(
    0,
    {
      a: null,
      b: null,
      node,
      parent,
      value,
      page,
      forkPage,
    },
    type,
  )
const pushHeap = (
  idx: number,
  stack: Stack,
  type: PriorityTag,
  id: number = 0,
) => {
  const priority = getPriority(type)
  const bucket: QueueBucket = queue[priority]
  const item: QueueItem = {
    v: {
      idx,
      stack,
      type,
      id,
    },
    l: null,
    r: null,
  }
  /**
   * second bucket is for "barrier" PriorityType (used in combine)
   * and third bucket is for "sampler" PriorityType (used in sample and guard)
   */
  if (priority === 2 || priority === 3) {
    heap = merge(heap, item)
  } else {
    if (bucket.size === 0) {
      bucket.first = item
    } else {
      bucket.last!.r = item
    }
    bucket.last = item
  }
  bucket.size += 1
}

const getPriority = (t: PriorityTag) => {
  switch (t) {
    case 'child':
      return 0
    case 'pure':
      return 1
    case BARRIER:
      return 2
    case SAMPLER:
      return 3
    case EFFECT:
      return 4
    default:
      return -1
  }
}

const barriers = new Set<string | number>()

let isRoot = true
export let isWatch = false
export let currentPage: Spawn | null = null
export let forkPage: Scope | void | null
export const setForkPage = (newForkPage: Scope) => {
  forkPage = newForkPage
}
export const setCurrentPage = (newPage: Spawn | null) => {
  currentPage = newPage
}

const getPageForRef = (page: Spawn | null, id: string) => {
  if (page) {
    while (page && !page.reg[id]) {
      page = getParent(page)
    }
    if (page) return page
  }
  return null
}
export const getPageRef = (
  page: Spawn | null,
  forkPage: Scope | null | void,
  node: Node | null,
  ref: StateRef,
  isGetState?: boolean,
) => {
  const pageForRef = getPageForRef(page, ref.id)
  if (pageForRef) return pageForRef.reg[ref.id]
  if (forkPage) {
    initRefInScope(forkPage!, ref, isGetState)
    return forkPage.reg[ref.id]
  }
  return node ? node.reg[ref.id] : ref
}

export function launch(config: {
  target: NodeUnit | NodeUnit[]
  params?: any
  defer?: boolean
  page?: Spawn | void
  forkPage?: Scope | void
  stack?: Stack | void
}): void
export function launch(unit: NodeUnit, payload?: any, upsert?: boolean): void
export function launch(unit: any, payload?: any, upsert?: boolean) {
  let pageForLaunch = currentPage
  let stackForLaunch = null
  let forkPageForLaunch = forkPage
  if (unit.target) {
    payload = unit.params
    upsert = unit.defer
    pageForLaunch = 'page' in unit ? unit.page : pageForLaunch
    if (unit[STACK]) stackForLaunch = unit[STACK]
    forkPageForLaunch = getForkPage(unit) || forkPageForLaunch
    unit = unit.target
  }
  if (forkPageForLaunch && forkPage && forkPageForLaunch !== forkPage) {
    forkPage = null
  }
  if (Array.isArray(unit)) {
    for (let i = 0; i < unit.length; i++) {
      pushFirstHeapItem(
        'pure',
        pageForLaunch,
        getGraph(unit[i]),
        stackForLaunch,
        payload[i],
        forkPageForLaunch,
      )
    }
  } else {
    pushFirstHeapItem(
      'pure',
      pageForLaunch,
      getGraph(unit),
      stackForLaunch,
      payload,
      forkPageForLaunch,
    )
  }
  if (upsert && !isRoot) return
  /** main execution code */
  const lastStartedState = {isRoot, currentPage, forkPage, isWatch}
  isRoot = false
  let stop: boolean
  let skip: boolean
  let node: Node
  let value
  let page: Spawn | null
  let reg: Record<string, StateRef>
  kernelLoop: while ((value = deleteMin())) {
    const {idx, stack, type} = value
    node = stack.node
    currentPage = page = stack.page
    forkPage = getForkPage(stack)
    reg = (page ? page : forkPage ? forkPage : node).reg
    const hasPageReg = !!page
    const hasScopeReg = !!forkPage
    const local: Local = {
      fail: false,
      scope: node.scope,
    }
    stop = skip = false
    for (let stepn = idx; stepn < node.seq.length && !stop; stepn++) {
      const step = node.seq[stepn]
      switch (step.type) {
        case BARRIER: {
          const {priority, barrierID} = step.data
          const id = page ? `${page.fullID}_${barrierID}` : barrierID
          if (stepn !== idx || type !== priority) {
            if (!barriers.has(id)) {
              barriers.add(id)
              pushHeap(stepn, stack, priority, barrierID)
            }
            continue kernelLoop
          }
          barriers.delete(id)
          break
        }
        case 'mov': {
          const data = step.data
          let value
          //prettier-ignore
          switch (data.from) {
            case STACK: value = getValue(stack); break
            case REG_A: /** fall-through case */
            case 'b':
              value = stack[data.from]
              break
            case VALUE: value = data.store; break
            case STORE:
              if (!reg[data.store.id]) {
                // if (!page.parent) {
                if (hasPageReg) {
                  const pageForRef = getPageForRef(page, data.store.id)
                  stack.page = page = pageForRef
                  if (pageForRef) {
                    reg = pageForRef.reg
                  } else if (hasScopeReg) {
                    initRefInScope(forkPage!, data.store)
                    reg = forkPage!.reg
                  } else {
                    reg = node.reg
                  }
                } else if (hasScopeReg) {
                  /** StateRef in Scope.reg created only when needed */
                  initRefInScope(forkPage!, data.store)
                } else {
                  // console.error('should not happen')
                  /** StateRef should exists at least in Node itself, but it is not found */
                }
                // }
              }
              // value = getPageRef(page, forkPage, node, data.store.id).current
              value = readRef(reg[data.store.id])
              break
          }
          //prettier-ignore
          switch (data.to) {
            case STACK: stack.value = value; break
            case REG_A: /** fall-through case */
            case 'b':
              stack[data.to] = value
              break
            case STORE:
              getPageRef(page, forkPage, node, data.target).current = value
              break
          }
          break
        }
        case 'check': {
          skip =
            getValue(stack) ===
            (step.data.type === 'defined'
              ? undefined
              : readRef(getPageRef(page, forkPage, node, step.data.store)))
          break
        }
        case FILTER:
          /**
           * handled edge case: if step.fn will throw,
           * tryRun will return null
           * thereby forcing that branch to stop
           */
          skip = !tryRun(local, step.data, stack)
          break
        case 'run':
          /** exec 'compute' step when stepn === idx */
          if (stepn !== idx || type !== EFFECT) {
            pushHeap(stepn, stack, EFFECT)
            continue kernelLoop
          }
        case 'compute':
          isWatch = node.meta.op === 'watch'
          stack.value = tryRun(local, step.data, stack)
          isWatch = lastStartedState.isWatch
          break
      }
      stop = local.fail || skip
    }
    if (!stop) {
      for (let stepn = 0; stepn < node.next.length; stepn++) {
        pushFirstHeapItem(
          'child',
          page,
          node.next[stepn],
          stack,
          getValue(stack),
          getForkPage(stack),
        )
      }
      const forkPage: Scope | null = getForkPage(stack)
      if (forkPage) {
        const meta = node.meta
        if (meta.needFxCounter)
          pushFirstHeapItem('child', page, forkPage.fxCount, stack, 0, forkPage)
        if (meta.storeChange)
          pushFirstHeapItem(
            'child',
            page,
            forkPage.storeChange,
            stack,
            0,
            forkPage,
          )
        const additionalLinks = forkPage.additionalLinks[node.id]
        if (additionalLinks) {
          for (let stepn = 0; stepn < additionalLinks.length; stepn++) {
            pushFirstHeapItem(
              'child',
              page,
              additionalLinks[stepn],
              stack,
              getValue(stack),
              forkPage,
            )
          }
        }
      }
    }
  }
  isRoot = lastStartedState.isRoot
  currentPage = lastStartedState.currentPage
  forkPage = getForkPage(lastStartedState)
}

export const initRefInScope = (
  scope: {
    reg: Record<string, StateRef>
    sidValuesMap: Record<string, any>
    sidIdMap: Record<string, string>
  },
  sourceRef: StateRef,
  isGetState?: boolean,
) => {
  const refsMap = scope.reg
  if (refsMap[sourceRef.id]) return
  const ref: StateRef = {
    id: sourceRef.id,
    current: sourceRef.current,
  }
  if (sourceRef.sid) scope.sidIdMap[sourceRef.sid] = sourceRef.id
  if (sourceRef.sid && sourceRef.sid in scope.sidValuesMap) {
    ref.current = scope.sidValuesMap[sourceRef.sid]
  } else {
    const noInit = !isGetState && sourceRef.noInit
    if (!noInit && sourceRef.before) {
      let isFresh = false
      forEach(sourceRef.before, cmd => {
        switch (cmd.type) {
          case MAP: {
            const from = cmd.from
            if (from || cmd.fn) {
              if (from) initRefInScope(scope, from, isGetState)
              const value = from && refsMap[from.id].current
              ref.current = cmd.fn ? cmd.fn(value) : value
            }
            break
          }
          case 'field': {
            initRefInScope(scope, cmd.from, isGetState)
            const from = refsMap[cmd.from.id]
            if (!isFresh) {
              isFresh = true
              if (Array.isArray(ref.current)) {
                ref.current = [...ref.current]
              } else {
                ref.current = {...ref.current}
              }
            }
            ref.current[cmd.field] = refsMap[from.id].current
            break
          }
          case 'closure':
            break
        }
      })
    }
  }
  refsMap[sourceRef.id] = ref
}

/** try catch for external functions */
const tryRun = (
  local: Local,
  {fn}: Extract<Cmd, {data: {fn: Function}}>['data'],
  stack: Stack,
) => {
  try {
    return fn(getValue(stack), local.scope, stack)
  } catch (err) {
    console.error(err)
    local.fail = true
  }
}
