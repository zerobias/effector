import {
  Store,
  Event,
  is,
  launch,
  createStore,
  createEvent,
  sample,
  merge,
  combine,
} from 'effector'

import type {Scope} from '../effector/unit.h'

import {
  DOMElement,
  ElementDraft,
  MergedBindings,
  NSType,
  PropertyMap,
  StoreOrData,
  DOMProperty,
  StylePropertyMap,
  ListItemType,
  UsingDraft,
  Actor,
  ListType,
  Leaf,
  LeafDataElement,
  LeafDataRoute,
  RouteDraft,
  Template,
  Spawn,
  RecItemDraft,
  LeafDataRecItem,
  RecDraft,
  LeafDataRec,
  BlockDraft,
  BlockItemDraft,
  LeafDataBlock,
  LeafDataBlockItem,
  LeafDataList,
  LeafDataUsing,
  LeafDataListItem,
} from './index.h'
import {beginMark, endMark} from './platform/mark'

import {ElementBlock, TextBlock, UsingBlock, LF} from './relation.h'

import {
  pushOpToQueue,
  forceSetOpValue,
  createOpGroup,
  createOp,
  createAsyncValue,
  stopAsyncValue,
  updateAsyncValue,
  createOpQueue,
} from './plan'

import {
  applyStyle,
  applyStyleVar,
  applyDataAttr,
  applyAttr,
  applyText,
  applyStaticOps,
  escapeTag,
} from './bindings'
import {
  createTemplate,
  spawn,
  currentActor,
  currentTemplate,
  currentLeaf,
} from './template'
import {
  findParentDOMElement,
  findPreviousVisibleSibling,
  findPreviousVisibleSiblingBlock,
} from './search'
import {
  mountChild,
  appendChild,
  onMount as onMountSync,
  mountChildTemplates,
} from './mountChild'
import {remap} from './remap'
import {iterateChildLeafs} from './iterateChildLeafs'
import {unmountLeafTree} from './unmount'
import {assert, assertClosure} from './assert'

const mountFn = {
  using(leaf: Leaf) {
    const data = leaf.data as LeafDataUsing
    const block = data.block
    mountChildTemplates(data.draft, {
      parentBlockFragment: block.child,
      leaf,
    })
  },
  routeItem(leaf: Leaf) {
    const draft = leaf.draft as RouteDraft
    const data = leaf.data as LeafDataRoute
    data.block.child.visible = true
    mountChildTemplates(draft, {
      parentBlockFragment: data.block.child.child,
      leaf,
    })
  },
  block(leaf: Leaf) {
    const draft = leaf.draft as BlockDraft
    const data = leaf.data as LeafDataBlock
    mountChildTemplates(draft, {
      parentBlockFragment: data.block.child,
      leaf,
    })
  },
  blockItem(leaf: Leaf) {
    const draft = leaf.draft as BlockItemDraft
    const data = leaf.data as LeafDataBlockItem
    mountChild({
      parentBlockFragment: data.block.child,
      leaf,
      actor: draft.itemOf,
    })
  },
  rec(leaf: Leaf) {
    const draft = leaf.draft as RecDraft
    const data = leaf.data as LeafDataRec
    mountChildTemplates(draft, {
      parentBlockFragment: data.block.child,
      leaf,
    })
  },
  listItem(leaf: Leaf) {
    const data = leaf.data as LeafDataListItem
    const block = data.block
    block.visible = true
    block.childInitialized = true
    mountChildTemplates(data.listDraft, {
      parentBlockFragment: block.child,
      leaf,
    })
  },
}

