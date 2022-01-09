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
    #allComponentId = {};
    #kindOfComponentBindingData = {};
    createRawComponent(name, attribute) {
      return {
        name,
        content: attribute?.content,
        attribute: attribute?.attribute,
        parentComponent: attribute?.parentComponent,
        positionComponent: attribute?.positionComponent,
        state: attribute?.state || {},
        event: attribute?.event || {},
        id: attribute?.id
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
      return {
        element,
        content: textNode,
        rawContent: rawComponent?.content,
        parent: rawComponent.parentComponent,
        position: rawComponent.positionComponent,
        state: rawComponent?.state,
        event: rawComponent?.event,
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
      const kindOfComponentBindingData = this.#kindOfComponentBindingData;
      for (let x of StackRawComponent) {
        const componentCreated = this.createComponent(x);
        State = {
          ...State,
          ...componentCreated.state
        };
        if (x?.id) {
          this.#allComponentId[x?.id] = {
            ...componentCreated,
            state: new Reactivity({
              Getter(object, propertyName) {
                return object[propertyName];
              },
              Setter(object, propertyName, valueSet) {
                for (let x2 of kindOfComponentBindingData[propertyName]) {
                  x2.state[propertyName] = valueSet;
                  x2.updateTextNode();
                }
              }
            }).setReactive(State)
          };
        }
        if (x?.event instanceof Object) {
          for (let y in x?.event) {
            componentCreated.element[y] = () => x?.event[y]({
              state: new Reactivity({
                Getter(object, propertyName) {
                  return object[propertyName];
                },
                Setter(object, propertyName, valueSet) {
                  for (let x2 of kindOfComponentBindingData[propertyName]) {
                    x2.state[propertyName] = valueSet;
                    x2.updateTextNode();
                  }
                }
              }).setReactive(State)
            });
          }
        }
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
    findById(id) {
      return this.#allComponentId[id];
    }
  };

  // node_modules/dabcom/res/dabMain.js
  var dabMain = new Main();
  function findById(id) {
    return dabMain.findById(id);
  }
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
      content: "`                                    `",
      parentComponent: "",
      positionComponent: "7wete3v4",
      state: {},
      event: {},
      attribute: {
        "class": "hero"
      },
      id: ""
    }), ...svg({
      "height": "100%",
      "width": "100%",
      "parentComponent": "7wete3v4",
      "positionComponent": "o8lw44b"
    }), ...circle({
      "cx": "50",
      "cy": "50",
      "r": "300",
      "stroke": "black",
      "stroke-width": "3",
      "fill": "red",
      "parentComponent": "o8lw44b",
      "positionComponent": "kkriq8dp"
    }), dabMain.createRawComponent(`div`, {
      content: "`                                `",
      parentComponent: "7wete3v4",
      positionComponent: "5ea2njzg",
      state: {},
      event: {},
      attribute: {
        "class": "box"
      },
      id: ""
    }), dabMain.createRawComponent(`h1`, {
      content: "`hello Seleku-kit`",
      parentComponent: "5ea2njzg",
      positionComponent: "1cigrkd5",
      state: {},
      event: {},
      attribute: {},
      id: ""
    }), dabMain.createRawComponent(`p`, {
      content: "`                seleku-kit adalah generasi selanjutnya dari                seleku dan ini merupakan framework yang sangat sederhana                dan lebih cepat dari sebelumnya            `",
      parentComponent: "5ea2njzg",
      positionComponent: "58pttcr1",
      state: {},
      event: {},
      attribute: {},
      id: ""
    }), dabMain.createRawComponent(`hr`, {
      content: "``",
      parentComponent: "7wete3v4",
      positionComponent: "z4gzirj",
      state: {},
      event: {},
      attribute: {},
      id: ""
    }), dabMain.createRawComponent(`div`, {
      content: "`                                `",
      parentComponent: "7wete3v4",
      positionComponent: "3qin9kjl",
      state: {},
      event: {},
      attribute: {
        "class": "container"
      },
      id: ""
    }), dabMain.createRawComponent(`h2`, {
      content: "`Count ${this.state.count}`",
      parentComponent: "3qin9kjl",
      positionComponent: "arqtedbt",
      state: {
        count: 17
      },
      event: {},
      attribute: {},
      id: "counting"
    }), dabMain.createRawComponent(`button`, {
      content: "`Add count`",
      parentComponent: "3qin9kjl",
      positionComponent: "dl94678s",
      state: {},
      event: {
        onclick: function() {
          findById("counting").state.count++;
        }
      },
      attribute: {},
      id: ""
    })];
  }
  Render(Welcome({}), document.body);
})();
