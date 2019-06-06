---
id: gettingStarted
title: Getting Started
---
> Work in progress

## Getting started

> The official guide assumes a basic knowledge of HTML, CSS, Javascript. If you're new to frontend development, you might want to start by learning the basics

After you've installed the effector let's write a small application on the effector to understand how it works:

### Increment/decrement example
```js
import {createStore, createEvent} from "effector";
import {createComponent} from "effector-react";

const increment = createEvent("increment");
const decrement = createEvent("decrement");

const resetCounter = createEvent("reset counter");
const counter = createStore(0) .on(increment, state => state + 1) .on(decrement, state => state - 1) .reset(resetCounter);
counter.watch(console.log);

const Counter = createComponent(counter, (props, counter) => ( <> <div>{counter}</div> <button onClick={increment}>+</button> <button onClick={decrement}>-</button> <button onClick={resetCounter}>reset</button> </>
));
const App = () => <Counter />;
```

So what did we do? Let's look at it line by line:

```
import {createStore, createEvent} from "effector"
```

**createStore** - is a module that allows you to create storages.
**createEvent** - is a module that connects the creation of events.
**createComponent** - Hook wrapping component from effector-react package. mapstatetoprops analogue to redux

``` js
const increment = createEvent("increment");
const decrement = createEvent("decrement");
const resetCounter = createEvent("reset counter");
```
We're creating three simple events. There's a description of the event in parentheses, which we'll need when we're debuging.

And here comes the most interesting thing:

``` js
const counter = createStore(0) .on(increment, state => state + 1) .on(decrement, state => state - 1) .reset(resetCounter);
```

Create a storage with the initial state 0

Next we create a chain of execution. If one of the events triggers then one of the circuits with this event is executed. If you have two circuits with one event, they are executed in the order of turn. In each on-module rarer which immunely changes the state of the vault

``` js
counter.watch(console.log);
```

Allows us to track changes in the storage

**watch** is triggered by every change in the nature of the subject he's listening to.

More details about **watch** [here](watch_link).

> [Real world examples](123)

So far, we have only looked at the most basic features of the effector in a simple example. The rest of this manual is devoted to a more detailed review of the effector's capabilities, so we advise you to read it in its entirety!