export function h(tag: string): void
export function h(tag: string, cb: () => void): void
export function h(
  tag: string,
  spec: {
    fn?: () => void
    attr?: PropertyMap
    data?: PropertyMap
    text?: StoreOrData<DOMProperty> | Array<StoreOrData<DOMProperty>>
    visible?: Store<boolean>
    style?: StylePropertyMap
    styleVar?: PropertyMap
    handler?:
      | {
          config?: {
            passive?: boolean
            capture?: boolean
            prevent?: boolean
            stop?: boolean
          }
          on: Partial<
            {[K in keyof HTMLElementEventMap]: Event<HTMLElementEventMap[K]>}
          >
        }
      | Partial<
          {[K in keyof HTMLElementEventMap]: Event<HTMLElementEventMap[K]>}
        >
  },
): void
export function h(tag: string, opts?: any) {
  let hasCb = false
  let hasOpts = false
  let cb: () => void
  if (typeof opts === 'function') {
    hasCb = true
    cb = opts
  } else {
    if (opts) {
      hasOpts = true
      if (opts.fn) {
        hasCb = true
        cb = opts.fn
      }
      if (opts.ɔ) {
        if (typeof opts.ɔ === 'function') {
          hasCb = true
          cb = opts.ɔ
        } else if (typeof opts.ɔ.fn === 'function') {
          hasCb = true
          cb = opts.ɔ.fn
        }
      }
    }
  }
  assertClosure(currentActor, 'h')
  const env = currentActor.env
  const parentNS = currentActor.namespace
  let ns: NSType = parentNS
  let type = 'html'
  ns = type = parentNS === 'svg' ? 'svg' : 'html'
  if (tag === 'svg') {
    type = 'svg'
    ns = 'svg'
  }
  let node: DOMElement
  if (!currentActor.isBlock) {
    node =
      type === 'svg'
        ? env.document.createElementNS('http://www.w3.org/2000/svg', tag)
        : env.document.createElement(tag)
  }
  //@ts-ignore
  const stencil = node
  const draft: ElementDraft = {
    type: 'element',
    tag,
    attr: [],
    data: [],
    text: [],
    styleProp: [],
    styleVar: [],
    handler: [],
    stencil,
    seq: [],
    staticSeq: [],
    childTemplates: [],
    childCount: 0,
    inParentIndex: -1,
    opsAmount: 1,
    node: [],
  }
  if (parentNS === 'foreignObject') {
    draft.attr.push({
      xmlns: 'http://www.w3.org/1999/xhtml',
    })
    ns = 'html'
  } else if (tag === 'svg') {
    draft.attr.push({
      xmlns: 'http://www.w3.org/2000/svg',
    })
    ns = 'svg'
  } else if (tag === 'foreignObject') {
    ns = 'foreignObject'
  }

  const elementTemplate = createTemplate({
    name: 'element',
    draft,
    isSvgRoot: tag === 'svg',
    namespace: ns,
    fn(_, {mount}) {
      const domElementCreated = createEvent<Leaf>()
      function valueElementMutualSample(value: Store<DOMProperty>) {
        return mutualSample({
          mount: domElementCreated,
          state: value,
          onMount: (value, leaf) => ({leaf, value}),
          onState: (leaf, value) => ({leaf, value}),
        })
      }
      if (hasCb) {
        cb()
      }
      if (hasOpts) {
        spec(opts)
      }
      const merged: MergedBindings = {
        attr: {},
        data: {},
        text: draft.text,
        styleProp: {},
        styleVar: {},
        visible: draft.visible || null,
        handler: draft.handler,
      }
      for (let i = 0; i < draft.attr.length; i++) {
        const map = draft.attr[i]
        for (const key in map) {
          if (key === 'xlink:href') {
            merged.attr.href = map[key]
          } else {
            merged.attr[key] = map[key]
          }
        }
      }
      for (let i = 0; i < draft.data.length; i++) {
        const map = draft.data[i]
        for (const key in map) {
          merged.data[key] = map[key]
        }
      }
      for (let i = 0; i < draft.styleProp.length; i++) {
        const map = draft.styleProp[i]
        for (const key in map) {
          if (key.startsWith('--')) {
            merged.styleVar[key.slice(2)] = map[key]!
          } else {
            merged.styleProp[key] = map[key]
          }
        }
      }
      for (let i = 0; i < draft.styleVar.length; i++) {
        const map = draft.styleVar[i]
        for (const key in map) {
          merged.styleVar[key] = map[key]
        }
      }
      if (merged.visible) {
        draft.seq.push({
          type: 'visible',
          value: merged.visible,
        })
      }
      for (const attr in merged.attr) {
        const value = merged.attr[attr]
        if (is.unit(value)) {
          draft.seq.push({
            type: 'attr',
            field: attr,
            value,
          })
        } else {
          draft.staticSeq.push({
            type: 'attr',
            field: attr,
            value,
          })
        }
      }
      for (const data in merged.data) {
        const value = merged.data[data]
        if (is.unit(value)) {
          draft.seq.push({
            type: 'data',
            field: data,
            value,
          })
        } else {
          draft.staticSeq.push({
            type: 'data',
            field: data,
            value,
          })
        }
      }
      for (const propName in merged.styleProp) {
        const value = merged.styleProp[propName]
        if (is.unit(value)) {
          draft.seq.push({
            type: 'style',
            field: propName,
            value,
          })
        } else {
          draft.staticSeq.push({
            type: 'style',
            field: propName,
            value: value!,
          })
        }
      }
      for (const field in merged.styleVar) {
        const value = merged.styleVar[field]
        if (is.unit(value)) {
          draft.seq.push({
            type: 'styleVar',
            field,
            value,
          })
        } else {
          draft.staticSeq.push({
            type: 'styleVar',
            field,
            value,
          })
        }
      }
      for (let i = 0; i < merged.text.length; i++) {
        const item = merged.text[i]
        if (item.value === null) continue
        if (is.unit(item.value)) {
          draft.seq.push({
            type: 'dynamicText',
            value: item.value,
            childIndex: item.index,
          })
          //@ts-ignore
          const ref = item.value.stateRef
          const templ: Template = currentTemplate!
          if (!templ.plain.includes(ref) && !templ.closure.includes(ref)) {
            templ.closure.push(ref)
          }
        } else {
          draft.seq.push({
            type: 'staticText',
            value: String(item.value),
            childIndex: item.index,
          })
        }
      }
      for (let i = 0; i < merged.handler.length; i++) {
        const item = merged.handler[i]
        for (const key in item.map) {
          draft.seq.push({
            type: 'handler',
            for: key,
            //@ts-ignore
            handler: item.map[key],
            options: item.options,
            domConfig: item.domConfig,
          })
        }
      }
      if (merged.visible) {
        const {onMount, onState} = mutualSample({
          mount,
          state: merged.visible,
          onMount: (value, leaf) => ({
            leaf,
            value,
            hydration: leaf.hydration,
          }),
          onState: (leaf, value) => ({leaf, value, hydration: false}),
        })
        onMount.watch(({leaf, value, hydration}) => {
          const leafData = leaf.data as LeafDataElement
          const visibleOp = leafData.ops.visible
          const parentBlock = leafData.block
          if (hydration) {
            forceSetOpValue(value, visibleOp)
            if (value) {
              const visibleSibling = findPreviousVisibleSibling(parentBlock)
              let foundElement: DOMElement
              if (visibleSibling) {
                foundElement = visibleSibling.nextSibling! as DOMElement
              } else {
                foundElement = findParentDOMElement(parentBlock)!
                  .firstChild! as DOMElement
              }
              if (foundElement.nodeName === '#text') {
                const emptyText = foundElement
                foundElement = foundElement.nextSibling! as DOMElement
                emptyText.remove()
              }
              parentBlock.value = foundElement
              parentBlock.visible = true
            }
          }
          const svgRoot = elementTemplate.isSvgRoot
            ? (parentBlock.value as any)
            : null
          mountChildTemplates(draft, {
            parentBlockFragment: parentBlock.child,
            leaf,
            node: parentBlock.value,
            svgRoot,
          })
          if (value) {
            if (leafData.needToCallNode) {
              leafData.needToCallNode = false
              launch({
                target: onMountSync,
                params: {
                  element: leafData.block.value,
                  fns: draft.node,
                },
                page: leaf.spawn,
                defer: true,
                //@ts-ignore
                forkPage: leaf.forkPage,
              })
            }
          }
          launch({
            target: domElementCreated,
            params: leaf,
            defer: true,
            page: leaf.spawn,
            //@ts-ignore
            forkPage: leaf.forkPage,
          })
        })
        merge([onState, onMount]).watch(({leaf, value, hydration}) => {
          const leafData = leaf.data as LeafDataElement
          const visibleOp = leafData.ops.visible
          if (!hydration) {
            pushOpToQueue(value, visibleOp)
          }
        })
      }
      if (stencil) applyStaticOps(stencil, draft.staticSeq)
      for (let i = 0; i < draft.seq.length; i++) {
        const item = draft.seq[i]
        switch (item.type) {
          case 'visible':
            break
          case 'attr': {
            const {field} = item
            const immediate =
              field === 'value' ||
              field === 'checked' ||
              field === 'min' ||
              field === 'max'
            const {onMount, onState} = valueElementMutualSample(item.value)
            if (immediate) {
              merge([onState, onMount]).watch(({leaf, value}) => {
                applyAttr(readElement(leaf), field, value)
              })
            } else {
              const opID = draft.opsAmount++
              onMount.watch(({value, leaf}) => {
                const element = readElement(leaf)
                const op = createOp({
                  value,
                  priority: 'props',
                  runOp(value) {
                    applyAttr(element, field, value)
                  },
                  group: leaf.ops.group,
                })
                leaf.ops.group.ops[opID] = op
                applyAttr(element, field, value)
              })
              onState.watch(({value, leaf}) => {
                pushOpToQueue(value, leaf.ops.group.ops[opID])
              })
            }
            break
          }
          case 'data': {
            const {field} = item
            const {onMount, onState} = valueElementMutualSample(item.value)
            const opID = draft.opsAmount++
            onMount.watch(({value, leaf}) => {
              const element = readElement(leaf)
              const op = createOp({
                value,
                priority: 'props',
                runOp(value) {
                  applyDataAttr(element, field, value)
                },
                group: leaf.ops.group,
              })
              leaf.ops.group.ops[opID] = op
              applyDataAttr(element, field, value)
            })
            onState.watch(({value, leaf}) => {
              pushOpToQueue(value, leaf.ops.group.ops[opID])
            })
            break
          }
          case 'style': {
            const opID = draft.opsAmount++
            const {field} = item
            const {onMount, onState} = valueElementMutualSample(item.value)

            onMount.watch(({value, leaf}) => {
              const element = readElement(leaf)
              const op = createOp({
                value,
                priority: 'props',
                runOp(value) {
                  applyStyle(element, field, value)
                },
                group: leaf.ops.group,
              })
              leaf.ops.group.ops[opID] = op
              applyStyle(element, field, value)
            })
            onState.watch(({value, leaf}) => {
              pushOpToQueue(value, leaf.ops.group.ops[opID])
            })
            break
          }
          case 'styleVar': {
            const {field} = item
            const {onMount, onState} = valueElementMutualSample(item.value)
            const opID = draft.opsAmount++
            onMount.watch(({value, leaf}) => {
              const element = readElement(leaf)
              const op = createOp({
                value,
                priority: 'props',
                runOp(value) {
                  applyStyleVar(element, field, value)
                },
                group: leaf.ops.group,
              })
              leaf.ops.group.ops[opID] = op
              applyStyleVar(element, field, value)
            })
            onState.watch(({value, leaf}) => {
              pushOpToQueue(value, leaf.ops.group.ops[opID])
            })
            break
          }
          case 'staticText': {
            domElementCreated.watch(leaf => {
              installTextNode(leaf, item.value, item.childIndex)
            })
            break
          }
          case 'dynamicText': {
            const opID = draft.opsAmount++
            const textAndElement = sample({
              source: item.value,
              clock: domElementCreated,
              fn: (text, leaf) => ({value: String(text), leaf}),
              greedy: true,
            })
            textAndElement.watch(({value, leaf}) => {
              const op = createOp({
                value,
                priority: 'props',
                runOp(value) {
                  applyText(textBlock.value, value)
                },
                group: leaf.ops.group,
              })
              leaf.ops.group.ops[opID] = op
              const textBlock = installTextNode(leaf, value, item.childIndex)
            })
            sample({
              source: domElementCreated,
              clock: item.value,
              fn: (leaf, text) => ({leaf, text}),
              greedy: true,
            }).watch(({leaf, text}) => {
              pushOpToQueue(text, leaf.ops.group.ops[opID])
            })
            break
          }
          case 'handler': {
            const handlerTemplate: Template | null =
              //@ts-ignore
              item.handler.graphite.meta.nativeTemplate || null
            domElementCreated.watch(leaf => {
              let page: Spawn | null = null
              if (handlerTemplate) {
                let handlerPageFound = false
                let currentPage: Spawn | null = leaf.spawn
                while (!handlerPageFound && currentPage) {
                  if (currentPage.template === handlerTemplate) {
                    handlerPageFound = true
                    page = currentPage
                  } else {
                    currentPage = currentPage.parent
                  }
                }
              } else {
                page = leaf.spawn
              }
              readElement(leaf).addEventListener(
                item.for,
                value => {
                  if (item.options.prevent) value.preventDefault()
                  if (item.options.stop) value.stopPropagation()
                  launch({
                    target: item.handler,
                    params: value,
                    page,
                    //@ts-ignore
                    forkPage: leaf.forkPage,
                  })
                },
                item.domConfig,
              )
            })
            break
          }
        }
      }
      mount.watch(leaf => {
        const leafData = leaf.data as LeafDataElement

        if (!draft.visible) {
          const visibleOp = leafData.ops.visible
          const parentBlock = leafData.block
          if (leaf.hydration) {
            forceSetOpValue(true, visibleOp)
            const visibleSibling = findPreviousVisibleSibling(parentBlock)
            let foundElement: DOMElement
            if (visibleSibling) {
              foundElement = visibleSibling.nextSibling! as DOMElement
            } else {
              foundElement = findParentDOMElement(parentBlock)!
                .firstChild! as DOMElement
            }
            if (foundElement.nodeName === '#text') {
              const emptyText = foundElement
              foundElement = foundElement.nextSibling! as DOMElement
              emptyText.remove()
            }
            parentBlock.value = foundElement
            parentBlock.visible = true
          }
          const svgRoot = elementTemplate.isSvgRoot
            ? (parentBlock.value as any)
            : null
          mountChildTemplates(draft, {
            parentBlockFragment: parentBlock.child,
            leaf,
            node: parentBlock.value,
            svgRoot,
          })
          launch({
            target: domElementCreated,
            params: leaf,
            defer: true,
            page: leaf.spawn,
            //@ts-ignore
            forkPage: leaf.forkPage,
          })
          if (leaf.hydration) {
            if (leafData.needToCallNode) {
              leafData.needToCallNode = false
              launch({
                target: onMountSync,
                params: {
                  element: leafData.block.value,
                  fns: draft.node,
                },
                page: leaf.spawn,
                defer: true,
                //@ts-ignore
                forkPage: leaf.forkPage,
              })
            }
          } else {
            pushOpToQueue(true, visibleOp)
          }
        }
      })
    },
    env,
  })
  setInParentIndex(elementTemplate)
  function readElement(leaf: Leaf) {
    return (leaf.data as LeafDataElement).block.value
  }
  function installTextNode(leaf: Leaf, value: string, childIndex: number) {
    const parentBlock = (leaf.data as any).block as ElementBlock
    const parentBlockFragment = parentBlock.child
    const textBlock: TextBlock = {
      type: 'text',
      parent: parentBlockFragment,
      visible: false,
      index: childIndex,
      value: null as any,
    }
    parentBlockFragment.child[childIndex] = textBlock
    if (leaf.hydration) {
      const siblingBlock = findPreviousVisibleSiblingBlock(textBlock)
      if (siblingBlock) {
        switch (siblingBlock.type) {
          case 'text': {
            textBlock.value = leaf.env.document.createTextNode(value)
            siblingBlock.value.after(textBlock.value)
            break
          }
          case 'element': {
            textBlock.value = siblingBlock.value.nextSibling! as Text
            applyText(textBlock.value, value)
            break
          }
        }
      } else {
        const parentElement = findParentDOMElement(textBlock)
        textBlock.value = parentElement!.firstChild! as Text
        applyText(textBlock.value, value)
      }
      textBlock.visible = true
    } else {
      textBlock.value = leaf.env.document.createTextNode(value)
      appendChild(textBlock)
    }
    return textBlock
  }
}

