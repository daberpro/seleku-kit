(() => {
  // node_modules/dabcom/res/Reactivity.js
  var Reactivity = class {
    #onGet = null;
    #onSet = null;
    constructor(config) {
      this.#onGet = config.Getter;
      this.#onSet = config.Setter;
    }
    setReactive(Obj) {
      if (typeof this.#onGet !== "function") {
        this.#onGet = () => {
        };
      }
      if (typeof this.#onSet !== "function") {
        this.#onGet = () => {
        };
      }
      const onGet = this.#onGet;
      const onSet = this.#onSet;
      const obj = new Proxy(Obj, {
        get(object, propertyName) {
          return onGet(object, propertyName) || object[propertyName];
        },
        set(object, propertyName, valueSet) {
          if (typeof valueSet === "function") {
            Obj[propertyName] = valueSet(object, propertyName, valueSet) || null;
          } else {
            Obj[propertyName] = valueSet;
          }
          onSet(object, propertyName, valueSet);
          return 1;
        }
      });
      return obj;
    }
  };

  // node_modules/dabcom/res/dabMainClass.js
  var Main = class {
    createRawComponent(name, attribute) {
      return {
        name,
        content: attribute?.content,
        attribute: attribute?.attribute,
        parentComponent: attribute?.parentComponent,
        positionComponent: attribute?.positionComponent,
        state: attribute?.state || {},
        event: attribute?.event || {}
      };
    }
    createComponent(rawComponent) {
      const element = document.createElement(rawComponent.name);
      if (rawComponent?.attribute instanceof Object) {
        for (let x in rawComponent?.attribute) {
          element.setAttribute(x, rawComponent?.attribute[x]);
        }
      }
      const textNode = document.createTextNode(rawComponent?.content);
      element.appendChild(textNode);
      if (rawComponent?.event instanceof Object) {
        for (let x in rawComponent?.event) {
          element[x] = rawComponent?.event[x];
        }
      }
      return {
        element,
        content: textNode,
        rawContent: rawComponent?.content,
        parent: rawComponent.parentComponent,
        position: rawComponent.positionComponent,
        state: rawComponent?.state,
        destroy(onDestroy = () => {
        }) {
          onDestroy();
          element.remove();
        },
        updateTextNode() {
          const text = this.rawContent;
          const resultText = eval(text);
          this.content.replaceData(0, text.length, resultText);
        },
        updateAttribute() {
        }
      };
    }
    renderComponent(StackRawComponent, target) {
      const StackComponent = [];
      let State = {};
      let kindOfComponentBindingData = {};
      for (let x of StackRawComponent) {
        const componentCreated = this.createComponent(x);
        State = {
          ...State,
          ...componentCreated.state
        };
        for (let y of Object.keys(componentCreated.state)) {
          if (kindOfComponentBindingData[y] instanceof Array) {
            kindOfComponentBindingData[y].push(componentCreated);
          } else {
            kindOfComponentBindingData[y] = [];
            kindOfComponentBindingData[y].push(componentCreated);
          }
        }
        ;
        StackComponent.push(componentCreated);
      }
      const element2 = {};
      for (let x of StackComponent) {
        x.updateTextNode();
        if (!element2[x.position]) {
          element2[x.position] = x.element;
          if (element2[x.parent]) {
            element2[x.parent].appendChild(x.element);
          }
        } else {
          element2[x.position].appendChild(x.element);
        }
      }
      if (target instanceof HTMLElement)
        target.appendChild(element2[Object.keys(element2)[0]]);
      return {
        component: StackComponent[0],
        state: new Reactivity({
          Getter(object, propertyName) {
            return object[propertyName];
          },
          Setter(object, propertyName, valueSet) {
            for (let x of kindOfComponentBindingData[propertyName]) {
              x.state[propertyName] = valueSet;
              x.updateTextNode();
            }
          }
        }).setReactive(State),
        updateComponentRendered() {
          for (let x of StackComponent) {
            x.updateTextNode();
          }
        }
      };
    }
    replaceChild(newComponent, oldComponent) {
      oldComponent.parentElement.replaceChild(newComponent.element, oldComponent);
    }
  };

  // node_modules/dabcom/res/dabMain.js
  var dabMain = new Main();
  function Render(Component, target) {
    return {
      ...dabMain.renderComponent(Component, target),
      updateComponentProperty(componentFunction, property) {
        const newComponent = dabMain.renderComponent(componentFunction(property));
        dabMain.replaceChild(newComponent.component, this.component.element);
      }
    };
  }

  // main.js
  function Welcome() {
    return [dabMain.createRawComponent(`div`, {
      content: "`                            `",
      parentComponent: "",
      positionComponent: "5ekx5feh",
      state: {},
      event: {}
    }), dabMain.createRawComponent(`h1`, {
      content: "`hello world`",
      parentComponent: "5ekx5feh",
      positionComponent: "ab6ya6yj",
      state: {},
      event: {}
    })];
  }
  Render(Welcome({}), document.body);
})();
