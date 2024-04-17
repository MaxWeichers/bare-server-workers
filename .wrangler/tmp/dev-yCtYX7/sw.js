"use strict";
(() => {
  // .wrangler/tmp/bundle-FXRvz8/checked-fetch.js
  var urls = /* @__PURE__ */ new Set();
  function checkURL(request, init) {
    const url = request instanceof URL ? request : new URL(
      (typeof request === "string" ? new Request(request, init) : request).url
    );
    if (url.port && url.port !== "443" && url.protocol === "https:") {
      if (!urls.has(url.toString())) {
        urls.add(url.toString());
        console.warn(
          `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
        );
      }
    }
  }
  globalThis.fetch = new Proxy(globalThis.fetch, {
    apply(target, thisArg, argArray) {
      const [request, init] = argArray;
      checkURL(request, init);
      return Reflect.apply(target, thisArg, argArray);
    }
  });

  // ../../home/codespace/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
  var __facade_middleware__ = [];
  function __facade_register__(...args) {
    __facade_middleware__.push(...args.flat());
  }
  function __facade_registerInternal__(...args) {
    __facade_middleware__.unshift(...args.flat());
  }
  function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
    const [head, ...tail] = middlewareChain;
    const middlewareCtx = {
      dispatch,
      next(newRequest, newEnv) {
        return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
      }
    };
    return head(request, env, ctx, middlewareCtx);
  }
  function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
    return __facade_invokeChain__(request, env, ctx, dispatch, [
      ...__facade_middleware__,
      finalMiddleware
    ]);
  }

  // ../../home/codespace/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/loader-sw.ts
  var __FACADE_EVENT_TARGET__;
  if (globalThis.MINIFLARE) {
    __FACADE_EVENT_TARGET__ = new (Object.getPrototypeOf(WorkerGlobalScope))();
  } else {
    __FACADE_EVENT_TARGET__ = new EventTarget();
  }
  function __facade_isSpecialEvent__(type) {
    return type === "fetch" || type === "scheduled";
  }
  var __facade__originalAddEventListener__ = globalThis.addEventListener;
  var __facade__originalRemoveEventListener__ = globalThis.removeEventListener;
  var __facade__originalDispatchEvent__ = globalThis.dispatchEvent;
  globalThis.addEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.addEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalAddEventListener__(type, listener, options);
    }
  };
  globalThis.removeEventListener = function(type, listener, options) {
    if (__facade_isSpecialEvent__(type)) {
      __FACADE_EVENT_TARGET__.removeEventListener(
        type,
        listener,
        options
      );
    } else {
      __facade__originalRemoveEventListener__(type, listener, options);
    }
  };
  globalThis.dispatchEvent = function(event) {
    if (__facade_isSpecialEvent__(event.type)) {
      return __FACADE_EVENT_TARGET__.dispatchEvent(event);
    } else {
      return __facade__originalDispatchEvent__(event);
    }
  };
  globalThis.addMiddleware = __facade_register__;
  globalThis.addMiddlewareInternal = __facade_registerInternal__;
  var __facade_waitUntil__ = Symbol("__facade_waitUntil__");
  var __facade_response__ = Symbol("__facade_response__");
  var __facade_dispatched__ = Symbol("__facade_dispatched__");
  var __Facade_ExtendableEvent__ = class extends Event {
    [__facade_waitUntil__] = [];
    waitUntil(promise) {
      if (!(this instanceof __Facade_ExtendableEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this[__facade_waitUntil__].push(promise);
    }
  };
  var __Facade_FetchEvent__ = class extends __Facade_ExtendableEvent__ {
    #request;
    #passThroughOnException;
    [__facade_response__];
    [__facade_dispatched__] = false;
    constructor(type, init) {
      super(type);
      this.#request = init.request;
      this.#passThroughOnException = init.passThroughOnException;
    }
    get request() {
      return this.#request;
    }
    respondWith(response) {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      if (this[__facade_response__] !== void 0) {
        throw new DOMException(
          "FetchEvent.respondWith() has already been called; it can only be called once.",
          "InvalidStateError"
        );
      }
      if (this[__facade_dispatched__]) {
        throw new DOMException(
          "Too late to call FetchEvent.respondWith(). It must be called synchronously in the event handler.",
          "InvalidStateError"
        );
      }
      this.stopImmediatePropagation();
      this[__facade_response__] = response;
    }
    passThroughOnException() {
      if (!(this instanceof __Facade_FetchEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#passThroughOnException();
    }
  };
  var __Facade_ScheduledEvent__ = class extends __Facade_ExtendableEvent__ {
    #scheduledTime;
    #cron;
    #noRetry;
    constructor(type, init) {
      super(type);
      this.#scheduledTime = init.scheduledTime;
      this.#cron = init.cron;
      this.#noRetry = init.noRetry;
    }
    get scheduledTime() {
      return this.#scheduledTime;
    }
    get cron() {
      return this.#cron;
    }
    noRetry() {
      if (!(this instanceof __Facade_ScheduledEvent__)) {
        throw new TypeError("Illegal invocation");
      }
      this.#noRetry();
    }
  };
  __facade__originalAddEventListener__("fetch", (event) => {
    const ctx = {
      waitUntil: event.waitUntil.bind(event),
      passThroughOnException: event.passThroughOnException.bind(event)
    };
    const __facade_sw_dispatch__ = function(type, init) {
      if (type === "scheduled") {
        const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
          scheduledTime: Date.now(),
          cron: init.cron ?? "",
          noRetry() {
          }
        });
        __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
        event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      }
    };
    const __facade_sw_fetch__ = function(request, _env, ctx2) {
      const facadeEvent = new __Facade_FetchEvent__("fetch", {
        request,
        passThroughOnException: ctx2.passThroughOnException
      });
      __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
      facadeEvent[__facade_dispatched__] = true;
      event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
      const response = facadeEvent[__facade_response__];
      if (response === void 0) {
        throw new Error("No response!");
      }
      return response;
    };
    event.respondWith(
      __facade_invoke__(
        event.request,
        globalThis,
        ctx,
        __facade_sw_dispatch__,
        __facade_sw_fetch__
      )
    );
  });
  __facade__originalAddEventListener__("scheduled", (event) => {
    const facadeEvent = new __Facade_ScheduledEvent__("scheduled", {
      scheduledTime: event.scheduledTime,
      cron: event.cron,
      noRetry: event.noRetry.bind(event)
    });
    __FACADE_EVENT_TARGET__.dispatchEvent(facadeEvent);
    event.waitUntil(Promise.all(facadeEvent[__facade_waitUntil__]));
  });

  // ../../home/codespace/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
  var drainBody = async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } finally {
      try {
        if (request.body !== null && !request.bodyUsed) {
          const reader = request.body.getReader();
          while (!(await reader.read()).done) {
          }
        }
      } catch (e) {
        console.error("Failed to drain the unused request body.", e);
      }
    }
  };
  var middleware_ensure_req_body_drained_default = drainBody;

  // ../../home/codespace/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
  function reduceError(e) {
    return {
      name: e?.name,
      message: e?.message ?? String(e),
      stack: e?.stack,
      cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
    };
  }
  var jsonError = async (request, env, _ctx, middlewareCtx) => {
    try {
      return await middlewareCtx.next(request, env);
    } catch (e) {
      const error = reduceError(e);
      return Response.json(error, {
        status: 500,
        headers: { "MF-Experimental-Error-Stack": "true" }
      });
    }
  };
  var middleware_miniflare3_json_error_default = jsonError;

  // .wrangler/tmp/bundle-FXRvz8/middleware-insertion-facade.js
  __facade_registerInternal__([middleware_ensure_req_body_drained_default, middleware_miniflare3_json_error_default]);

  // dist/sw.js
  var KVAdapter = class {
    ns;
    constructor(ns) {
      this.ns = ns;
    }
    async get(key) {
      return await this.ns.get(key);
    }
    async set(key, value) {
      await this.ns.put(key, value);
    }
    async has(key) {
      return (await this.ns.list()).keys.some((e) => e.name === key);
    }
    async delete(key) {
      await this.ns.delete(key);
      return true;
    }
    async *entries() {
      for (const {
        name
      } of (await this.ns.list()).keys)
        yield [name, await this.get(name)];
    }
  };
  var JSONDatabaseAdapter = class {
    impl;
    constructor(impl) {
      this.impl = impl;
    }
    async get(key) {
      const res = await this.impl.get(key);
      if (typeof res === "string")
        return JSON.parse(res);
    }
    async set(key, value) {
      return await this.impl.set(key, JSON.stringify(value));
    }
    async has(key) {
      return await this.impl.has(key);
    }
    async delete(key) {
      return await this.impl.delete(key);
    }
    async *[Symbol.asyncIterator]() {
      for await (const [id, value] of await this.impl.entries()) {
        yield [id, JSON.parse(value)];
      }
    }
  };
  async function cleanupDatabase(database) {
    const adapter = new JSONDatabaseAdapter(database);
    for await (const [id, {
      expires
    }] of adapter)
      if (expires < Date.now())
        database.delete(id);
  }
  var httpErrors = { exports: {} };
  var browser = depd;
  function depd(namespace) {
    if (!namespace) {
      throw new TypeError("argument namespace is required");
    }
    function deprecate(message) {
    }
    deprecate._file = void 0;
    deprecate._ignored = true;
    deprecate._namespace = namespace;
    deprecate._traced = false;
    deprecate._warned = /* @__PURE__ */ Object.create(null);
    deprecate.function = wrapfunction;
    deprecate.property = wrapproperty;
    return deprecate;
  }
  function wrapfunction(fn, message) {
    if (typeof fn !== "function") {
      throw new TypeError("argument fn must be a function");
    }
    return fn;
  }
  function wrapproperty(obj, prop, message) {
    if (!obj || typeof obj !== "object" && typeof obj !== "function") {
      throw new TypeError("argument obj must be object");
    }
    var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (!descriptor) {
      throw new TypeError("must call property on owner object");
    }
    if (!descriptor.configurable) {
      throw new TypeError("property must be configurable");
    }
  }
  var setprototypeof = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);
  function setProtoOf(obj, proto) {
    obj.__proto__ = proto;
    return obj;
  }
  function mixinProperties(obj, proto) {
    for (var prop in proto) {
      if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
        obj[prop] = proto[prop];
      }
    }
    return obj;
  }
  var require$$0 = {
    "100": "Continue",
    "101": "Switching Protocols",
    "102": "Processing",
    "103": "Early Hints",
    "200": "OK",
    "201": "Created",
    "202": "Accepted",
    "203": "Non-Authoritative Information",
    "204": "No Content",
    "205": "Reset Content",
    "206": "Partial Content",
    "207": "Multi-Status",
    "208": "Already Reported",
    "226": "IM Used",
    "300": "Multiple Choices",
    "301": "Moved Permanently",
    "302": "Found",
    "303": "See Other",
    "304": "Not Modified",
    "305": "Use Proxy",
    "307": "Temporary Redirect",
    "308": "Permanent Redirect",
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Payload Too Large",
    "414": "URI Too Long",
    "415": "Unsupported Media Type",
    "416": "Range Not Satisfiable",
    "417": "Expectation Failed",
    "418": "I'm a Teapot",
    "421": "Misdirected Request",
    "422": "Unprocessable Entity",
    "423": "Locked",
    "424": "Failed Dependency",
    "425": "Too Early",
    "426": "Upgrade Required",
    "428": "Precondition Required",
    "429": "Too Many Requests",
    "431": "Request Header Fields Too Large",
    "451": "Unavailable For Legal Reasons",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",
    "505": "HTTP Version Not Supported",
    "506": "Variant Also Negotiates",
    "507": "Insufficient Storage",
    "508": "Loop Detected",
    "509": "Bandwidth Limit Exceeded",
    "510": "Not Extended",
    "511": "Network Authentication Required"
  };
  var codes = require$$0;
  var statuses = status;
  status.message = codes;
  status.code = createMessageToStatusCodeMap(codes);
  status.codes = createStatusCodeList(codes);
  status.redirect = {
    300: true,
    301: true,
    302: true,
    303: true,
    305: true,
    307: true,
    308: true
  };
  status.empty = {
    204: true,
    205: true,
    304: true
  };
  status.retry = {
    502: true,
    503: true,
    504: true
  };
  function createMessageToStatusCodeMap(codes2) {
    var map = {};
    Object.keys(codes2).forEach(function forEachCode(code) {
      var message = codes2[code];
      var status2 = Number(code);
      map[message.toLowerCase()] = status2;
    });
    return map;
  }
  function createStatusCodeList(codes2) {
    return Object.keys(codes2).map(function mapCode(code) {
      return Number(code);
    });
  }
  function getStatusCode(message) {
    var msg = message.toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(status.code, msg)) {
      throw new Error('invalid status message: "' + message + '"');
    }
    return status.code[msg];
  }
  function getStatusMessage(code) {
    if (!Object.prototype.hasOwnProperty.call(status.message, code)) {
      throw new Error("invalid status code: " + code);
    }
    return status.message[code];
  }
  function status(code) {
    if (typeof code === "number") {
      return getStatusMessage(code);
    }
    if (typeof code !== "string") {
      throw new TypeError("code must be a number or string");
    }
    var n = parseInt(code, 10);
    if (!isNaN(n)) {
      return getStatusMessage(n);
    }
    return getStatusCode(code);
  }
  var inherits_browser = { exports: {} };
  if (typeof Object.create === "function") {
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
  var toidentifier = toIdentifier;
  function toIdentifier(str) {
    return str.split(" ").map(function(token) {
      return token.slice(0, 1).toUpperCase() + token.slice(1);
    }).join("").replace(/[^ _0-9a-z]/gi, "");
  }
  (function(module) {
    browser("http-errors");
    var setPrototypeOf = setprototypeof;
    var statuses$1 = statuses;
    var inherits = inherits_browser.exports;
    var toIdentifier2 = toidentifier;
    module.exports = createError;
    module.exports.HttpError = createHttpErrorConstructor();
    module.exports.isHttpError = createIsHttpErrorFunction(module.exports.HttpError);
    populateConstructorExports(module.exports, statuses$1.codes, module.exports.HttpError);
    function codeClass(status2) {
      return Number(String(status2).charAt(0) + "00");
    }
    function createError() {
      var err;
      var msg;
      var status2 = 500;
      var props = {};
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var type = typeof arg;
        if (type === "object" && arg instanceof Error) {
          err = arg;
          status2 = err.status || err.statusCode || status2;
        } else if (type === "number" && i === 0) {
          status2 = arg;
        } else if (type === "string") {
          msg = arg;
        } else if (type === "object") {
          props = arg;
        } else {
          throw new TypeError("argument #" + (i + 1) + " unsupported type " + type);
        }
      }
      if (typeof status2 !== "number" || !statuses$1.message[status2] && (status2 < 400 || status2 >= 600)) {
        status2 = 500;
      }
      var HttpError = createError[status2] || createError[codeClass(status2)];
      if (!err) {
        err = HttpError ? new HttpError(msg) : new Error(msg || statuses$1.message[status2]);
        Error.captureStackTrace(err, createError);
      }
      if (!HttpError || !(err instanceof HttpError) || err.status !== status2) {
        err.expose = status2 < 500;
        err.status = err.statusCode = status2;
      }
      for (var key in props) {
        if (key !== "status" && key !== "statusCode") {
          err[key] = props[key];
        }
      }
      return err;
    }
    function createHttpErrorConstructor() {
      function HttpError() {
        throw new TypeError("cannot construct abstract class");
      }
      inherits(HttpError, Error);
      return HttpError;
    }
    function createClientErrorConstructor(HttpError, name, code) {
      var className = toClassName(name);
      function ClientError(message) {
        var msg = message != null ? message : statuses$1.message[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ClientError);
        setPrototypeOf(err, ClientError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ClientError, HttpError);
      nameFunc(ClientError, className);
      ClientError.prototype.status = code;
      ClientError.prototype.statusCode = code;
      ClientError.prototype.expose = true;
      return ClientError;
    }
    function createIsHttpErrorFunction(HttpError) {
      return function isHttpError(val) {
        if (!val || typeof val !== "object") {
          return false;
        }
        if (val instanceof HttpError) {
          return true;
        }
        return val instanceof Error && typeof val.expose === "boolean" && typeof val.statusCode === "number" && val.status === val.statusCode;
      };
    }
    function createServerErrorConstructor(HttpError, name, code) {
      var className = toClassName(name);
      function ServerError(message) {
        var msg = message != null ? message : statuses$1.message[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ServerError);
        setPrototypeOf(err, ServerError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ServerError, HttpError);
      nameFunc(ServerError, className);
      ServerError.prototype.status = code;
      ServerError.prototype.statusCode = code;
      ServerError.prototype.expose = false;
      return ServerError;
    }
    function nameFunc(func, name) {
      var desc = Object.getOwnPropertyDescriptor(func, "name");
      if (desc && desc.configurable) {
        desc.value = name;
        Object.defineProperty(func, "name", desc);
      }
    }
    function populateConstructorExports(exports, codes2, HttpError) {
      codes2.forEach(function forEachCode(code) {
        var CodeError;
        var name = toIdentifier2(statuses$1.message[code]);
        switch (codeClass(code)) {
          case 400:
            CodeError = createClientErrorConstructor(HttpError, name, code);
            break;
          case 500:
            CodeError = createServerErrorConstructor(HttpError, name, code);
            break;
        }
        if (CodeError) {
          exports[code] = CodeError;
          exports[name] = CodeError;
        }
      });
    }
    function toClassName(name) {
      return name.substr(-5) !== "Error" ? name + "Error" : name;
    }
  })(httpErrors);
  var createHttpError = httpErrors.exports;
  var BareError = class extends Error {
    status;
    body;
    constructor(status2, body) {
      super(body.message || body.code);
      this.status = status2;
      this.body = body;
    }
  };
  var project = {
    name: "bare-server-worker",
    description: "TOMPHTTP Cloudflare Bare Server",
    repository: "https://github.com/tomphttp/bare-server-worker",
    version: "1.2.2"
  };
  function json(status2, json2) {
    return new Response(JSON.stringify(json2, null, "	"), {
      status: status2,
      headers: {
        "content-type": "application/json"
      }
    });
  }
  var Server = class extends EventTarget {
    routes = /* @__PURE__ */ new Map();
    socketRoutes = /* @__PURE__ */ new Map();
    closed = false;
    directory;
    options;
    /**
     * @internal
     */
    constructor(directory, options) {
      super();
      this.directory = directory;
      this.options = options;
    }
    /**
     * Remove all timers and listeners
     */
    close() {
      this.closed = true;
      this.dispatchEvent(new Event("close"));
    }
    shouldRoute(request) {
      return !this.closed && new URL(request.url).pathname.startsWith(this.directory);
    }
    get instanceInfo() {
      return {
        versions: ["v1", "v2"],
        language: "Cloudflare",
        maintainer: this.options.maintainer,
        project
      };
    }
    async routeRequest(request) {
      const service = new URL(request.url).pathname.slice(this.directory.length - 1);
      let response;
      const isSocket = request.headers.get("upgrade") === "websocket";
      try {
        if (request.method === "OPTIONS") {
          response = new Response(void 0, {
            status: 200
          });
        } else if (service === "/") {
          response = json(200, this.instanceInfo);
        } else if (!isSocket && this.routes.has(service)) {
          const call = this.routes.get(service);
          response = await call(request, this.options);
        } else if (isSocket && this.socketRoutes.has(service)) {
          const call = this.socketRoutes.get(service);
          response = await call(request, this.options);
        } else {
          throw new createHttpError.NotFound();
        }
      } catch (error) {
        if (this.options.logErrors)
          console.error(error);
        if (createHttpError.isHttpError(error)) {
          response = json(error.statusCode, {
            code: "UNKNOWN",
            id: `error.${error.name}`,
            message: error.message,
            stack: error.stack
          });
        } else if (error instanceof Error) {
          response = json(500, {
            code: "UNKNOWN",
            id: `error.${error.name}`,
            message: error.message,
            stack: error.stack
          });
        } else {
          response = json(500, {
            code: "UNKNOWN",
            id: "error.Exception",
            message: error,
            stack: new Error(error).stack
          });
        }
        if (!(response instanceof Response)) {
          if (this.options.logErrors) {
            console.error("Cannot", request.method, new URL(request.url).pathname, ": Route did not return a response.");
          }
          throw new createHttpError.InternalServerError();
        }
      }
      response.headers.set("x-robots-tag", "noindex");
      response.headers.set("access-control-allow-headers", "*");
      response.headers.set("access-control-allow-origin", "*");
      response.headers.set("access-control-allow-methods", "*");
      response.headers.set("access-control-expose-headers", "*");
      response.headers.set("access-control-max-age", "7200");
      return response;
    }
  };
  var reserveChar = "%";
  function decodeProtocol(protocol) {
    let result = "";
    for (let i = 0; i < protocol.length; i++) {
      const char = protocol[i];
      if (char === reserveChar) {
        const code = parseInt(protocol.slice(i + 1, i + 3), 16);
        const decoded = String.fromCharCode(code);
        result += decoded;
        i += 2;
      } else {
        result += char;
      }
    }
    return result;
  }
  function randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    let hex = "";
    for (const byte of bytes)
      hex += byte.toString(16).padStart(2, "0");
    return hex;
  }
  var noBody = ["GET", "HEAD"];
  async function bareFetch(request, signal, requestHeaders, remote) {
    return await fetch(`${remote.protocol}//${remote.host}:${remote.port}${remote.path}`, {
      headers: requestHeaders,
      method: request.method,
      body: noBody.includes(request.method) ? void 0 : await request.blob(),
      signal,
      redirect: "manual"
    });
  }
  async function upgradeBareFetch(request, signal, requestHeaders, remote) {
    const res = await fetch(`${remote.protocol}//${remote.host}:${remote.port}${remote.path}`, {
      headers: requestHeaders,
      method: request.method,
      signal
    });
    if (!res.webSocket)
      throw new Error("server didn't accept WebSocket");
    return [res, res.webSocket];
  }
  var validProtocols$1 = ["http:", "https:", "ws:", "wss:"];
  function loadForwardedHeaders$1(forward, target, request) {
    for (const header of forward) {
      if (request.headers.has(header)) {
        target[header] = request.headers.get(header);
      }
    }
  }
  function readHeaders$1(request) {
    const remote = {};
    const headers = {};
    Reflect.setPrototypeOf(headers, null);
    for (const remoteProp of ["host", "port", "protocol", "path"]) {
      const header = `x-bare-${remoteProp}`;
      if (request.headers.has(header)) {
        const value = request.headers.get(header);
        switch (remoteProp) {
          case "port":
            if (isNaN(parseInt(value))) {
              throw new BareError(400, {
                code: "INVALID_BARE_HEADER",
                id: `request.headers.${header}`,
                message: `Header was not a valid integer.`
              });
            }
            break;
          case "protocol":
            if (!validProtocols$1.includes(value)) {
              throw new BareError(400, {
                code: "INVALID_BARE_HEADER",
                id: `request.headers.${header}`,
                message: `Header was invalid`
              });
            }
            break;
        }
        remote[remoteProp] = value;
      } else {
        throw new BareError(400, {
          code: "MISSING_BARE_HEADER",
          id: `request.headers.${header}`,
          message: `Header was not specified.`
        });
      }
    }
    if (request.headers.has("x-bare-headers")) {
      try {
        const json2 = JSON.parse(request.headers.get("x-bare-headers"));
        for (const header in json2) {
          if (typeof json2[header] !== "string" && !Array.isArray(json2[header])) {
            throw new BareError(400, {
              code: "INVALID_BARE_HEADER",
              id: `bare.headers.${header}`,
              message: `Header was not a String or Array.`
            });
          }
        }
        Object.assign(headers, json2);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new BareError(400, {
            code: "INVALID_BARE_HEADER",
            id: `request.headers.x-bare-headers`,
            message: `Header contained invalid JSON. (${error.message})`
          });
        } else {
          throw error;
        }
      }
    } else {
      throw new BareError(400, {
        code: "MISSING_BARE_HEADER",
        id: `request.headers.x-bare-headers`,
        message: `Header was not specified.`
      });
    }
    if (request.headers.has("x-bare-forward-headers")) {
      let json2;
      try {
        json2 = JSON.parse(request.headers.get("x-bare-forward-headers"));
      } catch (error) {
        throw new BareError(400, {
          code: "INVALID_BARE_HEADER",
          id: `request.headers.x-bare-forward-headers`,
          message: `Header contained invalid JSON. (${error instanceof Error ? error.message : error})`
        });
      }
      loadForwardedHeaders$1(json2, headers, request);
    } else {
      throw new BareError(400, {
        code: "MISSING_BARE_HEADER",
        id: `request.headers.x-bare-forward-headers`,
        message: `Header was not specified.`
      });
    }
    return {
      remote,
      headers
    };
  }
  var tunnelRequest$1 = async (request) => {
    const {
      remote,
      headers
    } = readHeaders$1(request);
    const response = await bareFetch(request, request.signal, headers, remote);
    const responseHeaders = new Headers();
    for (const [header, value] of response.headers) {
      if (header === "content-encoding" || header === "x-content-encoding")
        responseHeaders.set("content-encoding", value);
      else if (header === "content-length")
        responseHeaders.set("content-length", value);
    }
    responseHeaders.set("x-bare-headers", JSON.stringify(Object.fromEntries(response.headers)));
    responseHeaders.set("x-bare-status", response.status.toString());
    responseHeaders.set("x-bare-status-text", response.statusText);
    return new Response(response.body, {
      status: 200,
      headers: responseHeaders
    });
  };
  var metaExpiration$1 = 3e4;
  var wsMeta = async (request, options) => {
    if (request.method === "OPTIONS") {
      return new Response(void 0, {
        status: 200
      });
    }
    if (!request.headers.has("x-bare-id")) {
      throw new BareError(400, {
        code: "MISSING_BARE_HEADER",
        id: "request.headers.x-bare-id",
        message: "Header was not specified"
      });
    }
    const id = request.headers.get("x-bare-id");
    const meta = await options.database.get(id);
    if (meta?.value.v !== 1)
      throw new BareError(400, {
        code: "INVALID_BARE_HEADER",
        id: "request.headers.x-bare-id",
        message: "Unregistered ID"
      });
    await options.database.delete(id);
    return json(200, {
      headers: meta.value.response?.headers
    });
  };
  var wsNewMeta = async (request, options) => {
    const id = randomHex(16);
    await options.database.set(id, {
      value: {
        v: 1
      },
      expires: Date.now() + metaExpiration$1
    });
    return new Response(id);
  };
  var tunnelSocket$1 = async (request, options) => {
    const [firstProtocol, data] = request.headers.get("sec-websocket-protocol")?.split(/,\s*/g) || [];
    if (firstProtocol !== "bare")
      throw new BareError(400, {
        code: "INVALID_BARE_HEADER",
        id: `request.headers.sec-websocket-protocol`,
        message: `Meta was not specified.`
      });
    const {
      remote,
      headers,
      forward_headers: forwardHeaders,
      id
    } = JSON.parse(decodeProtocol(data));
    loadForwardedHeaders$1(forwardHeaders, headers, request);
    if (!id)
      throw new BareError(400, {
        code: "INVALID_BARE_HEADER",
        id: `request.headers.sec-websocket-protocol`,
        message: `Expected ID.`
      });
    const [remoteResponse, remoteSocket] = await upgradeBareFetch(request, request.signal, headers, remote);
    const meta = await options.database.get(id);
    if (meta?.value.v === 1) {
      meta.value.response = {
        headers: Object.fromEntries(remoteResponse.headers)
      };
      await options.database.set(id, meta);
    }
    return new Response(void 0, {
      status: 101,
      webSocket: remoteSocket
    });
  };
  function registerV1(server) {
    server.routes.set("/v1/", tunnelRequest$1);
    server.routes.set("/v1/ws-new-meta", wsNewMeta);
    server.routes.set("/v1/ws-meta", wsMeta);
    server.socketRoutes.set("/v1/", tunnelSocket$1);
  }
  var MAX_HEADER_VALUE = 3072;
  function splitHeaders(headers) {
    const output = new Headers(headers);
    if (headers.has("x-bare-headers")) {
      const value = headers.get("x-bare-headers");
      if (value.length > MAX_HEADER_VALUE) {
        output.delete("x-bare-headers");
        let split = 0;
        for (let i = 0; i < value.length; i += MAX_HEADER_VALUE) {
          const part = value.slice(i, i + MAX_HEADER_VALUE);
          const id = split++;
          output.set(`x-bare-headers-${id}`, `;${part}`);
        }
      }
    }
    return output;
  }
  function joinHeaders(headers) {
    const output = new Headers(headers);
    const prefix = "x-bare-headers";
    if (headers.has(`${prefix}-0`)) {
      const join = [];
      for (const [header, value] of headers) {
        if (!header.startsWith(prefix)) {
          continue;
        }
        if (!value.startsWith(";")) {
          throw new BareError(400, {
            code: "INVALID_BARE_HEADER",
            id: `request.headers.${header}`,
            message: `Value didn't begin with semi-colon.`
          });
        }
        const id = parseInt(header.slice(prefix.length + 1));
        join[id] = value.slice(1);
        output.delete(header);
      }
      output.set(prefix, join.join(""));
    }
    return output;
  }
  var validProtocols = ["http:", "https:", "ws:", "wss:"];
  var forbiddenForwardHeaders = ["connection", "transfer-encoding", "host", "connection", "origin", "referer"];
  var forbiddenPassHeaders = ["vary", "connection", "transfer-encoding", "access-control-allow-headers", "access-control-allow-methods", "access-control-expose-headers", "access-control-max-age", "access-control-request-headers", "access-control-request-method"];
  var defaultForwardHeaders = ["accept-encoding", "accept-language", "sec-websocket-extensions", "sec-websocket-key", "sec-websocket-version"];
  var defaultPassHeaders = ["content-encoding", "content-length", "last-modified"];
  var defaultCacheForwardHeaders = ["if-modified-since", "if-none-match", "cache-control"];
  var defaultCachePassHeaders = ["cache-control", "etag"];
  var cacheNotModified = 304;
  function loadForwardedHeaders(forward, target, request) {
    for (const header of forward) {
      if (request.headers.has(header)) {
        target[header] = request.headers.get(header);
      }
    }
  }
  var splitHeaderValue = /,\s*/g;
  function readHeaders(request) {
    const remote = Object.setPrototypeOf({}, null);
    const sendHeaders = Object.setPrototypeOf({}, null);
    const passHeaders = [...defaultPassHeaders];
    const passStatus = [];
    const forwardHeaders = [...defaultForwardHeaders];
    const cache = new URL(request.url).searchParams.has("cache");
    if (cache) {
      passHeaders.push(...defaultCachePassHeaders);
      passStatus.push(cacheNotModified);
      forwardHeaders.push(...defaultCacheForwardHeaders);
    }
    const headers = joinHeaders(request.headers);
    for (const remoteProp of ["host", "port", "protocol", "path"]) {
      const header = `x-bare-${remoteProp}`;
      if (headers.has(header)) {
        const value = headers.get(header);
        switch (remoteProp) {
          case "port":
            if (isNaN(parseInt(value))) {
              throw new BareError(400, {
                code: "INVALID_BARE_HEADER",
                id: `request.headers.${header}`,
                message: `Header was not a valid integer.`
              });
            }
            break;
          case "protocol":
            if (!validProtocols.includes(value)) {
              throw new BareError(400, {
                code: "INVALID_BARE_HEADER",
                id: `request.headers.${header}`,
                message: `Header was invalid`
              });
            }
            break;
        }
        remote[remoteProp] = value;
      } else {
        throw new BareError(400, {
          code: "MISSING_BARE_HEADER",
          id: `request.headers.${header}`,
          message: `Header was not specified.`
        });
      }
    }
    if (headers.has("x-bare-headers")) {
      try {
        const json2 = JSON.parse(headers.get("x-bare-headers"));
        for (const header in json2) {
          const value = json2[header];
          if (typeof value === "string") {
            sendHeaders[header] = value;
          } else if (Array.isArray(value)) {
            const array = [];
            for (const val in value) {
              if (typeof val !== "string") {
                throw new BareError(400, {
                  code: "INVALID_BARE_HEADER",
                  id: `bare.headers.${header}`,
                  message: `Header was not a String.`
                });
              }
              array.push(val);
            }
            sendHeaders[header] = array;
          } else {
            throw new BareError(400, {
              code: "INVALID_BARE_HEADER",
              id: `bare.headers.${header}`,
              message: `Header was not a String.`
            });
          }
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new BareError(400, {
            code: "INVALID_BARE_HEADER",
            id: `request.headers.x-bare-headers`,
            message: `Header contained invalid JSON. (${error.message})`
          });
        } else {
          throw error;
        }
      }
    } else {
      throw new BareError(400, {
        code: "MISSING_BARE_HEADER",
        id: `request.headers.x-bare-headers`,
        message: `Header was not specified.`
      });
    }
    if (headers.has("x-bare-pass-status")) {
      const parsed = headers.get("x-bare-pass-status").split(splitHeaderValue);
      for (const value of parsed) {
        const number = parseInt(value);
        if (isNaN(number)) {
          throw new BareError(400, {
            code: "INVALID_BARE_HEADER",
            id: `request.headers.x-bare-pass-status`,
            message: `Array contained non-number value.`
          });
        } else {
          passStatus.push(number);
        }
      }
    }
    if (headers.has("x-bare-pass-headers")) {
      const parsed = headers.get("x-bare-pass-headers").split(splitHeaderValue);
      for (let header of parsed) {
        header = header.toLowerCase();
        if (forbiddenPassHeaders.includes(header)) {
          throw new BareError(400, {
            code: "FORBIDDEN_BARE_HEADER",
            id: `request.headers.x-bare-forward-headers`,
            message: `A forbidden header was passed.`
          });
        } else {
          passHeaders.push(header);
        }
      }
    }
    if (headers.has("x-bare-forward-headers")) {
      const parsed = headers.get("x-bare-forward-headers").split(splitHeaderValue);
      for (let header of parsed) {
        header = header.toLowerCase();
        if (forbiddenForwardHeaders.includes(header)) {
          throw new BareError(400, {
            code: "FORBIDDEN_BARE_HEADER",
            id: `request.headers.x-bare-forward-headers`,
            message: `A forbidden header was forwarded.`
          });
        } else {
          forwardHeaders.push(header);
        }
      }
    }
    return {
      remote,
      sendHeaders,
      passHeaders,
      passStatus,
      forwardHeaders
    };
  }
  var tunnelRequest = async (request) => {
    const {
      remote,
      sendHeaders,
      passHeaders,
      passStatus,
      forwardHeaders
    } = readHeaders(request);
    loadForwardedHeaders(forwardHeaders, sendHeaders, request);
    const response = await bareFetch(request, request.signal, sendHeaders, remote);
    const responseHeaders = new Headers();
    for (const [header, value] of passHeaders) {
      if (!response.headers.has(header))
        continue;
      responseHeaders.set(header, value);
    }
    const status2 = passStatus.includes(response.status) ? response.status : 200;
    if (status2 !== cacheNotModified) {
      responseHeaders.set("x-bare-status", response.status.toString());
      responseHeaders.set("x-bare-status-text", response.statusText);
      responseHeaders.set("x-bare-headers", JSON.stringify(Object.fromEntries(response.headers)));
    }
    return new Response(response.body, {
      status: status2,
      headers: splitHeaders(responseHeaders)
    });
  };
  var metaExpiration = 3e4;
  var getMeta = async (request, options) => {
    if (request.method === "OPTIONS") {
      return new Response(void 0, {
        status: 200
      });
    }
    if (!request.headers.has("x-bare-id")) {
      throw new BareError(400, {
        code: "MISSING_BARE_HEADER",
        id: "request.headers.x-bare-id",
        message: "Header was not specified"
      });
    }
    const id = request.headers.get("x-bare-id");
    const meta = await options.database.get(id);
    if (meta?.value.v !== 2)
      throw new BareError(400, {
        code: "INVALID_BARE_HEADER",
        id: "request.headers.x-bare-id",
        message: "Unregistered ID"
      });
    if (!meta.value.response)
      throw new BareError(400, {
        code: "INVALID_BARE_HEADER",
        id: "request.headers.x-bare-id",
        message: "Meta not ready"
      });
    await options.database.delete(id);
    const responseHeaders = new Headers();
    responseHeaders.set("x-bare-status", meta.value.response.status.toString());
    responseHeaders.set("x-bare-status-text", meta.value.response.statusText);
    responseHeaders.set("x-bare-headers", JSON.stringify(meta.value.response.headers));
    return new Response(void 0, {
      status: 200,
      headers: splitHeaders(responseHeaders)
    });
  };
  var newMeta = async (request, options) => {
    const {
      remote,
      sendHeaders,
      forwardHeaders
    } = readHeaders(request);
    const id = randomHex(16);
    await options.database.set(id, {
      expires: Date.now() + metaExpiration,
      value: {
        v: 2,
        remote,
        sendHeaders,
        forwardHeaders
      }
    });
    return new Response(id);
  };
  var tunnelSocket = async (request, options) => {
    const id = request.headers.get("sec-websocket-protocol");
    if (!id)
      throw new BareError(400, {
        code: "INVALID_BARE_HEADER",
        id: `request.headers.sec-websocket-protocol`,
        message: `Expected ID.`
      });
    const meta = await options.database.get(id);
    if (meta?.value.v !== 2)
      throw new BareError(400, {
        code: "INVALID_BARE_HEADER",
        id: `request.headers.sec-websocket-protocol`,
        message: `Bad ID.`
      });
    loadForwardedHeaders(meta.value.forwardHeaders, meta.value.sendHeaders, request);
    const [remoteResponse, remoteSocket] = await upgradeBareFetch(request, request.signal, meta.value.sendHeaders, meta.value.remote);
    meta.value.response = {
      headers: Object.fromEntries(remoteResponse.headers),
      status: remoteResponse.status,
      statusText: remoteResponse.statusText
    };
    await options.database.set(id, meta);
    return new Response(void 0, {
      status: 101,
      webSocket: remoteSocket
    });
  };
  function registerV2(server) {
    server.routes.set("/v2/", tunnelRequest);
    server.routes.set("/v2/ws-new-meta", newMeta);
    server.routes.set("/v2/ws-meta", getMeta);
    server.socketRoutes.set("/v2/", tunnelSocket);
  }
  function createBareServer(directory, init = {}) {
    if (typeof directory !== "string")
      throw new Error("Directory must be specified.");
    if (!directory.startsWith("/") || !directory.endsWith("/"))
      throw new RangeError("Directory must start and end with /");
    init.logErrors ??= false;
    const cleanup = [];
    if (!init.database) {
      const database = /* @__PURE__ */ new Map();
      const interval = setInterval(() => cleanupDatabase(database), 1e3);
      init.database = database;
      cleanup.push(() => clearInterval(interval));
    }
    const server = new Server(directory, {
      ...init,
      database: new JSONDatabaseAdapter(init.database)
    });
    registerV1(server);
    registerV2(server);
    server.addEventListener("close", () => {
      for (const cb of cleanup)
        cb();
    });
    return server;
  }
  var kvDB = new KVAdapter(bare);
  var bare = createBareServer("/", {
    logErrors: true,
    database: kvDB
  });
  addEventListener("fetch", (event) => {
    cleanupDatabase(kvDB);
    if (bare.shouldRoute(event.request))
      event.respondWith(bare.routeRequest(event.request));
  });
})();
/*!
 * depd
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * toidentifier
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * http-errors
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=sw.js.map