function getDefaultEnv(): {
  document: Document
} {
  if (typeof document !== 'undefined') return {document}
  throw Error('your environment has no document')
}
export function using(node: DOMElement, cb: () => any): void
export function using(
  node: DOMElement,
  opts: {
    fn: () => void
    hydrate?: boolean
    env?: {
      document: Document
    }
    onComplete?: () => void
    onRoot?: (config: {template: Actor<{mount: any}>; leaf: Leaf}) => void
    scope?: Scope
  },
): void
export function using(node: DOMElement, opts: any): void {
  let cb: () => any
  let onComplete: (() => void) | undefined
  let env: {
    document: Document
  }
  let hydrate: boolean
  let onRoot:
    | ((config: {template: Actor<{mount: any}>; leaf: Leaf}) => void)
    | undefined
  let scope: Scope
  if (typeof opts === 'function') {
    cb = opts
    env = getDefaultEnv()
    hydrate = false
  } else if (opts) {
    cb = opts.fn
    env = opts.env ? opts.env : getDefaultEnv()
    hydrate = opts.hydrate
    onComplete = opts.onComplete
    onRoot = opts.onRoot
    scope = opts.scope
  } else throw Error('using() second argument is missing')
  assert(node, 'using() first argument is missing')
  const namespaceURI = node.namespaceURI
  const tag = node.tagName.toLowerCase()
  const ns: NSType =
    namespaceURI === 'http://www.w3.org/2000/svg'
      ? 'svg'
      : tag === 'foreignobject'
      ? 'foreignObject'
      : 'html'
  const draft: UsingDraft = {
    type: 'using',
    childTemplates: [],
    childCount: 0,
    inParentIndex: -1,
  }

  const usingTemplate = createTemplate({
    name: 'using',
    draft,
    isSvgRoot: tag === 'svg',
    namespace: ns,
    fn(_, {mount}) {
      cb()
      mount.watch(mountFn.using)
    },
    env,
  })

  const usingBlock: UsingBlock = {
    type: 'using',
    child: {
      type: 'fragment',
      parent: null as any,
      child: [],
    },
    value: node,
  }
  usingBlock.child.parent = usingBlock

  const queue = createOpQueue({onComplete})
  const rootLeaf = spawn(usingTemplate, {
    parentLeaf: currentLeaf || null,
    mountNode: node,
    svgRoot: usingTemplate.isSvgRoot
      ? (node as any)
      : currentLeaf
      ? currentLeaf.svgRoot
      : null,
    leafData: {
      type: 'using',
      draft,
      element: node,
      block: usingBlock,
    },
    opGroup: createOpGroup(queue),
    domSubtree: createOpGroup(queue),
    hydration: hydrate,
    forkPage: scope!,
    env,
  })

  if (onRoot) {
    onRoot({
      template: usingTemplate,
      leaf: rootLeaf,
    })
  }
  if (queue.onDrain && !queue.rafID) {
    const rs = queue.onDrain
    queue.onDrain = null
    rs()
  }
}

