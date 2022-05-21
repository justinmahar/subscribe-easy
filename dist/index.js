"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriptions = exports.Subscribe = void 0;
/**
 * Static functions for subscribing and unsubscribing to and from events.
 */
class Subscribe {
    /**
     * Call a function that adds a listener and returns a function that will unsubscribe the listener.
     *
     * The function passed in will be called immediately to add the listener,
     * and its Unsubscribe function will be returned.
     *
     * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
     * @returns The Unsubscribe function for this subscription.
     */
    static subscribe(subscribe) {
        try {
            return subscribe();
        }
        catch (e) {
            console.error(e);
        }
        return () => {
            // No-op when catching an error
        };
    }
    /**
     * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
     *
     * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @returns The Unsubscribe function for this subscription.
     */
    static subscribeEvent(eventEmitter, eventName, listener) {
        eventEmitter.addListener(eventName, listener);
        return () => {
            eventEmitter.removeListener(eventName, listener);
        };
    }
    /**
     * Subscribe to an event on a DOM object (Window or Node). Returns a function that will unsubscribe the listener.
     *
     * @param domObj The DOM object to subscribe to for events.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @returns The Unsubscribe function for this subscription.
     */
    static subscribeDOMEvent(domObj, eventName, listener) {
        domObj.addEventListener(eventName, listener);
        return () => {
            domObj.removeEventListener(eventName, listener);
        };
    }
    /**
     * Call all unsubscribe functions passed in. Can pass either an array of unsubscribe functions,
     * or a single unsubscribe function.
     *
     * @param unsubs An array of unsubscribe functions, or a single unsubscribe function.
     */
    static unsubscribeAll(unsubs) {
        if (Array.isArray(unsubs)) {
            unsubs.forEach((unsub) => {
                try {
                    unsub();
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
        else {
            try {
                unsubs();
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
exports.Subscribe = Subscribe;
/**
 * A Subscriptions object can be used to subscribe and unsubscribe to events,
 * and to collect subscriptions in an array to be unsubscribed all at once.
 *
 * Calling any of the subscribe functions will add the unsubscribe function to
 * an internal array. You can then call `unsubscribeAll()` to unsubscribe all
 * at once and clear the list.
 */
class Subscriptions {
    /**
     * Construct a new Subscriptions object.
     *
     * A Subscriptions object can be used to subscribe and unsubscribe to events,
     * and to collect subscriptions in an array to be unsubscribed all at once.
     *
     * Calling any of the subscribe functions will add the unsubscribe function to
     * an internal array. You can then call `unsubscribeAll()` to unsubscribe all
     * at once and clear the list.
     *
     * You can optionally pass in an array of unsubscribe functions to start with.
     *
     * @param unsubs Optional array of unsubscribe functions. Defaults to an empty list.
     */
    constructor(
    /** A list of unsubscribe functions for all subscribe calls that have been made. */
    unsubs = []) {
        this.unsubs = unsubs;
    }
    /**
     * Call a function that adds a listener and returns a function that will unsubscribe the listener.
     *
     * The function passed in will be called immediately to add the listener,
     * and its Unsubscribe function will be returned.
     *
     * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
     *
     * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
     * @returns The Unsubscribe function for this subscription.
     */
    subscribe(subscribe) {
        const unsub = Subscribe.subscribe(subscribe);
        this.unsubs.push(unsub);
        return unsub;
    }
    /**
     * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
     *
     * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
     *
     * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @returns The Unsubscribe function for this subscription.
     */
    subscribeEvent(eventEmitter, eventName, listener) {
        const unsub = Subscribe.subscribeEvent(eventEmitter, eventName, listener);
        this.unsubs.push(unsub);
        return unsub;
    }
    /**
     * Subscribe to an event on a DOM object (Window or Node). Returns a function that will unsubscribe the listener.
     *
     * The Unsubscribe will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubscribeAll()`.
     *
     * @param domObj The DOM object to subscribe to for events.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @returns The Unsubscribe function for this subscription.
     */
    subscribeDOMEvent(domObj, eventName, listener) {
        const unsub = Subscribe.subscribeDOMEvent(domObj, eventName, listener);
        this.unsubs.push(unsub);
        return unsub;
    }
    /**
     * Call all unsubscribe functions and clear the unsubscribe list.
     */
    unsubscribeAll() {
        Subscribe.unsubscribeAll(this.unsubs);
        this.unsubs = [];
    }
}
exports.Subscriptions = Subscriptions;