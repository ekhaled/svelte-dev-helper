# svelte-dev-helper
Helper for svelte components to ease development

##Usage

This is meant to be used under the hood for creating a build toolchain, or a dev helper based on [Svelte](https://svelte.technology/) components;

```js
import {Registry, configure, createProxy} from 'svelte-dev-helper';
import Component from './Component.html'; //some svelte component

configure(configOptions);

const id = someUniqueID();

Registry.set(id, {
  component: Component,
  instances:[]
});

export createProxy(id);

```

The component returned by `createProxy` now does the following
 1. Add a `<!--<Component>-->` comment marker in the DOM just above where the component's DOM starts
 2. You can access the component instance using `$0.__component__` in devtools after higlighting the comment marker from above.