export function node(cb: (node: DOMElement) => (() => void) | void) {
  assertClosure(currentActor, 'node')
  const draft = currentActor.draft
  switch (draft.type) {
    case 'list':
    case 'listItem':
    case 'using':
    case 'route':
    case 'rec':
    case 'recItem':
    case 'block':
    case 'blockItem':
      console.error('node() hook supported only in h() nodes')
      return
  }
  draft.node.push(cb)
}

export function spec(config: {
  attr?: PropertyMap
  data?: PropertyMap
  text?: StoreOrData<DOMProperty> | Array<StoreOrData<DOMProperty>>
  style?: StylePropertyMap
  styleVar?: PropertyMap
  visible?: Store<boolean>
  handler?:
    | {
        config?: {
          passive?: boolean
          capture?: boolean
          prevent?: boolean
          stop?: boolean
        }
        on: Partial<
          {[K in keyof HTMLElementEventMap]: Event<HTMLElementEventMap[K]>}
        >
      }
    | Partial<{[K in keyof HTMLElementEventMap]: Event<HTMLElementEventMap[K]>}>
  ɔ?: any
}) {
  assertClosure(currentActor, 'spec')
  const draft = currentActor.draft
  switch (draft.type) {
    case 'list':
      if (config.visible) draft.itemVisible = config.visible
      return
    case 'listItem':
    case 'using':
    case 'route':
    case 'rec':
    case 'recItem':
    case 'block':
    case 'blockItem':
      return
  }
  if (config.attr) draft.attr.push(config.attr)
  if (config.data) draft.data.push(config.data)
  if ('text' in config) {
    const text = config.text
    const firstIndex = draft.childCount
    if (Array.isArray(text)) {
      draft.text.push(
        ...text.map((value, i) => ({
          index: i + firstIndex,
          value,
        })),
      )
      draft.childCount += text.length
    } else {
      draft.text.push({
        index: firstIndex,
        value: text!,
      })
      draft.childCount += 1
    }
  }
  if (config.style) {
    const escaped = {} as StylePropertyMap
    for (const field in config.style) {
      //@ts-ignore
      escaped[escapeTag(field)] = config.style[field]
    }
    draft.styleProp.push(escaped)
  }
  if (config.styleVar) draft.styleVar.push(config.styleVar)
  if (config.visible) draft.visible = config.visible
  if (config.handler) {
    const handlerDef = config.handler as any
    if (typeof handlerDef.on === 'object') {
      handler(handlerDef.config || {}, handlerDef.on)
    } else {
      handler(handlerDef)
    }
  }
  if (config.ɔ) {
    spec(config.ɔ)
  }
}

