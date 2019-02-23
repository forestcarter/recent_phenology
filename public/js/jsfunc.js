/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 662);
/******/ })
/************************************************************************/
/******/ ({

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(158);


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(159);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 159:
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ 662:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(663);


/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _regenerator = __webpack_require__(157);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function buildDropdowns(tableName, menu) {
    var jsTable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Form";
    var octothorp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!menu) {
        menu = 'measurement';
    }
    var myTBody = document.getElementById(menu + "TBody" + jsTable);
    var selectList = document.createElement("select");
    selectList.id = menu + tableName + jsTable;
    selectList.name = "select" + tableName;
    selectList.className = 'form-control';
    var newTR = document.createElement("tr");
    newTR.id = "row" + tableName;

    var dataLabel = document.createElement("LABEL");
    dataLabel.setAttribute("for", menu + tableName + jsTable);
    var lowerCaseTitle = tableName.split("_").join(" ");
    if (octothorp) {
        dataLabel.textContent = '#';
    } else {
        dataLabel.textContent = lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1);
    }
    dataLabel.className = "dropDownTitles";

    var dataSelect = document.createElement("td");
    dataSelect.appendChild(selectList);

    newTR.appendChild(dataLabel);
    newTR.appendChild(dataSelect);

    if (jsTable === "Form") {

        var myCols = tabletoColumns[tableName];
        var newColRows = createRows(tableName, menu, myCols, 0);
        var spacer1 = document.createElement("td");
        spacer1.innerHTML = "&nbsp;";
        var spacer2 = document.createElement("td");
        spacer2.innerHTML = "&nbsp;";
        var spacer3 = document.createElement("td");
        spacer3.innerHTML = "&nbsp;";
        var spacer4 = document.createElement("td");
        spacer4.innerHTML = "&nbsp;";
        newColRows[0].prepend(spacer1);
        newColRows[0].prepend(spacer2);
        newColRows[1].prepend(spacer3);
        newColRows[1].prepend(spacer4);

        var spacerTR1 = document.createElement("tr");
        spacerTR1.className = "myspacer";
        for (var i = 0; i < 9; i++) {
            spacerTR1.appendChild(spacer1.cloneNode(true));
        }
        var spacerTR2 = document.createElement("tr");
        spacerTR2.appendChild(spacer1.cloneNode(true));

        newColRows[1].id = tableName + "inputrow";
        newColRows[0].id = tableName + "columnsrow";
        newColRows[1].className = newColRows[1].className + " hiddenrows";
        newColRows[0].className = newColRows[0].className + " hiddenrows";

        myTBody.prepend(spacerTR2);
        myTBody.prepend(spacerTR1);
        myTBody.prepend(newColRows[1]);
        myTBody.prepend(newColRows[0]);
        myTBody.prepend(newTR);
    } else {
        var spacerTR = document.createElement("tr");
        spacerTR.id = "spacer" + tableName;
        var _spacer = document.createElement("td");
        _spacer.innerHTML = "&nbsp;";
        spacerTR.appendChild(_spacer);
        myTBody.prepend(spacerTR);
        if (tableName == 'datos') {
            myTBody.append(newTR);
        } else {
            myTBody.prepend(newTR);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////                

function selectOptionsCreate(tableName, menu) {
    var preApproved = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var jsTable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Form";
    var approvedList = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var withRows = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var withNuevo = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;

    var myId = withRows ? "row" + numRows + tableName + "Form" : menu + tableName + jsTable;
    if (tableName === "observaciones") myId = "measurementobservacionesObservaciones";
    if (tableName === "medicion") {
        myId = "measurementmedicionMedicion";
    };
    if (tableName === "linea_mtp") myId = "measurementlinea_mtpSelect";
    if (tableName === "municipio") {
        withNuevo = false;
        var newmuninames = muninames.map(function (muniname) {
            return muniname['nomgeo'];
        });
        completetitlevallist[tableName] = newmuninames;
    };

    if (!!document.getElementById(myId)) {
        "row" + numRows + tableName + "Form";
        var mySelection = document.getElementById(myId);
        if (tableName.split('_')[0] === "observacion") tableName = tableName.replace("observacion", "especie");

        var mycurrentlist = completetitlevallist[tableName];
        mycurrentlist = tableName === "observaciones" ? ['ave', 'arbol', 'arbusto', 'mamifero', 'herpetofauna', 'hierba'] : mycurrentlist;

        var frag = document.createDocumentFragment(),
            elOption = void 0;
        elOption = frag.appendChild(document.createElement('option'));
        elOption.value = "notselected";
        elOption.innerHTML = " ";
        if (withNuevo) {
            elOption = frag.appendChild(document.createElement('option'));
            elOption.value = "Nuevo";
            elOption.innerHTML = "Nuevo";
        }

        if (preApproved === false) {
            for (var i = 0; i < approvedList[tableName].length; i++) {
                elOption = frag.appendChild(document.createElement('option'));
                elOption.value = mycurrentlist[approvedList[tableName][i]];
                elOption.innerHTML = mycurrentlist[approvedList[tableName][i]];
            }
        } else {

            for (var _i = 0; _i < mycurrentlist.length; _i++) {
                if (tableName != 'medicion' || mycurrentlist[_i].split('*')[0] == document.getElementById('measurementlinea_mtpSelect').value.split(' (')[0]) {
                    elOption = frag.appendChild(document.createElement('option'));
                    elOption.value = mycurrentlist[_i];
                    elOption.innerHTML = mycurrentlist[_i];
                }
            }
        }
        while (mySelection.hasChildNodes()) {
            mySelection.removeChild(mySelection.lastChild);
        }
        mySelection.appendChild(frag);
    }
}

//////////////////////////////////////////////////////////////////////////////////////        

function clearForm(menu, jsTable) {
    if (!menu) {
        menu = 'measurement';
    }
    var myTBody = document.getElementById(menu + "TBody" + jsTable);
    if (!!myTBody) {
        while (myTBody.hasChildNodes()) {
            myTBody.removeChild(myTBody.lastChild);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////      

function addOnChangeMTP(tableName, menu) {
    var currentFunction = function currentFunction(tableName, menu) {
        var myChoice = document.getElementById(menu + tableName + "Select").value;
        clearForm(menu, "Form");
        if (myChoice == "Nuevo") {
            clearForm(menu, "Medicion");
            clearForm(menu, "Observaciones");
            clearForm(menu, "Numero");
            clearForm(menu, "Form");
            buildForm("linea_mtp", menu, "Coordenadas de Linea");
            var newMTPdropdowns = ["predio", "municipio", "estado"];
            newMTPdropdowns.forEach(function (newTable) {
                buildDropdowns(newTable, menu, "Form");
                selectOptionsCreate(newTable, menu);
                addOnChangeFKey(newTable, menu);
            });
        } else {
            //This is when an old linea_mtp is selected
            clearForm(menu, "Observaciones");
            clearForm(menu, "Medicion");
            buildDropdowns("medicion", menu, "Medicion");
            selectOptionsCreate("medicion", menu);
            addOnChangeMedicion('medicion', menu);
        }
    };
    var currentOnChange = function currentOnChange() {
        currentFunction(tableName, menu);
    };

    var getSelection = document.getElementById(menu + tableName + "Select");
    getSelection.onchange = currentOnChange;
}

//////////////////////////////////////////////////////////////////////////////////////          

function addOnChangeFKey(tableName, menu) {
    var getSelection = document.getElementById(menu + tableName + "Form");
    var currentFunction3 = function currentFunction3(tableName, menu) {
        var myChoice = getSelection.value;
        var inputRow = document.getElementById(tableName + "inputrow");
        var colRow = document.getElementById(tableName + "columnsrow");
        if (myChoice === "Nuevo") {
            colRow.classList.remove("hiddenrows");
            inputRow.classList.remove("hiddenrows");
        } else {
            colRow.classList.add("hiddenrows");
            inputRow.classList.add("hiddenrows");
        }
    };
    var currentOnChange3 = function currentOnChange3() {
        currentFunction3(tableName, menu);
    };
    getSelection.onchange = currentOnChange3;
}

//////////////////////////////////////////////////////////////////////////////////////       
function addOnChangeMedicion(tableName, menu) {
    var getSelection = document.getElementById(menu + tableName + "Medicion");
    var currentFunctionMedicion = function currentFunctionMedicion(tableName, menu) {
        var myChoice = document.getElementById(menu + tableName + "Medicion").value;
        if (myChoice === "Nuevo") {
            clearForm(menu, "Observaciones");
            clearForm(menu, "Numero");
            clearForm(menu, "Form");
            buildForm("medicion", menu);
            buildForm("personas", menu, "Brigada");
            buildForm("gps", menu, "GPS", true);
            buildForm("camara", menu, "Camara", true);
        } else {
            clearForm(menu, "Observaciones");
            clearForm(menu, "Numero");
            clearForm(menu, "Form");
            buildDropdowns("observaciones", menu, "Observaciones");
            selectOptionsCreate("observaciones", menu, true, "Form", [], false, false);
            addOnChangeObservaciones(menu);
        }
    };
    var currentOnChangeMedicion = function currentOnChangeMedicion() {
        currentFunctionMedicion(tableName, menu);
    };
    getSelection.onchange = currentOnChangeMedicion;
}

//////////////////////////////////////////////////////////////////////////////////////         

function createRows(tableName, menu, myCols, myNumRow) {
    var obs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var customList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];


    var speciesTable = [];
    var columnRowOld = document.createElement("tr");
    var firstDataRow = document.createElement("tr");
    firstDataRow.class = "dataRows";

    myCols.sort(function (a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
    myCols.sort(function (a, b) {
        if (a == 'notas') return 1;
        if (b == 'notas') return -1;
        if (a.indexOf('omienzo') !== -1) return -1;
        if (b.indexOf('omienzo') !== -1) return 1;
        if (a.indexOf('long') !== -1) return -1;
        if (b.indexOf('long') !== -1) return 1;
        if (a.indexOf('lat') !== -1) return -1;
        if (b.indexOf('lat') !== -1) return 1;
        if (a.indexOf('hora') !== -1) return -1;
        if (b.indexOf('hora') !== -1) return 1;
        if (a.indexOf('fecha') !== -1) return -1;
        if (b.indexOf('fecha') !== -1) return 1;
        if (a.indexOf('sexo') !== -1) return -1;
        if (b.indexOf('sexo') !== -1) return 1;
        if (a.indexOf('estadio') !== -1) return -1;
        if (b.indexOf('estadio') !== -1) return 1;
        if (a.indexOf('actividad') !== -1) return -1;
        if (b.indexOf('actividad') !== -1) return 1;
        if (a.indexOf('distancia') !== -1) return -1;
        if (b.indexOf('distancia') !== -1) return 1;
        if (a.indexOf('azimut') !== -1) return -1;
        if (b.indexOf('azimut') !== -1) return 1;
        if (a.indexOf('altura') !== -1) return -1;
        if (b.indexOf('altura') !== -1) return 1;
        if (a.indexOf('dn') !== -1) return -1;
        if (b.indexOf('dn') !== -1) return 1;
        if (a.indexOf('dc1') !== -1) return -1;
        if (b.indexOf('dc1') !== -1) return 1;
        if (a.indexOf('dc2') !== -1) return -1;
        if (b.indexOf('dc2') !== -1) return 1;

        if (a.length == 1) return 1;
        if (b.length == 1) return -1;
        if (a.length == 2) return 1;
        if (b.length == 2) return -1;
        return 0;
    });

    if (customList.length >= 1) myCols = customList;

    if (obs) {
        if (tableName == 'observacion_arbol' || tableName == 'observacion_arbusto') {
            var cuadranteLabel = document.createElement("td");
            cuadranteLabel.textContent = "Cuadrante";
            cuadranteLabel.className = "formcolumnlabels";
            var cuadranteBox = document.createElement("td");
            var cuadranteInput = document.createElement("INPUT");
            cuadranteInput.setAttribute("type", "text");
            cuadranteInput.name = "row" + myNumRow + '*' + tableName + '*cuadrante';
            cuadranteInput.id = "row" + myNumRow + "cuadrante";
            cuadranteInput.value = 1;
            cuadranteInput.className = "cuadranteinput";
            cuadranteBox.appendChild(cuadranteInput);
            cuadranteBox.className = "cuadrante";
            columnRowOld.appendChild(cuadranteLabel);
            firstDataRow.appendChild(cuadranteBox);
            //
            var cuadnumLabel = document.createElement("td");
            cuadnumLabel.textContent = "#";
            cuadnumLabel.className = "formcolumnlabels octothorp";
            var cuadnumBox = document.createElement("td");
            var cuadnumInput = document.createElement("INPUT");
            cuadnumInput.setAttribute("type", "text");
            cuadnumInput.name = "row" + myNumRow + '*' + tableName + '*cuadnum';
            cuadnumInput.id = "row" + myNumRow + "cuadnum";
            cuadnumInput.value = 1;
            cuadnumInput.className = "cuadranteinput";
            cuadnumBox.appendChild(cuadnumInput);
            cuadnumBox.className = "cuadrante";
            columnRowOld.appendChild(cuadnumLabel);
            firstDataRow.appendChild(cuadnumBox);
        }
        var _speciesTable = tableName.replace("observacion", "especie");
        //Species drop Label
        var speciesLabelDrop = document.createElement("td");
        speciesLabelDrop.innerText = _speciesTable;
        speciesLabelDrop.className = "formcolumnlabels";
        columnRowOld.appendChild(speciesLabelDrop);
        //Species drop 
        var speciesInput = document.createElement("SELECT");
        speciesInput.id = "row" + myNumRow + tableName + "Form"; //this needs to
        speciesInput.setAttribute("class", _speciesTable);
        speciesInput.classList.add('allinputs');
        speciesInput.classList.add('form-control');

        speciesInput.name = "row" + myNumRow + "*" + tableName + "*" + "species";
        var inputBox = document.createElement("td");
        inputBox.appendChild(speciesInput);
        firstDataRow.appendChild(inputBox);
        //Invador Label
        var invadorLabel = document.createElement("td");
        invadorLabel.textContent = "Invasor";
        invadorLabel.className = "formcolumnlabels";
        columnRowOld.appendChild(invadorLabel);
        //Species comun Label
        var speciesLabelComun = document.createElement("td");
        speciesLabelComun.textContent = "Nuevo Nombre Comun";
        speciesLabelComun.className = "formcolumnlabels";
        columnRowOld.appendChild(speciesLabelComun);

        //Species cien Label
        var speciesLabelCien = document.createElement("td");
        speciesLabelCien.textContent = "Nuevo Nombre Cientifico";
        speciesLabelCien.className = "formcolumnlabels";
        columnRowOld.appendChild(speciesLabelCien);

        //Invador Checkbox
        var invadorCheck = document.createElement("INPUT");
        invadorCheck.setAttribute("type", "checkbox");
        invadorCheck.classList.add("row" + myNumRow + "disableme");
        invadorCheck.classList.add('invadorCheck');
        invadorCheck.disabled = true;
        invadorCheck.value = 'true';
        invadorCheck.name = "row" + myNumRow + "*" + tableName + "*" + "invasor";
        var boxContainerInvador = document.createElement("td");
        boxContainerInvador.className = "centerInTd";
        boxContainerInvador.appendChild(invadorCheck);
        firstDataRow.appendChild(boxContainerInvador);

        //Species comun inputbox
        var speciesBoxComun = document.createElement("INPUT");
        speciesBoxComun.setAttribute("type", "text");
        speciesBoxComun.classList.add("row" + myNumRow + "disableme");
        speciesBoxComun.classList.add('allinputs');
        speciesBoxComun.classList.add('form-control');

        speciesBoxComun.disabled = true;
        speciesBoxComun.name = "row" + myNumRow + "*" + tableName + "*" + "comun";
        var boxContainerComun = document.createElement("td");
        boxContainerComun.appendChild(speciesBoxComun);
        firstDataRow.appendChild(boxContainerComun);

        //Species cien inputbox
        var speciesBoxCien = document.createElement("INPUT");
        speciesBoxCien.setAttribute("type", "text");

        speciesBoxCien.classList.add("row" + myNumRow + "disableme");
        speciesBoxCien.classList.add('allinputs');
        speciesBoxCien.classList.add('form-control');

        speciesBoxCien.disabled = true;
        speciesBoxCien.name = "row" + myNumRow + "*" + tableName + "*" + "cientifico";
        var boxContainerCien = document.createElement("td");
        boxContainerCien.appendChild(speciesBoxCien);
        firstDataRow.appendChild(boxContainerCien);
    }
    myCols.forEach(function (val) {
        var found = false;
        if (typeof allPhp2[tableName]["fKeyCol"] !== "undefined") {
            found = !!allPhp2[tableName]["fKeyCol"].find(function (element) {
                return element == val;
            });
        }
        if (!val.includes("iden") && !found) {
            var nameBox = document.createElement("td");
            var spacedval = val.split("_").join(" ");
            nameBox.innerText = spacedval.charAt(0).toUpperCase() + spacedval.slice(1);
            nameBox.className = "formcolumnlabels";

            columnRowOld.appendChild(nameBox);
            columnRowOld.className = tableName + "columnrow";
            var textInput = document.createElement("INPUT");
            if (val.substring(0, 5).toLowerCase() == "fecha") {
                textInput.classList.add('fechainputs');

                textInput.setAttribute("type", "date");
            } else if (val.substring(0, 4).toLowerCase() === "hora") {
                textInput.classList.add('horainputs');
                textInput.setAttribute("type", "time");
            } else {
                textInput.setAttribute("type", "text");
            }
            textInput.id = tableName + val;
            textInput.classList.add(tableName + val);
            if (obs) {
                textInput.classList.add("row" + myNumRow + "*" + tableName);
            }
            textInput.classList.add('allinputs');
            textInput.classList.add('form-control');

            textInput.name = ("row" + myNumRow + "*" + tableName + "*" + val).toLowerCase();
            var _inputBox = document.createElement("td");
            _inputBox.appendChild(textInput);
            firstDataRow.className = tableName + "inputrow";
            if (val !== 'Foto') {
                firstDataRow.appendChild(_inputBox);
            }
        }
    });
    if (obs) {
        var fotoInput = document.createElement("INPUT");
        fotoInput.setAttribute("type", "file");
        fotoInput.name = ("row" + myNumRow + "*" + tableName + "*" + 'foto').toLowerCase();
        fotoInput.id = tableName + 'foto';
        var fotoInputBox = document.createElement("td");
        fotoInputBox.appendChild(fotoInput);

        firstDataRow.appendChild(fotoInputBox);
        return [columnRowOld, firstDataRow, speciesTable];
    }

    return [columnRowOld, firstDataRow, speciesTable];
}

//////////////////////////////////////////////////////////////////////////////////////          


function buildForm(tableName, menu, myTitle) {
    var spacers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var obs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var customList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
    var buttons = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;

    if (!menu) {
        menu = 'measurement';
    }
    var myTBody = document.getElementById(menu + "TBodyForm");
    var myCols = tabletoColumns[tableName];
    var spaceRow = document.createElement("tr");
    spaceRow.className = "formtitles";
    spaceRow.innerHTML = "<br> ";
    if (myTitle !== "none") spaceRow.innerHTML = myTitle;
    var buttonRow = document.createElement("tr");
    var mySubmit = document.createElement("INPUT");
    mySubmit.setAttribute("type", "submit");
    mySubmit.id = menu + tableName + "Submit";
    mySubmit.className = "border border-secondary btn btn-success mySubmit p-2 m-2";
    mySubmit.value = 'Enviar';
    if (document.getElementsByClassName("mySubmit").length > 0) mySubmit = document.getElementsByClassName("mySubmit")[0];
    var newRows = createRows(tableName, menu, myCols, 0, obs, customList);

    var addElementRow = document.createElement("BUTTON");
    addElementRow.setAttribute("type", "button");
    addElementRow.id = "addElementRow" + tableName;
    //addElementRow.className = "addElementRow";
    var subtractElementRow = document.createElement("BUTTON");
    subtractElementRow.setAttribute("type", "button");

    subtractElementRow.id = "subtractElementRow";
    addElementRow.innerText = "+";
    subtractElementRow.innerText = "-";

    addElementRow.onclick = function () {
        return addRow(myTBody, tableName, myCols, obs, customList);
    };
    subtractElementRow.onclick = function () {
        return subtractRow(myTBody, tableName);
    };
    var buttonBox = document.createElement("td");
    buttonBox.appendChild(addElementRow);
    buttonBox.appendChild(subtractElementRow);
    buttonRow.appendChild(buttonBox);

    var spacer1 = document.createElement("td");
    spacer1.innerHTML = "&nbsp;";

    var spacerTR1 = document.createElement("tr");
    spacerTR1.className = "myspacer";
    for (var i = 0; i < newRows[0].childElementCount; i++) {
        spacerTR1.appendChild(spacer1.cloneNode(true));
    }
    var spacerTR2 = document.createElement("tr");
    spacerTR2.appendChild(spacer1.cloneNode(true));

    var bottomSpacer = document.createElement("tr");
    bottomSpacer.id = tableName + "bottomspacer";
    bottomSpacer.appendChild(spacer1.cloneNode(true));

    if (tableName == 'medicion' || !buttons) {
        myTBody.appendChild(mySubmit);
        myTBody.insertBefore(newRows[0], mySubmit);
        myTBody.insertBefore(newRows[1], mySubmit);
        //myTBody.insertBefore(bottomSpacer, mySubmit);
    } else {

        if (spacers) {

            myTBody.appendChild(mySubmit);
            myTBody.insertBefore(spacerTR1, mySubmit);
            myTBody.insertBefore(spacerTR2, mySubmit);
            myTBody.insertBefore(spaceRow, mySubmit);
            myTBody.insertBefore(buttonRow, mySubmit);
            myTBody.insertBefore(newRows[0], mySubmit);
            myTBody.insertBefore(newRows[1], mySubmit);
            myTBody.insertBefore(bottomSpacer, mySubmit);
        } else {

            myTBody.appendChild(mySubmit);
            myTBody.insertBefore(spaceRow, mySubmit);
            myTBody.insertBefore(buttonRow, mySubmit);
            myTBody.insertBefore(newRows[0], mySubmit);
            myTBody.insertBefore(newRows[1], mySubmit);
            myTBody.insertBefore(bottomSpacer, mySubmit);
        }
    }

    if (obs) {
        selectOptionsCreate(tableName, menu, true, "Form", [], true);

        selectSpeciesOnChange(tableName, menu, 0);

        //selectOptionsCreate(tableName, menu, true, "Form",[], 0)
    }
}

//////////////////////////////////////////////////////////////////////////////////////          

function addRow(myTBody, tableName, myCols, obs) {
    var customList = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    var menu = 'selection';
    var bottomSpacer = document.getElementById(tableName + "bottomspacer");
    numRows++;
    var newRows = createRows(tableName, menu, myCols, numRows, obs, customList);
    newRows[1].class = "addedRow";
    newRows[1].id = "addedRow";
    myTBody.insertBefore(newRows[1], bottomSpacer);
    if (obs) {
        selectSpeciesOnChange(tableName, menu, numRows);
        selectOptionsCreate(tableName, menu, true, "Form", [], true);
    }
}
//////////////////////////////////////////////////////////////////////////////////////          

function subtractRow(myTBody, tableName) {
    myTBody.childNodes.forEach(function (val, index) {
        if (val.id == tableName + "bottomspacer") {
            var targetNode = myTBody.childNodes[index - 1];
            if (targetNode.id == "addedRow") {
                myTBody.removeChild(targetNode);
                numRows--;
            }
        }
    });
}

//////////////////////////////////////////////////////////////////////////////////////          

function addOnChangeObservaciones(menu) {
    var getSelection = document.getElementById("measurementobservacionesObservaciones");
    var currentFunction3 = function currentFunction3(tableName, menu) {
        var myChoice = 'observacion_' + document.getElementById("measurementobservacionesObservaciones").value;
        numRows = 0;
        clearForm(menu, "Numero");
        clearForm(menu, "Form");
        if (myChoice !== 'notselected') {
            var numberPoints = 4;
            var transpunto = 'Transecto';
            if (myChoice == "observacion_ave" || myChoice == "observacion_mamifero") {
                transpunto = 'Punto';
                numberPoints = 5;
            }
            if (myChoice == "observacion_arbol" || myChoice == "observacion_arbusto") {
                buildDropdowns("Punto", menu, "Numero");
                var mySelectionPunto = document.getElementById("measurementPuntoNumero");
                mySelectionPunto.addEventListener('change', function () {
                    clearForm('', "Form");
                });
                //Add Number Options
                var fragPunto = document.createDocumentFragment(),
                    _elOption = void 0;
                _elOption = fragPunto.appendChild(document.createElement('option'));
                _elOption.value = "notselected";
                _elOption.innerHTML = " ";
                for (var i = 1; i <= 8; i++) {
                    _elOption = fragPunto.appendChild(document.createElement('option'));
                    _elOption.value = i;
                    _elOption.innerHTML = i;
                }
                mySelectionPunto.appendChild(fragPunto);
            }
            var octothorp = myChoice == 'observacion_hierba' ? true : false;
            buildDropdowns(transpunto, menu, "Numero", octothorp);
            var mySelection = document.getElementById('measurement' + transpunto + 'Numero');
            mySelection.addEventListener('change', function () {
                clearForm('', "Form");
            });
            //Add Number Options

            var frag = document.createDocumentFragment(),
                elOption = void 0;
            elOption = frag.appendChild(document.createElement('option'));
            elOption.value = "notselected";
            elOption.innerHTML = " ";
            for (var _i2 = 1; _i2 <= numberPoints; _i2++) {
                elOption = frag.appendChild(document.createElement('option'));
                elOption.value = _i2;
                elOption.innerHTML = _i2;
            }
            while (mySelection.hasChildNodes()) {
                mySelection.removeChild(mySelection.lastChild);
            }
            mySelection.appendChild(frag);

            var readybutton = document.createElement("button");
            readybutton.textContent = 'Cargar Formulario';
            readybutton.className = ' btn btn-primary border border-secondary p-2 m-2 cargarformulario';
            readybutton.type = "button";
            readybutton.id = "readybutton";
            readybutton.addEventListener('click', clickReadyButton);
            //readybutton.onclick=function(){return clickReadyButton() }; 

            var myTBody = document.getElementById("measurementTBodyNumero");
            myTBody.append(readybutton);
        }
    };
    var currentOnChange3 = function currentOnChange3(tableName, menu) {
        currentFunction3(tableName, menu);
    };
    getSelection.onchange = currentOnChange3;
}

//////////////////////////////////////////////////////////////////////////////////////          


function clickReadyButton(e) {
    var getData = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var myapi, rawResponse, dataResult;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:

                            //let myapi ='http://localhost:3000/api/getudp'
                            myapi = 'https://biodiversidadpuebla.online/api/getudp';


                            if (window.location.host == 'localhost:3000') myapi = 'http://localhost:3000/api/getudp';

                            _context.next = 4;
                            return fetch(myapi, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    "Content-Type": "application/json;",
                                    mode: 'cors'
                                },
                                body: JSON.stringify({
                                    "lineamtp": document.getElementById("measurementlinea_mtpSelect").value,
                                    "medicion": document.getElementById("measurementmedicionMedicion").value,
                                    "observacion": myChoice,
                                    "punto": selectedPunto ? selectedPunto.value : "0",
                                    "transecto": selectedTransecto ? selectedTransecto.value : "0",
                                    "useremail": useremail
                                })
                            });

                        case 4:
                            rawResponse = _context.sent;
                            _context.next = 7;
                            return rawResponse.json();

                        case 7:
                            dataResult = _context.sent;
                            return _context.abrupt("return", dataResult);

                        case 9:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function getData() {
            return _ref.apply(this, arguments);
        };
    }();

    var menu = "measurement";
    var myChoice = 'observacion_' + document.getElementById("measurementobservacionesObservaciones").value;
    var newExist = document.getElementById("measurementdatosNumero");
    var selectedPunto = document.getElementById("measurementPuntoNumero");
    var selectedTransecto = document.getElementById("measurementTransectoNumero");
    var selectedlinea_mtp = document.getElementById("measurementlinea_mtpSelect");
    var selectedmedicion = document.getElementById("measurementmedicionMedicion");
    if (selectedlinea_mtp && selectedlinea_mtp.value == 'notselected') {
        alert('Elige Linea MTP');
        return;
    }
    if (selectedPunto && selectedPunto.value == 'notselected') {
        alert('Elige Punto');
        return;
    }
    if (selectedmedicion && selectedmedicion.value == 'notselected') {
        alert('Elige Medicion');
        return;
    }
    if (selectedTransecto && selectedTransecto.value == 'notselected') {
        alert('Elige Transecto');
        return;
    }

    if (e.offsetX > 0) {

        getData().then(function (dataResult) {
            clearForm(menu, "Form");
            if (dataResult[0].length > 0) {
                var myTBody = document.getElementById(menu + "TBody" + 'Form');
                var hiddenLocation = document.createElement('input');
                hiddenLocation.setAttribute("type", "hidden");
                hiddenLocation.name = 'hiddenlocation';
                hiddenLocation.value = dataResult[0][0]['iden'];
                hiddenLocation.id = 'hiddenlocation';
                myTBody.append(hiddenLocation);

                buildCustomForm(myChoice, menu, 'Datos Existentes');
                var formtranspunto = 'punto';
                if (myChoice.includes('hierba') || myChoice.includes('herpetofauna')) {
                    formtranspunto = 'transecto';
                }
                var lifeForm = document.getElementById("measurementobservacionesObservaciones").value;
                var puntoEntries = Object.entries(dataResult[0][0]);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = puntoEntries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _ref2 = _step.value;

                        var _ref3 = _slicedToArray(_ref2, 2);

                        var cat = _ref3[0];
                        var val = _ref3[1];

                        var myElem = document.getElementById(formtranspunto + "_" + lifeForm + cat);
                        if (myElem) {
                            myElem.value = val;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                dataResult[1].forEach(function (row, ind) {
                    if (ind > 0) {
                        //make new row
                        var getSelectionAdd = document.getElementById("addElementRow" + myChoice);
                        if (!myChoice.includes('arbol') && !myChoice.includes('arbusto')) {
                            getSelectionAdd.onclick();
                        }
                    }
                    var obsEntries = Object.entries(row);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = obsEntries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _ref4 = _step2.value;

                            var _ref5 = _slicedToArray(_ref4, 2);

                            var _cat = _ref5[0];
                            var _val = _ref5[1];

                            if (_cat == 'comun_cientifico') {
                                var myElemSpecies = document.getElementsByName("row" + ind + "*" + myChoice + "*species");
                                myElemSpecies[0].value = _val;
                            }
                            var myElem = document.getElementsByName("row" + ind + "*" + myChoice + "*" + _cat);
                            if (myElem[0]) {
                                myElem[0].value = _val;

                                if (_cat == 'invasor' && myElem[0].value == "true") {
                                    myElem[0].disabled = false;
                                    myElem[0].checked = true;
                                    myElem[0].disabled = true;
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                });
            } else {
                buildCustomForm(myChoice, menu, 'Datos Nuevos');
            }
        });
    } else {
        if (newold == 'Datos Nuevos') {
            buildCustomForm(myChoice, menu, 'Datos Nuevos');
        } else {
            buildCustomForm(myChoice, menu, 'Datos Existentes');

            var myTBody = document.getElementById(menu + "TBody" + 'Form');
            var hiddenLocation = document.createElement('input');
            hiddenLocation.setAttribute("type", "hidden");
            hiddenLocation.name = 'hiddenlocation';
            hiddenLocation.value = hiddenlocationvalue;
            hiddenLocation.id = 'hiddenlocation';
            myTBody.append(hiddenLocation);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////          


function selectSpeciesOnChange(tableName, menu, numRows) {
    var currentFunction2 = function currentFunction2(tableName, numRows) {
        var myChoice = document.getElementById("row" + numRows + tableName + "Form").value;
        var allMyRows = document.getElementsByClassName("row" + numRows + "*" + tableName);
        var colRow = document.getElementsByClassName("row" + numRows + "disableme");
        if (myChoice === "Nuevo") {
            colRow[0].disabled = false;
            colRow[1].disabled = false;
            colRow[2].disabled = false;
        } else {
            colRow[0].disabled = true;
            colRow[1].disabled = true;
            colRow[2].disabled = true;
            colRow[1].value = "";
            colRow[2].value = "";
        }
        if (myChoice === "0000") {
            for (var i = 0; i < allMyRows.length; i++) {
                if (allMyRows[i].name.includes("hora")) {
                    allMyRows[i].value = "00:01";
                } else if (allMyRows[i].name.includes("fecha")) {
                    allMyRows[i].value = "1000-01-01";
                } else {
                    allMyRows[i].value = "0000";
                }
            }
        }
        if (myChoice === "000") {
            for (var _i3 = 0; _i3 < allMyRows.length; _i3++) {
                allMyRows[_i3].value = "000";
            }
        }
    };
    var currentOnChange2 = function currentOnChange2() {
        currentFunction2(tableName, numRows);
    };
    var getSelection = document.getElementById("row" + numRows + tableName + "Form");
    getSelection.onchange = currentOnChange2;
}

function buildCustomForm(obName, menu, mode) {
    var transPunto = 'punto';
    if (obName == 'observacion_hierba' || obName == 'observacion_herpetofauna') {
        transPunto = 'transecto';
    }
    var obsNameContext = transPunto + "_" + obName.split('_')[1];

    buildForm(obsNameContext, menu, ' ', false, false, [], false);

    buildForm(obName, menu, ' ', true, true, []);

    if (obName == 'observacion_arbol' || obName == 'observacion_arbusto') {
        var getSelectionAdd = document.getElementById("addElementRow" + obName);
        var getSelectionSubtract = document.getElementById('subtractElementRow');
        var getCuadrante0 = document.getElementById("row" + 0 + "cuadrante");
        getCuadrante0.setAttribute("readonly", true);
        for (var i = 0; i < 7; i++) {
            getSelectionAdd.onclick();
            var getCuadrante = document.getElementById("row" + (i + 1) + "cuadrante");
            getCuadrante.value = Math.floor(i / 2 + 1.5);
            getCuadrante.setAttribute("readonly", true);
            var getCuadnum = document.getElementById("row" + (i + 1) + "cuadnum");
            getCuadnum.value = i + 2;
            getCuadnum.setAttribute("readonly", true);
        }
        numRows = 0;
        getSelectionAdd.disabled = true;
        getSelectionSubtract.disabled = true;
    }
    var myTBody = document.getElementById(menu + "TBody" + 'Form');
    var datosField = document.createElement('input');
    datosField.setAttribute("type", "text");
    datosField.name = 'mode';
    datosField.value = mode;
    datosField.id = 'mode';
    datosField.className = ' modeButton text-dark text-center';
    datosField.setAttribute("readonly", true);
    myTBody.prepend(datosField);
}

function addOnChangeAdminTable() {
    var getSelection = document.getElementById('table_option');
    var currentFunction3 = function currentFunction3(tableName, menu) {

        var myChoice = getSelection.value;
        var mySelection = document.getElementById('field_option');
        var mycurrentlist = tabletoColumns[myChoice];
        var frag = document.createDocumentFragment(),
            elOption = void 0;

        for (var i = 0; i < mycurrentlist.length; i++) {
            if (!mycurrentlist[i].includes("iden")) {
                elOption = frag.appendChild(document.createElement('option'));
                elOption.value = mycurrentlist[i];
                elOption.innerHTML = mycurrentlist[i];
            }
        }
        while (mySelection.hasChildNodes()) {
            mySelection.removeChild(mySelection.lastChild);
        }
        mySelection.appendChild(frag);
    };
    var currentOnChange3 = function currentOnChange3() {
        currentFunction3();
    };
    getSelection.onchange = currentOnChange3;
}
var numRows = 0;
if (window.location.href.substr(-5) === 'admin') {
    buildDropdowns("usuario", "measurement", "Select");
    selectOptionsCreate("usuario", "measurement", true, "Select", [], false, false);
    buildDropdowns("usuario_permitido", "measurement", "Medicion");
    selectOptionsCreate("usuario_permitido", "measurement", true, "Medicion", [], false, false);
    buildDropdowns("additional_layers", "measurement", "cargar");
    selectOptionsCreate("additional_layers", "measurement", true, "cargar", [], false, false);
    addOnChangeAdminTable();
} else {
    buildDropdowns("linea_mtp", "measurement", "Select");
    selectOptionsCreate("linea_mtp", "measurement", true, "Select");
    addOnChangeMTP("linea_mtp", "measurement");
}

/***/ })

/******/ });