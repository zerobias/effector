import Vue, {VueConstructor, ComponentOptions} from 'vue'
import {createEvent, restore, is, combine, Store, withRegion, clearNode, forward, Unit} from 'effector'

export interface EffectorVue extends Vue {
  $watchAsStore: typeof watchAsStore;
  $store: typeof store;
}

export const VueEffector = (
  vue: VueConstructor<EffectorVue>,
  options: Object,
) => {
  vue.mixin(effectorMixin)
  /** @deprecated since v21.1.0 */
  vue.prototype.$watchAsStore = watchAsStore
  /** @deprecated since v21.1.0 */
  vue.prototype.$store = store
}

const effectorMixin: ComponentOptions<Vue> = {
  beforeCreate() {
    let shape = this.$options.effector;

    if (typeof shape === "function") {
      // @ts-ignore
      shape = shape.call(this)
    }
    if (!shape) return;
    if (!this.$options.computed) this.$options.computed = {}

    let obj: { [key: string]: Unit<any> } = {}

    // normalize effector field data
    if (is.store(shape)) {
      obj = { state: shape }
    } else if (typeof shape === 'object') {
      obj = { ...shape }
    } else {
      throw Error('property should be Store')
    }

    // @ts-ignore
    this.__clear = createEvent();

    // @ts-ignore
    withRegion(this.__clear, () => {
      const state: Record<string, Store<any>> = {};
      let nextID = 0;

      for(const key in obj) {
        const v = obj[key];

        if (is.store(v)) {
          state[key] = v;
        } else if (is.event(v) || is.effect(v)) {
          state[key] = restore(v.map(() => ++nextID), null);
        } else {
          throw Error(`Effector property ${key} should be Store or Unit (will be transform to Store<number>)`);
        }
      }

      const store = combine(state)
      for(const key in store.defaultState) {
        // @ts-ignore
        Vue.util.defineReactive(this, key, store.defaultState[key])
      }

      store.watch(value => {
        for (const key in value) {
          // @ts-ignore
          this[key] = value[key]
        }
      })

      for (const key in state) {
        const updated = createEvent();
        forward({ from: updated, to: state[key] });

        // @ts-ignore
        this.$options.computed[key] = {
          // @ts-ignore
          get: () => this[key],
          set: updated
        };
      }
    })
  },

  beforeDestroy() {
    // @ts-ignore
    if (this.__clear) {
      // @ts-ignore
      clearNode(this.__clear);
    }
  }
}

export function createComponent<S>(options: any, store?: S) {
  return Vue.extend(
    Object.assign(
      {},
      options,
      store && {
        effector: () => store
      },
    ),
  )
}

function watchAsStore(
  this: EffectorVue,
  expOrFn: string | Function,
  options: {
    immediate?: boolean
  } = {
    immediate: true,
  },
): Store<{oldValue: any; newValue: any}> {
  const update = createEvent<{oldValue: any; newValue: any}>()
  const store = restore(update, {} as any)
  const watch = () => {
    this.$watch(
      //@ts-ignore
      expOrFn,
      //@ts-ignore
      (newValue, oldValue) => {
        update({oldValue, newValue})
      },
      options,
    )
  }
  //@ts-ignore
  if (this._data) {
    watch()
  } else {
    this.$once('hook:created', watch)
  }

  return store
}

function store<State>(
  this: EffectorVue,
  expOrFn: string | Function,
): Store<State> {
  return this.$watchAsStore(expOrFn).map(({newValue}) => newValue)
}