export function handler(
  map: Partial<
    {[K in keyof HTMLElementEventMap]: Event<HTMLElementEventMap[K]>}
  >,
): void
export function handler(
  options: {
    passive?: boolean
    capture?: boolean
    prevent?: boolean
    stop?: boolean
  },
  map: Partial<
    {[K in keyof HTMLElementEventMap]: Event<HTMLElementEventMap[K]>}
  >,
): void
export function handler(options: any, map?: any) {
  if (!currentActor) return
  const draft = currentActor.draft
  assert(
    draft.type === 'element',
    `"handler" extension can be used only with element nodes, got "${draft.type}"`,
  )
  if (map === undefined) {
    map = options
    options = {}
  }
  for (const key in map) {
    assert(is.unit(map[key]), `handler for "${key}" should be event`)
  }
  const {
    passive = false,
    capture = false,
    prevent = false,
    stop = false,
  } = options
  draft.handler.push({
    options: {
      prevent,
      stop,
    },
    domConfig: {
      passive: prevent ? false : passive,
      capture,
    },
    map,
  })
}

export function variant<T, K extends keyof T>({
  source,
  cases,
  key,
}: {
  source: Store<T>
  key: K
  cases: T[K] extends string
    ? Record<T[K], (config: {store: Store<T>}) => void>
    : {
        [caseName: string]: (config: {store: Store<T>}) => void
        __: (config: {store: Store<T>}) => void
      }
}) {
  assertClosure(currentActor, 'variant')
  assert(is.unit(source), 'variant({source}) should be unit')
  let keyReader: (value: any) => any

  if (typeof key === 'function') keyReader = key
  else if (key == null) keyReader = (value: any) => String(value)
  else keyReader = (value: any) => String(value[key])

  let defaultCase = false

  for (const caseName in cases) {
    if (caseName === '__') {
      defaultCase = true
      continue
    }
    route({
      source,
      visible: value => keyReader(value) === caseName,
      fn: cases[caseName],
    })
  }
  if (defaultCase) {
    const nonDefaultCases = Object.keys(cases)
    route({
      source,
      visible: value => !nonDefaultCases.includes(keyReader(value)),
      fn: (cases as any).__,
    })
  }
}

