function outerScope() {
  const createDomain = bar
  const createEvent = bar
  const createStore = foo
  const createEffect = foo
  const fork = foo
  const createNode = foo
  const attach = foo
  const clearNode = foo
  const combine = foo
  const createApi = foo
  const forward = foo
  const guard = foo
  const launch = foo
  const merge = foo
  const restore = foo
  const sample = foo
  const split = foo
  const withRegion = foo
  const hydrate = foo
  const serialize = foo
  const scopeBind = foo
  const allSettled = foo
  function nameClashCheck() {
    const domain = createDomain()
    const event = createEvent()
    const store = createStore(0)
    const effect = createEffect()
    const domainEvent = domain.createEvent()
    const scope = fork(domain)
    const node = createNode()

    const a = attach({effect})
    const b = clearNode(node)
    const c = combine({store})
    const d = createApi(store, {})
    const e = forward({from: event, to: store})
    const f = guard({source: event, filter: Boolean})
    const g = launch(event, null)
    const h = merge([event])
    const i = restore(event, null)
    const j = sample({source: store, clock: event})
    const k = split(event, {})
    const l = withRegion(node, () => {})
    const n = hydrate(scope, {values: {}})
    const o = serialize(scope)
    const p = scopeBind(domainEvent)
    const q = allSettled(domainEvent, {scope})
  }
}

function foo() {}
const bar = () => {}