export function route<T>(config: {
  source: Store<T>
  visible: (value: T) => boolean
  fn: (config: {store: Store<T>}) => void
}): void
export function route<T, S extends T>(config: {
  source: Store<T>
  visible: (value: T) => value is S
  fn: (config: {store: Store<S>}) => void
}): void
export function route<T>(config: {
  source: Store<T>
  visible: Store<boolean>
  fn: (config: {store: Store<T>}) => void
}): void
export function route<T>({
  source,
  visible,
  fn,
}: {
  source: Store<T>
  visible: Store<boolean> | ((value: T) => boolean)
  fn: (config: {store: Store<T>}) => void
}) {
  assertClosure(currentActor, 'route')
  const draft: RouteDraft = {
    type: 'route',
    childTemplates: [],
    childCount: 0,
    inParentIndex: -1,
  }
  const {env, namespace} = currentActor
  const routeTemplate = createTemplate({
    name: 'route',
    isSvgRoot: false,
    namespace,
    env,
    draft,
    fn(_, {mount}) {
      let state: Store<{
        value: T
        visible: boolean
      }>
      if (is.store(visible)) {
        state = combine({value: source, visible})
      } else {
        const visibleFn = visible as (value: T) => boolean
        state = source.map(value => ({
          value,
          visible: visibleFn(value),
        }))
      }
      const childDraft: RouteDraft = {
        type: 'route',
        childTemplates: [],
        childCount: 0,
        inParentIndex: -1,
      }
      const routeItemTemplate = createTemplate({
        name: 'route item',
        isSvgRoot: false,
        namespace,
        env,
        draft: childDraft,
        state: {store: null},
        fn({store}, {mount}) {
          const itemUpdater = createEvent<any>()
          store.on(itemUpdater, (_, upd) => upd)
          fn({store})
          const onValueUpdate = sample({
            source: mount,
            clock: state,
            fn: (leaf, {visible, value}) => ({
              leaf,
              visible,
              value,
            }),
            greedy: true,
          })
          mount.watch(mountFn.routeItem)
          onValueUpdate.watch(({leaf, visible, value}) => {
            const data = leaf.data as LeafDataRoute
            data.block.child.visible = visible
            if (visible) {
              launch({
                target: itemUpdater,
                params: value,
                defer: true,
                page: leaf.spawn,
                //@ts-ignore
                forkPage: leaf.forkPage,
              })
            }
            changeChildLeafsVisible(visible, leaf)
          })
        },
      })
      setInParentIndex(routeItemTemplate)
      const {onMount, onState: onVisibleChange} = mutualSample({
        mount,
        state,
        onMount: ({visible, value}, leaf) => ({
          leaf,
          visible,
          value,
        }),
        onState: (leaf, {visible, value}) => ({
          leaf,
          visible,
          value,
        }),
      })
      merge([onMount, onVisibleChange]).watch(({leaf, visible, value}) => {
        const data = leaf.data as LeafDataRoute
        data.block.child.visible = visible
        if (visible && !data.initialized) {
          mountChild({
            parentBlockFragment: data.block.child.child,
            leaf,
            actor: routeItemTemplate,
            values: {store: value},
          })
          data.initialized = true
        }
      })
    },
  })
  setInParentIndex(routeTemplate)
}

function changeChildLeafsVisible(visible: boolean, leaf: Leaf) {
  const childLeafIterator = (child: Leaf) => {
    const data = child.data
    switch (data.type) {
      case 'element':
        pushOpToQueue(visible, data.ops.visible)
        break
      case 'route':
      case 'list':
      case 'list item':
        iterateChildLeafs(child, childLeafIterator)
        break
      default:
        console.log('unsupported type', data.type)
    }
  }
  iterateChildLeafs(leaf, childLeafIterator)
}

export function block({
  fn,
  env,
  namespace = 'html',
}: {
  fn: () => void
  env: any
  namespace?: NSType
}): () => void {
  const blockDraft: BlockDraft = {
    type: 'block',
    childTemplates: [],
    childCount: 0,
    inParentIndex: 0,
  }
  const blockTemplate = createTemplate({
    name: 'block',
    isSvgRoot: false,
    namespace,
    env,
    draft: blockDraft,
    isBlock: true,
    fn({}, {mount}) {
      fn()
      mount.watch(mountFn.block)
    },
  })
  return () => {
    assertClosure(currentActor, '(block instance)')
    const blockItemDraft: BlockItemDraft = {
      type: 'blockItem',
      childTemplates: [],
      childCount: 0,
      inParentIndex: -1,
      itemOf: blockTemplate,
    }
    const {env, namespace} = currentActor
    const blockItemTemplate = createTemplate({
      name: 'block item',
      isSvgRoot: false,
      namespace,
      env,
      draft: blockItemDraft,
      fn(_, {mount}) {
        mount.watch(mountFn.blockItem)
      },
    })
    setInParentIndex(blockItemTemplate)
  }
}

export function rec<T>(config: {
  fn(config: {store: Store<T>}): void
}): (opts: {store: Store<T>}) => void
export function rec<T>(
  fn: (config: {store: Store<T>; state?: Store<T>}) => void,
): (opts: {store: Store<T>; state?: Store<T>}) => void
export function rec<T>(
  fnOrConfig:
    | {
        fn(config: {store: Store<T>}): void
      }
    | ((config: {store: Store<T>; state?: Store<T>}) => void),
): (opts: {store: Store<T>; state?: Store<T>}) => void {
  const fn = typeof fnOrConfig === 'function' ? fnOrConfig : fnOrConfig.fn
  const recDraft: RecDraft = {
    type: 'rec',
    childTemplates: [],
    childCount: 0,
    inParentIndex: 0,
  }
  const recTemplate = createTemplate<{
    itemUpdater: any
  }>({
    name: 'rec',
    state: {store: null},
    isSvgRoot: false,
    namespace: null as any,
    env: null as any,
    draft: recDraft,
    defer: true,
    isBlock: true,
    fn({store}, {mount}) {
      fn({store, state: store})
      const itemUpdater = createEvent<any>()
      store.on(itemUpdater, (_, e) => e)
      mount.watch(mountFn.rec)
      return {itemUpdater}
    },
  })
  return ({store, state = store}) => {
    assertClosure(currentActor, '(rec instance)')
    const {env, namespace} = currentActor
    if (recTemplate.deferredInit) recTemplate.deferredInit()

    const recItemDraft: RecItemDraft = {
      type: 'recItem',
      childTemplates: [],
      childCount: 0,
      inParentIndex: -1,
    }
    const recItemTemplate = createTemplate({
      name: 'rec item',
      isSvgRoot: false,
      namespace,
      env,
      draft: recItemDraft,
      fn(_, {mount}) {
        const {onMount, onState} = mutualSample({
          state,
          mount,
          onMount: (state, leaf) => ({state, leaf}),
          onState: (leaf, state) => ({state, leaf}),
        })
        onState.watch(({state, leaf}) => {
          iterateChildLeafs(leaf, child => {
            child.api.itemUpdater(state)
          })
        })
        onMount.watch(({leaf, state}) => {
          const data = leaf.data as LeafDataRecItem
          mountChild({
            parentBlockFragment: data.block.child,
            leaf,
            actor: recTemplate,
            values: {store: state},
          })
        })
      },
    })
    setInParentIndex(recItemTemplate)
  }
}

export function tree<
  T,
  ChildField extends keyof T,
  // KeyField extends keyof T
>(config: {
  source: Store<T[]>
  // key: T[KeyField] extends string ? KeyField : never
  child: T[ChildField] extends T[] ? ChildField : never
  fn: (config: {store: Store<T>; child: () => void}) => void
}): void
export function tree({
  source,
  key,
  child: childField,
  fn,
}: {
  source: Store<any[]>
  key?: string
  child: string
  fn: Function
}) {
  const treeRec = rec<any[]>(({store}) => {
    list({
      source: store,
      key: key!,
      fn({store}) {
        const childList = store.map(value => value[childField] || [])
        fn({
          store,
          child() {
            treeRec({
              store: childList,
            })
          },
        })
      },
    })
  })
  treeRec({
    store: source,
  })
}

export function list<T, K extends keyof T>(config: {
  source: Store<T[]>
  fn: (opts: {store: Store<T>; id: Store<T[K]>}) => void
  key: T[K] extends string | number | symbol ? K : never
}): void
export function list<T>(config: {
  source: Store<T[]>
  fn: (opts: {store: Store<T>; id: Store<number>}) => void
}): void
export function list<T>(
  source: Store<T[]>,
  fn: (opts: {store: Store<T>; id: Store<number>}) => void,
): void
export function list<T>(opts: any, maybeFn?: any) {
  assertClosure(currentActor, 'list')
  if (typeof maybeFn === 'function') {
    if (is.unit(opts)) {
      opts = {source: opts, fn: maybeFn}
    } else {
      opts.fn = maybeFn
    }
  }
  const {fn: cb, key, source, fields = []} = opts
  const getID: (item: T, i: number) => string | number | symbol =
    key !== undefined
      ? typeof key === 'function'
        ? key
        : (item: any, i: number) => item[key]
      : (item, i) => i
  const draft: ListType = {
    type: 'list',
    key: is.store(opts) ? {type: 'index'} : {type: 'key', key: opts.key},
    childTemplates: [],
    childCount: 0,
    inParentIndex: -1,
  }
  const {env, namespace} = currentActor

  const listTemplate = createTemplate({
    name: 'list',
    draft,
    isSvgRoot: false,
    namespace,
    fn(_, {mount}) {
      const listItemTemplate = createTemplate<{
        itemUpdater: any
      }>({
        name: 'list item',
        state: {id: -1, store: null},
        draft,
        isSvgRoot: false,
        namespace,
        fn({id, store}, {mount}) {
          cb({store, key: id, fields: remap(store, fields)})
          const itemUpdater = createEvent<any>()
          store.on(itemUpdater, (_, e) => e)
          if (draft.itemVisible) {
            const {onMount: mountAndVisible, onState: onVisibleChanges} =
              mutualSample({
                mount,
                state: draft.itemVisible,
                onMount: (visible, leaf) => ({visible, leaf}),
                onState: (leaf, visible) => ({visible, leaf}),
              })
            mountAndVisible.watch(({visible, leaf}) => {
              const parentBlock = (leaf.data as any).block as LF
              parentBlock.visible = visible
              parentBlock.childInitialized = visible
              if (visible) {
                mountChildTemplates(draft, {
                  parentBlockFragment: parentBlock.child,
                  leaf,
                })
              }
            })
            onVisibleChanges.watch(({visible, leaf}) => {
              const parentBlock = (leaf.data as any).block as LF
              parentBlock.visible = visible
              if (!parentBlock.childInitialized) {
                if (visible) {
                  parentBlock.childInitialized = true
                  mountChildTemplates(draft, {
                    parentBlockFragment: parentBlock.child,
                    leaf,
                  })
                }
                return
              }
              changeChildLeafsVisible(visible, leaf)
            })
          } else {
            mount.watch(mountFn.listItem)
          }
          return {
            itemUpdater,
          }
        },
        env,
      })
      const updates = createStore<ListItemType[]>([])
      const mappedUpdates = source.map((x: any) => x)
      const mountData = sample({
        source: source as Store<T[]>,
        clock: mount,
        fn: (data, leaf) => {
          return {
            updates: data,
            leaf,
            hydration: leaf.hydration,
          }
        },
        greedy: true,
      })

      const parentNodeUpdateSpawn = sample({
        source: mountData,
        clock: mappedUpdates,
        fn: ({leaf}, updates: T[]) => ({
          updates,
          leaf,
          hydration: false,
        }),
        greedy: true,
      })
      sample({
        source: updates,
        clock: [mountData, parentNodeUpdateSpawn],
        greedy: true,
        fn(records: ListItemType[], {updates: input, leaf, hydration}) {
          const listData = (leaf as any).data as LeafDataList
          const parentBlock = listData.block
          beginMark('list update [' + source.shortName + ']')
          const skipNode: boolean[] = Array(input.length).fill(false)
          const keys = input.map(getID)
          const resultRecords: ListItemType[] = []
          for (let i = 0; i < records.length; i++) {
            const record = records[i]
            const index = keys.indexOf(record.key)
            if (index !== -1) {
              resultRecords.push(record)
              skipNode[index] = true
              updateAsyncValue(input[index], record.asyncValue)
            } else {
              record.active = false
              if (record.instance) {
                unmountLeafTree(record.instance)
              }
              stopAsyncValue(record.asyncValue)
            }
          }
          for (let i = 0; i < input.length; i++) {
            if (skipNode[i]) continue
            const value = input[i]
            const id = keys[i]
            const group = createOpGroup(leaf.ops.group.queue)
            const listItemBlock: LF = {
              type: 'LF',
              parent: parentBlock,
              child: {
                type: 'fragment',
                parent: null as any,
                child: [],
              },
              childInitialized: false,
              visible: false,
              left: null,
              right: null,
            }
            const item: ListItemType = {
              type: 'listItem',
              key: id as any,
              index: id as any,
              active: true,
              leafData: {
                type: 'list item',
                block: listItemBlock,
                listDraft: draft,
              },
              asyncValue: createAsyncValue({
                value,
                group,
                onTerminate(wasActive) {},
                onChange(value) {
                  if (item.instance) {
                    item.instance.api.itemUpdater(value)
                  }
                },
                onInit(value) {
                  if (!item.active) return
                  if (hydration) return
                  item.instance = spawn(listItemTemplate, {
                    values: {
                      id,
                      store: value,
                    },
                    parentLeaf: leaf,
                    mountNode: leaf.mountNode,
                    svgRoot: leaf.svgRoot,
                    leafData: item.leafData,
                    opGroup: group,
                    domSubtree: leaf.ops.domSubtree,
                    hydration,
                    forkPage: leaf.forkPage,
                  })
                },
              }),
            }
            const inParentIndex = resultRecords.length
            resultRecords.push(item)
            const leftSibling =
              inParentIndex > 0
                ? resultRecords[inParentIndex - 1].leafData
                : null

            listItemBlock.child.parent = listItemBlock
            parentBlock.child.push(listItemBlock)
            if (leftSibling) {
              const leftBlock = leftSibling.block
              listItemBlock.left = leftBlock
              const rightBlock = leftBlock.right
              if (rightBlock) {
                rightBlock.left = listItemBlock
                listItemBlock.right = rightBlock
              } else {
                parentBlock.lastChild = listItemBlock
              }
              leftBlock.right = listItemBlock
            } else {
              parentBlock.lastChild = listItemBlock
            }
            if (hydration) {
              item.instance = spawn(listItemTemplate, {
                values: {
                  id,
                  store: value,
                },
                parentLeaf: leaf,
                mountNode: leaf.mountNode,
                svgRoot: leaf.svgRoot,
                leafData: item.leafData,
                opGroup: group,
                domSubtree: leaf.ops.domSubtree,
                hydration,
                forkPage: leaf.forkPage,
              })
            }
          }
          endMark('list update [' + source.shortName + ']')
          if (resultRecords.length === 0) {
            parentBlock.lastChild = null
          }
          listData.records = resultRecords
          return resultRecords
        },
        target: updates,
      })
    },
    env,
  })
  setInParentIndex(listTemplate)
}

function setInParentIndex(template: Actor<any>) {
  if (!currentActor) return
  const {draft} = template
  if (draft.type === 'listItem') return
  if (draft.type === 'rec') return
  switch (currentActor.draft.type) {
    case 'element':
    case 'using':
    case 'route':
    case 'list':
    case 'rec':
    case 'recItem':
    case 'block':
    case 'blockItem':
      draft.inParentIndex = currentActor.draft.childCount
      currentActor.draft.childCount += 1
      currentActor.draft.childTemplates.push(template)
      break
    default:
      console.warn(`unexpected currentActor type ${currentActor.draft.type}`)
  }
}

function mutualSample<Mount, State, T>({
  mount,
  state,
  onMount,
  onState,
}: {
  mount: Event<Mount>
  state: Store<State>
  onMount: (state: State, mount: Mount) => T
  onState: (mount: Mount, state: State) => T
}): {
  onMount: Event<T>
  onState: Event<T>
} {
  return {
    onMount: sample({
      source: state,
      clock: mount,
      fn: onMount,
      greedy: true,
    }),
    onState: sample({
      source: mount,
      clock: state,
      fn: onState,
      greedy: true,
    }),
  }
}
